import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { adminLoginFormSchema } from '$lib/validators/auth.js';
import { getUserByUsername } from '$lib/server/user.js';
import { verifyPasswordHash } from '$lib/server/password';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth.js';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const loginForm = await superValidate(event, zod(adminLoginFormSchema));
	return { loginForm };
};

export const actions = {
	default: async (event) => {
		const loginForm = await superValidate(event, zod(adminLoginFormSchema));
		if (!loginForm.valid) {
			return fail(400, { loginForm });
		}

		const { username, password } = loginForm.data;
		const user = await getUserByUsername(username);
		if (!user) {
			loginForm.data.password = '';
			return setError(loginForm, 'username', 'Invalid username or password');
		}

		const isPasswordValid = await verifyPasswordHash(user.password, password);
		if (!isPasswordValid) {
			loginForm.data.password = '';
			return setError(loginForm, 'username', 'Invalid username or password');
		}

		// Set session data
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, user.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/admin');
	}
};
