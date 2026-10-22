<script>
	import ServiceGroup from "$lib/components/ServiceGroup.svelte";
    import IncidentSummaryBar from "$lib/components/IncidentSummaryBar.svelte";
	import { CircleCheck } from "@lucide/svelte";
</script>

<svelte:head>
	<title>Network Status &bull; vqnderklein.nl</title>
</svelte:head>

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

<IncidentSummaryBar />
<IncidentSummaryBar />
<IncidentSummaryBar />
<a class="link" href="/history">Alle incidenten bekijken</a>

<style>
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
