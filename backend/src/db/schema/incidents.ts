
import {
    pgTable,
    pgEnum,
    serial,
    integer,
    varchar,
    text,
    timestamp,
    index,
    uniqueIndex,
    primaryKey,
} from "drizzle-orm/pg-core";

import { services } from "./services.js";
import { users } from "./users.js";
import { serviceStatusEnum } from "./monitoring.js";

export const incidentStatusEnum = pgEnum("incident_status", [
    "investigating",
    "identified",
    "monitoring",
    "resolved",
]);

export const incidentImpactEnum = pgEnum("incident_impact", [
    "minor",
    "major",
    "critical",
]);

export const incidents = pgTable(
    "incidents",
    {
        id: serial("id").primaryKey(),

        title: varchar("title", { length: 200 })
            .notNull(),

        slug: varchar("slug", { length: 220 })
            .notNull()
            .unique(),

        status: incidentStatusEnum("status")
            .notNull()
            .default("investigating"),

        impact: incidentImpactEnum("impact")
            .notNull()
            .default("minor"),

        startedAt: timestamp("started_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),

        resolvedAt: timestamp("resolved_at", {
            withTimezone: true,
        }),

        createdBy: integer("created_by")
            .references(() => users.id, {
                onDelete: "set null",
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
    },
    (table) => [
        index("incidents_status_idx").on(table.status),
        index("incidents_started_at_idx").on(table.startedAt),
    ],
);

export const incidentServices = pgTable(
    "incident_services",
    {
        incidentId: integer("incident_id")
            .notNull()
            .references(() => incidents.id, {
                onDelete: "cascade",
            }),

        serviceId: integer("service_id")
            .notNull()
            .references(() => services.id, {
                onDelete: "restrict",
            }),

        impactOverride: incidentImpactEnum("impact_override"),
    },
    (table) => [
        primaryKey({
            columns: [table.incidentId, table.serviceId],
        }),
        index("incident_services_service_id_idx")
            .on(table.serviceId),
    ],
);

export const incidentUpdates = pgTable(
    "incident_updates",
    {
        id: serial("id").primaryKey(),

        incidentId: integer("incident_id")
            .notNull()
            .references(() => incidents.id, {
                onDelete: "cascade",
            }),

        status: incidentStatusEnum("status")
            .notNull(),

        message: text("message").notNull(),

        createdBy: integer("created_by")
            .references(() => users.id, {
                onDelete: "set null",
            }),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        index("incident_updates_timeline_idx")
            .on(table.incidentId, table.createdAt),
    ],
);

export const postmortems = pgTable(
    "postmortems",
    {
        id: serial("id").primaryKey(),

        incidentId: integer("incident_id")
            .notNull()
            .unique()
            .references(() => incidents.id, {
                onDelete: "cascade",
            }),

        summary: text("summary").notNull(),

        rootCause: text("root_cause"),

        resolution: text("resolution"),

        preventiveActions: text("preventive_actions"),

        publishedAt: timestamp("published_at", {
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
    },
);
