
import {
    pgTable,
    serial,
    integer,
    timestamp,
    real,
    uniqueIndex,
    index,
} from "drizzle-orm/pg-core";

import { serviceMonitors } from "./monitoring.js";

export const uptimeSummaries = pgTable(
    "uptime_summaries",
    {
        id: serial("id").primaryKey(),

        monitorId: integer("monitor_id")
            .notNull()
            .references(() => serviceMonitors.id, {
                onDelete: "cascade",
            }),

        // Start of the aggregation period.
        bucketStart: timestamp("bucket_start", {
            withTimezone: true,
        }).notNull(),

        // Duration represented by this row, e.g. 3600 seconds.
        bucketSeconds: integer("bucket_seconds")
            .notNull()
            .default(3600),

        totalChecks: integer("total_checks")
            .notNull()
            .default(0),

        successfulChecks: integer("successful_checks")
            .notNull()
            .default(0),

        failedChecks: integer("failed_checks")
            .notNull()
            .default(0),

        // Average response time in milliseconds.
        averageResponseTimeMs: real(
            "average_response_time_ms",
        ),

        // Percentage from 0 to 100.
        uptimePercentage: real("uptime_percentage")
            .notNull()
            .default(100),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        uniqueIndex("uptime_summaries_monitor_bucket_idx")
            .on(table.monitorId, table.bucketStart, table.bucketSeconds),

        index("uptime_summaries_bucket_idx")
            .on(table.bucketStart),
    ],
);
