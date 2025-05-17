import { generateId } from '$lib/utils';
import { eq } from 'drizzle-orm';
import { db } from './db';
import { userTable } from './db/schema';
import { hashPassword } from './password';

export async function isAdminExists() {
	const user = await db.query.userTable.findFirst();
	return user !== undefined;
}

export async function createAdmin(username: string, password: string) {
	const passwordHash = await hashPassword(password);
	const [user] = await db
		.insert(userTable)
		.values({
			id: generateId(),
			username,
			password: passwordHash
		})
		.returning();

	if (!user) {
		throw new Error('Failed to create admin user');
	}

	return user;
}

export function getUserByUsername(username: string) {
	return db.query.userTable.findFirst({
		where: (user) => eq(user.username, username)
	});
}
