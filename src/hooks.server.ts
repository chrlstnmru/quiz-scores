import { redirect, type Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth.js';
import { sequence } from '@sveltejs/kit/hooks';
import { isAdminExists } from '$lib/server/user';

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);
	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

const handleAdminRoute: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname;
	if (path.startsWith('/admin') === false) return resolve(event);

	const adminExists = await isAdminExists();

	if (!adminExists) {
		if (path !== '/admin/setup') {
			return redirect(302, '/admin/setup');
		}
		return resolve(event);
	}

	if (adminExists && path === '/admin/setup') {
		return redirect(302, '/admin');
	}

	if (!event.locals.user) {
		if (path !== '/admin/login') {
			return redirect(302, '/admin/login');
		}
		return resolve(event);
	}

	if (event.locals.user && path === '/admin/login') {
		return redirect(302, '/admin');
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleAuth, handleAdminRoute);
