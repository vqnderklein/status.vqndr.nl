<script lang="ts">
	import IncidentSummaryBar from "$lib/components/IncidentSummaryBar.svelte";
	import IncidentPagination from "$lib/components/IncidentPagination.svelte";

	import type { Incident } from "$lib/types";
	import type { IncidentType } from "$lib/types";

	const incidents: Incident[] = [
		{
			id: 1,
			title: "Website niet bereikbaar",
			description:
				"De website was tijdelijk niet bereikbaar door een storing bij de hostingprovider.",
			type: "storing",
			status: "opgelost",
			startDate: "2026-10-23T14:20:00",
			endDate: "2026-10-23T15:05:00",
		},
		{
			id: 2,
			title: "Verhoogde responstijden",
			description:
				"Sommige verzoeken naar de API kunnen langer duren dan gebruikelijk.",
			type: "verstoring",
			status: "actief",
			startDate: "2026-10-24T10:15:00",
		},
		{
			id: 3,
			title: "Databaseonderhoud",
			description:
				"Gepland onderhoud aan de database om de prestaties te verbeteren.",
			type: "onderhoud",
			status: "afgerond",
			startDate: "2026-10-26T02:00:00",
			endDate: "2026-10-26T03:00:00",
		},
		{
			id: 4,
			title: "E-mailvertraging",
			description:
				"Het afleveren van e-mails duurde langer dan normaal.",
			type: "verstoring",
			status: "opgelost",
			startDate: "2026-10-20T09:00:00",
			endDate: "2026-10-20T09:45:00",
		},
		{
			id: 5,
			title: "API tijdelijk offline",
			description:
				"Een configuratiefout veroorzaakte een korte onderbreking van de API.",
			type: "storing",
			status: "opgelost",
			startDate: "2026-10-18T16:30:00",
			endDate: "2026-10-18T16:52:00",
		},
		{
			id: 6,
			title: "Netwerkonderhoud",
			description: "Werkzaamheden aan de netwerkverbinding.",
			type: "onderhoud",
			status: "opgelost",
			startDate: "2026-10-15T01:00:00",
			endDate: "2026-10-15T02:30:00",
		},
		{
			id: 7,
			title: "Dashboard vertraagd",
			description: "Het laden van het dashboard kan langer duren.",
			type: "storing",
			status: "opgelost",
			startDate: "2026-10-12T12:00:00",
			endDate: "2026-10-12T12:25:00",
		},
		{
			id: 8,
			title: "Certificaat vernieuwd",
			description:
				"Onderhoud voor het vernieuwen van het TLS-certificaat.",
			type: "onderhoud",
			status: "opgelost",
			startDate: "2026-10-09T04:00:00",
			endDate: "2026-10-09T04:10:00",
		},
		{
			id: 9,
			title: "Authenticatieproblemen",
			description:
				"Inloggen was tijdelijk niet mogelijk voor een deel van de gebruikers.",
			type: "storing",
			status: "opgelost",
			startDate: "2026-10-06T11:20:00",
			endDate: "2026-10-06T11:55:00",
		},
		{
			id: 10,
			title: "Onderhoud webserver",
			description: "Reguliere updates aan de webserver.",
			type: "onderhoud",
			status: "opgelost",
			startDate: "2026-10-02T03:00:00",
			endDate: "2026-10-02T03:30:00",
		},
		{
			id: 11,
			title: "API-foutmeldingen",
			description:
				"Een tijdelijke toename in foutmeldingen bij API-verzoeken.",
			type: "storing",
			status: "opgelost",
			startDate: "2026-09-29T13:00:00",
			endDate: "2026-09-29T13:15:00",
		},
		{
			id: 12,
			title: "Netwerkstoring",
			description: "Een netwerkonderbreking trof meerdere diensten.",
			type: "storing",
			status: "opgelost",
			startDate: "2026-09-25T08:00:00",
			endDate: "2026-09-25T08:40:00",
		},
		{
			id: 13,
			title: "Website niet bereikbaar",
			description:
				"De website was tijdelijk niet bereikbaar door een storing bij de hostingprovider.",
			type: "storing",
			status: "opgelost",
			startDate: "2026-10-23T14:20:00",
			endDate: "2026-10-23T15:05:00",
		},
		{
			id: 14,
			title: "Verhoogde responstijden",
			description:
				"Sommige verzoeken naar de API kunnen langer duren dan gebruikelijk.",
			type: "storing",
			status: "actief",
			startDate: "2026-10-24T10:15:00",
		},
		{
			id: 15,
			title: "Databaseonderhoud",
			description:
				"Gepland onderhoud aan de database om de prestaties te verbeteren.",
			type: "onderhoud",
			status: "gepland",
			startDate: "2026-10-26T02:00:00",
			endDate: "2026-10-26T03:00:00",
		},
		{
			id: 16,
			title: "E-mailvertraging",
			description:
				"Het afleveren van e-mails duurde langer dan normaal.",
			type: "storing",
			status: "opgelost",
			startDate: "2026-10-20T09:00:00",
			endDate: "2026-10-20T09:45:00",
		},
		{
			id: 17,
			title: "API tijdelijk offline",
			description:
				"Een configuratiefout veroorzaakte een korte onderbreking van de API.",
			type: "storing",
			status: "opgelost",
			startDate: "2026-10-18T16:30:00",
			endDate: "2026-10-18T16:52:00",
		},
		{
			id: 18,
			title: "Netwerkonderhoud",
			description: "Werkzaamheden aan de netwerkverbinding.",
			type: "onderhoud",
			status: "opgelost",
			startDate: "2026-10-15T01:00:00",
			endDate: "2026-10-15T02:30:00",
		},
		{
			id: 19,
			title: "Dashboard vertraagd",
			description: "Het laden van het dashboard kan langer duren.",
			type: "storing",
			status: "opgelost",
			startDate: "2026-10-12T12:00:00",
			endDate: "2026-10-12T12:25:00",
		},
		{
			id: 20,
			title: "Certificaat vernieuwd",
			description:
				"Onderhoud voor het vernieuwen van het TLS-certificaat.",
			type: "onderhoud",
			status: "opgelost",
			startDate: "2026-10-09T04:00:00",
			endDate: "2026-10-09T04:10:00",
		},
		{
			id: 21,
			title: "Authenticatieproblemen",
			description:
				"Inloggen was tijdelijk niet mogelijk voor een deel van de gebruikers.",
			type: "storing",
			status: "opgelost",
			startDate: "2026-10-06T11:20:00",
			endDate: "2026-10-06T11:55:00",
		},
		{
			id: 22,
			title: "Onderhoud webserver",
			description: "Reguliere updates aan de webserver.",
			type: "onderhoud",
			status: "opgelost",
			startDate: "2026-10-02T03:00:00",
			endDate: "2026-10-02T03:30:00",
		},
		{
			id: 23,
			title: "API-foutmeldingen",
			description:
				"Een tijdelijke toename in foutmeldingen bij API-verzoeken.",
			type: "storing",
			status: "opgelost",
			startDate: "2026-09-29T13:00:00",
			endDate: "2026-09-29T13:15:00",
		},
		{
			id: 24,
			title: "Netwerkstoring",
			description: "Een netwerkonderbreking trof meerdere diensten.",
			type: "storing",
			status: "opgelost",
			startDate: "2026-09-25T08:00:00",
			endDate: "2026-09-25T08:40:00",
		},
		{
			id: 25,
			title: "Onderhoud webserver",
			description: "Reguliere updates aan de webserver.",
			type: "onderhoud",
			status: "opgelost",
			startDate: "2026-10-02T03:00:00",
			endDate: "2026-10-02T03:30:00",
		},
		{
			id: 26,
			title: "API-foutmeldingen",
			description:
				"Een tijdelijke toename in foutmeldingen bij API-verzoeken.",
			type: "verstoring",
			status: "opgelost",
			startDate: "2026-09-29T13:00:00",
			endDate: "2026-09-29T13:15:00",
		},
		{
			id: 27,
			title: "Netwerkstoring",
			description: "Een netwerkonderbreking trof meerdere diensten.",
			type: "storing",
			status: "opgelost",
			startDate: "2026-09-25T08:00:00",
			endDate: "2026-09-25T08:40:00",
			detection: "Automatisch",
		},
	];

	const pageSize = 5;

	let activeFilter = $state<"alles" | IncidentType>("alles");
	let currentPage = $state(1);

	const filteredIncidents = $derived(
		incidents
			.filter(
				(incident) =>
					activeFilter === "alles" ||
					incident.type === activeFilter,
			)
			.toSorted(
				(a, b) =>
					new Date(b.startDate).getTime() -
					new Date(a.startDate).getTime(),
			),
	);

	const totalPages = $derived(
		Math.ceil(filteredIncidents.length / pageSize),
	);

	const paginatedIncidents = $derived(
		filteredIncidents.slice(
			(currentPage - 1) * pageSize,
			currentPage * pageSize,
		),
	);

	const firstItem = $derived(
		filteredIncidents.length === 0 ? 0 : (currentPage - 1) * pageSize + 1,
	);

	const lastItem = $derived(
		Math.min(currentPage * pageSize, filteredIncidents.length),
	);

	function setFilter(filter: "alles" | IncidentType) {
		activeFilter = filter;
		currentPage = 1;
	}

	const groupedIncidents = $derived.by(() => {
		const groups: {
			month: string;
			incidents: Incident[];
		}[] = [];

		for (const incident of paginatedIncidents) {
			const date = new Date(incident.startDate);

			const month = new Intl.DateTimeFormat("nl-NL", {
				month: "long",
				year: "numeric",
			}).format(date);

			const lastGroup = groups[groups.length - 1];

			if (lastGroup?.month === month) {
				lastGroup.incidents.push(incident);
			} else {
				groups.push({
					month,
					incidents: [incident],
				});
			}
		}

		return groups;
	});
</script>

<svelte:head>
	<title>Network Status &bull; vqnderklein.nl</title>
</svelte:head>

<h2>Incidenten</h2>

<div class="filters" aria-label="Filter incidenten">
	<button
		class:active={activeFilter === "alles"}
		aria-pressed={activeFilter === "alles"}
		onclick={() => setFilter("alles")}
	>
		Alles
	</button>

	<button
		class:active={activeFilter === "storing"}
		aria-pressed={activeFilter === "storing"}
		onclick={() => setFilter("storing")}
	>
		Storingen
	</button>

	<button
		class:active={activeFilter === "verstoring"}
		aria-pressed={activeFilter === "verstoring"}
		onclick={() => setFilter("verstoring")}
	>
		Verstoringen
	</button>

	<button
		class:active={activeFilter === "onderhoud"}
		aria-pressed={activeFilter === "onderhoud"}
		onclick={() => setFilter("onderhoud")}
	>
		Onderhoud
	</button>
</div>

<div class="incident-list" aria-live="polite">
	{#if groupedIncidents.length > 0}
		{#each groupedIncidents as group (group.month)}
			<section class="month-group">
				<h2 class="month-heading">{group.month}</h2>

				<div class="month-incidents">
					{#each group.incidents as incident (incident.id)}
						<IncidentSummaryBar {incident} />
					{/each}
				</div>
			</section>
		{/each}
	{:else}
		<p>Geen incidenten gevonden.</p>
	{/if}
</div>

{#if filteredIncidents.length > 0}
	<div class="pagination-footer">
		<p class="result-count">
			Toont {firstItem}–{lastItem} van {filteredIncidents.length} incidenten
		</p>

		<IncidentPagination
			{currentPage}
			{totalPages}
			onPageChange={(page) => (currentPage = page)}
		/>
	</div>
{/if}

<style>
	h2 {
		color: var(--mut);
		font-weight: 400;
		margin-top: 2rem;
		font-size: 16px;
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 1rem 0 1.5rem;
	}

	.month-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.month-heading {
		text-transform: capitalize;
	}

	.month-incidents {
		display: flex;
		flex-direction: column;
	}

	.filters button {
		background: transparent;
		border: 1px solid var(--mut);
		border-radius: 50px;
		padding: 8px 14px;
		color: var(--mut);
		cursor: pointer;
		transition:
			background-color 250ms ease,
			color 250ms ease;
	}

	.filters button:hover,
	.filters button.active {
		background-color: var(--panel);
		color: var(--panel-text);
	}

	.filters button.active {
		border-color: var(--panel-text);
	}

	.incident-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.pagination-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	.result-count {
		color: var(--mut);
		font-size: 13px;
	}

	@media (max-width: 600px) {
		.pagination-footer {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
