import { db, pool } from "./index.js";
import { serviceGroups, services } from "./schema/services.js";

async function seed() {
	console.log("Seeding database...");

	// Create service groups.
	const [websiteGroup] = await db
		.insert(serviceGroups)
		.values({
			name: "Website",
			slug: "website",
			sortOrder: 1,
		})
		.onConflictDoNothing()
		.returning();

	const [authenticationGroup] = await db
		.insert(serviceGroups)
		.values({
			name: "Auth",
			slug: "auth",
			sortOrder: 2,
		})
		.onConflictDoNothing()
		.returning();

	if (!websiteGroup) {
		console.log("group already exists; skipping.");
		return;
	}

	if (!authenticationGroup) {
		console.log("group already exists; skipping.");
		return;
	}

	// Create services.
	await db.insert(services).values([
		{
			groupId: websiteGroup.id,
			name: "Website",
			slug: "main-website",
			description: "The main website",
			isPublic: true,
			monitoringEnabled: true,
		},
		{
			groupId: websiteGroup.id,
			name: "CDN",
			slug: "cdn",
			description: "Globaal Content Delivery Network",
			isPublic: true,
			monitoringEnabled: true,
		},
	]);

    await db.insert(services).values([
		{
			groupId: authenticationGroup.id,
			name: "Authenticatie",
			slug: "authenticatie",
			description: "Inloggen",
			isPublic: true,
			monitoringEnabled: true,
		},
		{
			groupId: authenticationGroup.id,
			name: "Registratie",
			slug: "registratie",
			description: "Account registratie",
			isPublic: true,
			monitoringEnabled: true,
		},
        {
			groupId: authenticationGroup.id,
			name: "Wachtwoordherstel",
			slug: "wachtwoord-herstel",
			description: "Wachtwoord herstel",
			isPublic: true,
			monitoringEnabled: true,
		},
	]);

	console.log("Seeding completed.");
}

seed()
	.catch((error) => {
		console.error("Seeding failed:", error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await pool.end();
	});
