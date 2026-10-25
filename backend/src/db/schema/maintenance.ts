
import {
    pgTable,
    pgEnum,
    serial,
    integer,
    varchar,
    text,
    timestamp,
    index,
    primaryKey,
} from "drizzle-orm/pg-core";

import { services } from "./services.js";
import { users } from "./users.js";

export const maintenanceStatusEnum = pgEnum(
    "maintenance_status",
    [
        "scheduled",
        "in_progress",
        "completed",
        "cancelled",
    ],
);

export const maintenanceWindows = pgTable(
    "maintenance_windows",
    {
        id: serial("id").primaryKey(),

        title: varchar("title", { length: 200 })
            .notNull(),

        description: text("description"),

        status: maintenanceStatusEnum("status")
            .notNull()
            .default("scheduled"),

        startsAt: timestamp("starts_at", {
            withTimezone: true,
        }).notNull(),

        endsAt: timestamp("ends_at", {
            withTimezone: true,
        }).notNull(),

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
        index("maintenance_status_idx").on(table.status),
        index("maintenance_start_idx").on(table.startsAt),
    ],
);

export const maintenanceServices = pgTable(
    "maintenance_services",
    {
        maintenanceId: integer("maintenance_id")
            .notNull()
            .references(() => maintenanceWindows.id, {
                onDelete: "cascade",
            }),

        serviceId: integer("service_id")
            .notNull()
            .references(() => services.id, {
                onDelete: "restrict",
            }),
    },
    (table) => [
        primaryKey({
            columns: [table.maintenanceId, table.serviceId],
        }),
        index("maintenance_services_service_id_idx")
            .on(table.serviceId),
    ],
);
