import { SQL, sql } from 'drizzle-orm';
import {
	pgTable,
	varchar,
	text,
	integer,
	timestamp,
	uniqueIndex,
	type AnyPgColumn
} from 'drizzle-orm/pg-core';

export function lower(email: AnyPgColumn): SQL {
	return sql`lower(${email})`;
}

export const userTable = pgTable('user', {
	id: text('id').primaryKey(),
	username: varchar('username', { length: 20 }).notNull().unique(),
	password: varchar('password', { length: 255 }).notNull()
});

export const scoreTable = pgTable(
	'scores',
	{
		id: text('id').primaryKey(),
		name: varchar('name', { length: 150 }).notNull(),
		accessCode: varchar('access_code', { length: 255 }).notNull(),
		score: integer('score').notNull(),
		iv: varchar('iv', { length: 255 }).notNull(),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
	},
	(table) => [uniqueIndex('unique_name_idx').on(lower(table.name))]
);

export const sessionTable = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export type Session = typeof sessionTable.$inferSelect;

export type User = typeof userTable.$inferSelect;
