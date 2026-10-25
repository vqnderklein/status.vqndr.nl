<script>
	import { ChevronLeft } from "@lucide/svelte";
	import IncidentTaskCompletion from "$lib/components/IncidentTaskCompletion.svelte";
	import { page } from "$app/stores";

	const incidentId = $page.params.id;
</script>

<svelte:head>
	<title>[name] &dash; Network status &bull; vqnderklein.nl</title>
</svelte:head>

<a class="backAnchor" href="/incident/{incidentId}"
	><ChevronLeft size={12} /> Terug naar incident</a
>

<h2>Incidentrapport</h2>

<h1>Server 2 niet bereikbaar</h1>
<p class="rapportDetails">
	Gepubliceerd op 28 september 2026 &bull; duur 1 u 12 min &bull; Server 2
	&bull; CDN, opslag en back-ups, Afbeeldingen, Downloads
</p>

<h2 class="header">Samenvatting</h2>
<p class="paragraph">
	Server 2 was ongeveer 72 minuten niet bereikbaar. In die tijd waren
	afbeeldingen en downloads van de CDN niet beschikbaar. De website en het
	inloggen werkten gewoon.
</p>
<p class="paragraph">
	Door een netwerkstoring in de netwerkapparatuur van het datacenter lag
	server 2 tijdens eruit. Onze server zelf draaide door, maar was van
	buitenaf niet te bereiken. De hoster heeft de defecte apparatuur vervangen.
	Daarna hebben we gecontroleerd of alles weer werkte en de wachtrij met
	uploads verwerkt.
</p>

<h2 class="header">Wat doen we om dit te voorkomen?</h2>
<IncidentTaskCompletion
	finished={true}
	task="Melding bij de hoster gemaakt en om een toelichting gevraagd"
/>
<IncidentTaskCompletion
	finished={true}
	task="Alarm aangescherpt: een melding binnen drie minuten"
/>
<IncidentTaskCompletion
	finished={false}
	task="Een tweede CDN-locatie als terugval onderzoeken"
/>

<style>
	h2 {
		color: var(--mut);
		font-weight: 400;
		margin-top: 2rem;
		font-size: 16px;
	}

	.paragraph {
		color: var(--panel-subtext);
		font-size: 16px;
		margin-bottom: 2rem;
		line-height: 1.5;
	}

	h2.header {
		font-weight: 500;
	}

	.rapportDetails {
		color: var(--mut);
		font-size: 14px;
		margin-top: -1rem;
		margin-bottom: 2rem;
		line-height: 1.5;
	}

	.backAnchor {
		text-decoration: none;
		color: var(--mut);
		margin-bottom: 2rem;
		display: flex;
		align-items: center;
		margin-top: -1rem;
		gap: 5px;
		display: block;
	}

	h1 {
		font-weight: 500;
		color: var(--panel-text);
	}

	
</style>
