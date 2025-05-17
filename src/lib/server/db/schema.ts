import { pgTable, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const userTable = pgTable('user', {
	id: text('id').primaryKey(),
	username: varchar('username', { length: 20 }).notNull().unique(),
	password: varchar('password', { length: 255 }).notNull()
});

export const scoreTable = pgTable('scores', {
	id: text('id').primaryKey(),
	name: varchar('name', { length: 150 }).notNull(),
	accessCode: varchar('access_code', { length: 10 }).notNull(),
	score: integer('score').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const sessionTable = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export type Session = typeof sessionTable.$inferSelect;

export type User = typeof userTable.$inferSelect;
