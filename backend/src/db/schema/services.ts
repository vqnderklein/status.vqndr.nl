import {
	pgTable,
	serial,
	integer,
	varchar,
	text,
	boolean,
	timestamp,
	index,
	uniqueIndex,
} from "drizzle-orm/pg-core";

import type { AnyPgColumn } from "drizzle-orm/pg-core";

export const serviceGroups = pgTable("service_groups", {
	id: serial("id").primaryKey(),

	name: varchar("name", { length: 100 }).notNull(),

	slug: varchar("slug", { length: 120 }).notNull().unique(),

	description: text("description"),

	sortOrder: integer("sort_order").notNull().default(0),

	createdAt: timestamp("created_at", {
		withTimezone: true,
	})
		.notNull()
		.defaultNow(),
});

export const services = pgTable(
	"services",
	{
		id: serial("id").primaryKey(),

		parentId: integer("parent_id").references(
			(): AnyPgColumn => services.id,
			{
				onDelete: "set null",
			},
		),

		groupId: integer("group_id").references(() => serviceGroups.id, {
			onDelete: "set null",
		}),

		name: varchar("name", { length: 150 }).notNull(),

		slug: varchar("slug", { length: 180 }).notNull().unique(),

		description: text("description"),

		sortOrder: integer("sort_order").notNull().default(0),

		isPublic: boolean("is_public").notNull().default(true),

		monitoringEnabled: boolean("monitoring_enabled")
			.notNull()
			.default(true),

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
	},
	(table) => [
		index("services_parent_id_idx").on(table.parentId),
		index("services_group_id_idx").on(table.groupId),
	],
);
