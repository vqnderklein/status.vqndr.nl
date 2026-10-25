import {
	pgTable,
	serial,
	varchar,
	timestamp,
	pgEnum,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["admin", "operator", "user"]);

export const users = pgTable("users", {
	id: serial("id").primaryKey(),

	email: varchar("email", { length: 255 }).notNull().unique(),

	passwordHash: varchar("password_hash", { length: 255 }),

	role: userRoleEnum("role").notNull().default("user"),

	emailVerifiedAt: timestamp("email_verified_at", {
		withTimezone: true,
	}),

	createdAt: timestamp("created_at", {
		withTimezone: true,
	})
		.notNull()
		.defaultNow(),

	updatedAt: timestamp("updated_at", {
		withTimezone: true,
	})
		.notNull()
		.defaultNow(),
});
