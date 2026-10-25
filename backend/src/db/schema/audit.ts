
import {
    pgTable,
    serial,
    integer,
    varchar,
    text,
    jsonb,
    timestamp,
    index,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";

export const auditLogs = pgTable(
    "audit_logs",
    {
        id: serial("id").primaryKey(),

        userId: integer("user_id")
            .references(() => users.id, {
                onDelete: "set null",
            }),

        action: varchar("action", { length: 100 })
            .notNull(),

        entityType: varchar("entity_type", { length: 100 })
            .notNull(),

        entityId: varchar("entity_id", { length: 100 }),

        // Optional snapshot of relevant changes.
        metadata: jsonb("metadata"),

        ipAddress: varchar("ip_address", { length: 45 }),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        index("audit_logs_user_time_idx")
            .on(table.userId, table.createdAt),

        index("audit_logs_entity_idx")
            .on(table.entityType, table.entityId),
    ],
);
