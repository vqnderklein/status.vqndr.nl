<script lang="ts">
	import ServiceGroup from "$lib/components/ServiceGroup.svelte";
	import IncidentSummaryBar from "$lib/components/IncidentSummaryBar.svelte";
	import { CircleCheck } from "@lucide/svelte";

	import type { Incident } from "$lib/types";

	let incident: Incident = {
		id: 1,
		title: "Website verminderd bereikbaar",
		description:
			"De website was tijdelijk niet bereikbaar door een storing bij de hostingprovider.",
		type: "verstoring",
		status: "actief",
		startDate: "2026-10-23T14:20:00",
		endDate: "2026-10-23T15:05:00",
	};

	let incidents: Incident[] = [
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
	];
</script>

<svelte:head>
	<title>Network Status &bull; vqnderklein.nl</title>
</svelte:head>

{#if incident}
	<h2>Lopend</h2>
	<div class="incidentContainer">
		<IncidentSummaryBar {incident} />
	</div>
{/if}

<h2>Diensten</h2>

<div class="services">
	<ServiceGroup />

	<ServiceGroup />
</div>

<h2>Overige diensten</h2>

<ul>
	<li>
		<span class="title">
			<CircleCheck
				title="Operationeel"
				style="fill: var(--ok);"
				color="black"
				aria-label="Operationeel"
				size={25}
			/> Netwerk
		</span>
	</li>
	<li>
		<span class="title">
			<CircleCheck
				title="Operationeel"
				style="fill: var(--ok);"
				color="black"
				aria-label="Operationeel"
				size={25}
			/> Email
		</span>
	</li>
	<li>
		<span class="title">
			<CircleCheck
				title="Operationeel"
				style="fill: var(--ok);"
				color="black"
				aria-label="Operationeel"
				size={25}
			/> Docs
		</span>
	</li>
	<li>
		<span class="title">
			<CircleCheck
				title="Operationeel"
				style="fill: var(--ok);"
				color="black"
				aria-label="Operationeel"
				size={25}
			/> Monitor services
		</span>
	</li>
</ul>

<h2>Recente incidenten</h2>

{#each incidents as incident}
	<IncidentSummaryBar {incident} />
{/each}
<a class="link" href="/history">Alle incidenten bekijken</a>

<style>
	.incidentContainer {
		margin-bottom: 3rem;
	}

	.link {
		padding-top: 1rem;
		color: var(--panel-text);
		display: block;
	}

	.services {
		margin-bottom: 3rem;
	}

	.title {
		display: flex;
		gap: 7px;
		align-items: center;
		font-size: 15px;
	}

	h2 {
		color: var(--mut);
		font-weight: 400;
		font-size: 16px;
	}

	ul {
		list-style-type: none;
		margin: 0;
		padding: 0;
		margin-bottom: 2rem;
	}

	ul li {
		padding: 10px 0;
		color: var(--panel-text);
		display: flex;
		border-top: 1px solid var(--panel-line);
		justify-content: space-between;
		align-items: center;
	}

	ul > li:first-child {
		border-top: none;
	}
</style>
