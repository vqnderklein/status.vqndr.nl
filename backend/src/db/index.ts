
import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as usersSchema from "./schema/users.js";
import * as servicesSchema from "./schema/services.js";
import * as monitoringSchema from "./schema/monitoring.js";
import * as incidentsSchema from "./schema/incidents.js";
import * as maintenanceSchema from "./schema/maintenance.js";
import * as notificationsSchema from "./schema/notifications.js";
import * as analyticsSchema from "./schema/analytics.js";
import * as auditSchema from "./schema/audit.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is not configured");
}

export const pool = new Pool({
    connectionString,
});

export const db = drizzle(pool, {
    schema: {
        ...usersSchema,
        ...servicesSchema,
        ...monitoringSchema,
        ...incidentsSchema,
        ...maintenanceSchema,
        ...notificationsSchema,
        ...analyticsSchema,
        ...auditSchema,
    },
});
