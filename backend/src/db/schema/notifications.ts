
import {
    pgTable,
    pgEnum,
    serial,
    integer,
    varchar,
    text,
    boolean,
    timestamp,
    jsonb,
    index,
    uniqueIndex,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";
import { services } from "./services.js";
import { incidents } from "./incidents.js";
import { maintenanceWindows } from "./maintenance.js";

export const notificationEndpointTypeEnum = pgEnum(
    "notification_endpoint_type",
    ["email", "webhook"],
);

export const notificationDeliveryStatusEnum = pgEnum(
    "notification_delivery_status",
    ["pending", "sending", "sent", "failed"],
);

export const notificationEndpoints = pgTable(
    "notification_endpoints",
    {
        id: serial("id").primaryKey(),

        userId: integer("user_id")
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
            }),

        type: notificationEndpointTypeEnum("type")
            .notNull(),

        destination: text("destination").notNull(),

        verifiedAt: timestamp("verified_at", {
            withTimezone: true,
        }),

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
        index("notification_endpoints_user_idx")
            .on(table.userId),
    ],
);

export const notificationSubscriptions = pgTable(
    "notification_subscriptions",
    {
        id: serial("id").primaryKey(),

        userId: integer("user_id")
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
            }),

        serviceId: integer("service_id")
            .references(() => services.id, {
                onDelete: "cascade",
            }),

        incidentUpdatesEnabled: boolean(
            "incident_updates_enabled",
        )
            .notNull()
            .default(true),

        maintenanceEnabled: boolean("maintenance_enabled")
            .notNull()
            .default(true),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        index("notification_subscriptions_user_idx")
            .on(table.userId),

        index("notification_subscriptions_service_idx")
            .on(table.serviceId),
    ],
);

export const notificationVerifications = pgTable(
    "notification_verifications",
    {
        id: serial("id").primaryKey(),

        endpointId: integer("endpoint_id")
            .notNull()
            .references(() => notificationEndpoints.id, {
                onDelete: "cascade",
            }),

        // Store a hash of the token, not the raw token.
        tokenHash: varchar("token_hash", { length: 255 })
            .notNull()
            .unique(),

        expiresAt: timestamp("expires_at", {
            withTimezone: true,
        }).notNull(),

        consumedAt: timestamp("consumed_at", {
            withTimezone: true,
        }),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        index("notification_verifications_endpoint_idx")
            .on(table.endpointId),
    ],
);

export const notificationDeliveries = pgTable(
    "notification_deliveries",
    {
        id: serial("id").primaryKey(),

        endpointId: integer("endpoint_id")
            .notNull()
            .references(() => notificationEndpoints.id, {
                onDelete: "cascade",
            }),

        incidentId: integer("incident_id")
            .references(() => incidents.id, {
                onDelete: "set null",
            }),

        maintenanceId: integer("maintenance_id")
            .references(() => maintenanceWindows.id, {
                onDelete: "set null",
            }),

        eventType: varchar("event_type", { length: 80 })
            .notNull(),

        status: notificationDeliveryStatusEnum("status")
            .notNull()
            .default("pending"),

        attempts: integer("attempts")
            .notNull()
            .default(0),

        lastAttemptAt: timestamp("last_attempt_at", {
            withTimezone: true,
        }),

        sentAt: timestamp("sent_at", {
            withTimezone: true,
        }),

        errorMessage: text("error_message"),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        index("notification_deliveries_status_idx")
            .on(table.status, table.createdAt),
        index("notification_deliveries_endpoint_idx")
            .on(table.endpointId),
    ],
);

export const notificationOutbox = pgTable(
    "notification_outbox",
    {
        id: serial("id").primaryKey(),

        eventType: varchar("event_type", { length: 100 })
            .notNull(),

        payload: jsonb("payload")
            .notNull(),

        processedAt: timestamp("processed_at", {
            withTimezone: true,
        }),

        attempts: integer("attempts")
            .notNull()
            .default(0),

        availableAt: timestamp("available_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        index("notification_outbox_pending_idx")
            .on(table.processedAt, table.availableAt),
    ],
);
