
import {
    pgTable,
    pgEnum,
    serial,
    integer,
    varchar,
    text,
    boolean,
    timestamp,
    index,
    uniqueIndex,
} from "drizzle-orm/pg-core";

import { services } from "./services.js";

export const monitorTypeEnum = pgEnum("monitor_type", [
    "http",
    "tcp",
    "ping",
]);

export const serviceStatusEnum = pgEnum("service_status", [
    "operational",
    "degraded",
    "partial_outage",
    "major_outage",
    "maintenance",
    "unknown",
]);

export const checkResultEnum = pgEnum("check_result", [
    "operational",
    "degraded",
    "failed",
]);

export const serviceMonitors = pgTable(
    "service_monitors",
    {
        id: serial("id").primaryKey(),

        serviceId: integer("service_id")
            .notNull()
            .references(() => services.id, {
                onDelete: "cascade",
            }),

        name: varchar("name", { length: 150 })
            .notNull(),

        type: monitorTypeEnum("type")
            .notNull(),

        target: text("target").notNull(),

        intervalSeconds: integer("interval_seconds")
            .notNull()
            .default(60),

        timeoutMs: integer("timeout_ms")
            .notNull()
            .default(10000),

        expectedStatusCode: integer("expected_status_code")
            .default(200),

        enabled: boolean("enabled")
            .notNull()
            .default(true),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        index("service_monitors_service_id_idx")
            .on(table.serviceId),
    ],
);

export const serviceChecks = pgTable(
    "service_checks",
    {
        id: serial("id").primaryKey(),

        monitorId: integer("monitor_id")
            .notNull()
            .references(() => serviceMonitors.id, {
                onDelete: "cascade",
            }),

        checkedAt: timestamp("checked_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),

        result: checkResultEnum("result")
            .notNull(),

        responseTimeMs: integer("response_time_ms"),

        httpStatusCode: integer("http_status_code"),

        errorMessage: text("error_message"),
    },
    (table) => [
        index("service_checks_monitor_time_idx")
            .on(table.monitorId, table.checkedAt),
    ],
);

export const serviceCurrentStatus = pgTable(
    "service_current_status",
    {
        serviceId: integer("service_id")
            .primaryKey()
            .references(() => services.id, {
                onDelete: "cascade",
            }),

        status: serviceStatusEnum("status")
            .notNull()
            .default("unknown"),

        lastCheckedAt: timestamp("last_checked_at", {
            withTimezone: true,
        }),

        lastSuccessAt: timestamp("last_success_at", {
            withTimezone: true,
        }),

        responseTimeMs: integer("response_time_ms"),

        consecutiveFailures: integer("consecutive_failures")
            .notNull()
            .default(0),

        updatedAt: timestamp("updated_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),
    },
);

export const monitorEvents = pgTable(
    "monitor_events",
    {
        id: serial("id").primaryKey(),

        serviceId: integer("service_id")
            .notNull()
            .references(() => services.id, {
                onDelete: "cascade",
            }),

        previousStatus: serviceStatusEnum("previous_status"),

        newStatus: serviceStatusEnum("new_status")
            .notNull(),

        occurredAt: timestamp("occurred_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),

        reason: text("reason"),
    },
    (table) => [
        index("monitor_events_service_time_idx")
            .on(table.serviceId, table.occurredAt),
    ],
);
