<script lang="ts">
	import { CircleCheck, CircleX, Clock } from "@lucide/svelte";

	import type { Incident } from "$lib/types";

	let { incident }: { incident: Incident } = $props();

	const statusConfig = {
		actief: {
			label: "Bezig",
			icon: CircleX,
			color: "var(--out)",
		},
		gepland: {
			label: "Gepland",
			icon: Clock,
			color: "var(--mnt)",
		},
		opgelost: {
			label: "Opgelost",
			icon: CircleCheck,
			color: "var(--ok)",
		},
		afgerond: {
			label: "Afgerond",
			icon: CircleCheck,
			color: "var(--ok)",
		},
	} satisfies Record<
		Incident["status"],
		{
			label: string;
			icon: typeof CircleCheck;
			color: string;
		}
	>;

	const status = $derived(statusConfig[incident.status]);

	const statusColor = $derived(
		incident.status === "actief"
			? incident.type === "verstoring"
				? "var(--deg)"
				: incident.type === "onderhoud"
					? "var(--mnt)"
					: "var(--out)"
			: status.color,
	);

	const statusLabel = $derived(
		incident.status === "actief"
			? `${incident.type.charAt(0).toUpperCase()}${incident.type.slice(1)} bezig`
			: status.label,
	);

	const StatusIcon = $derived(status.icon);

	function formatDate(date: string) {
		return new Intl.DateTimeFormat("nl-NL", {
			day: "numeric",
			month: "long",
			year: "numeric",
		}).format(new Date(date));
	}

	function getDuration() {
		if (!incident.endDate || incident.status === "actief") return "Bezig";

		const start = new Date(incident.startDate).getTime();
		const end = new Date(incident.endDate).getTime();
		const minutes = Math.max(0, Math.round((end - start) / 60000));

		if (minutes < 60) return `${minutes} min`;

		const hours = Math.floor(minutes / 60);
		const remainingMinutes = minutes % 60;

		return remainingMinutes
			? `${hours} uur ${remainingMinutes} min`
			: `${hours} uur`;
	}
</script>

<a class="container" href={`/incident/${incident.id}`}>
	<div class="information">
		<div class="incident-title">
			{incident.title}
		</div>

		<div class="incident-details">
			<p>
				{formatDate(incident.startDate)}
				{#if getDuration()}
					&bull; {getDuration()}
				{/if}
				{#if incident.detection}
					&bull; {incident.detection}
				{/if}
			</p>
		</div>
	</div>

	<div class="status">
		<StatusIcon style="fill: {statusColor};color: black" size={20} />
		{statusLabel}
	</div>
</a>

<style>
	.container {
		text-decoration: none;
		color: var(--panel-text);
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 10px 0;
		border-bottom: 1px solid var(--line);
	}

	.container:hover .incident-title {
		text-decoration: underline;
	}

	.incident-title {
		font-size: 18px;
	}

	.container .status {
		display: flex;
		align-items: start;
		color: var(--mut);
		gap: 7px;
		white-space: nowrap;
	}

	.status :global(svg) {
		flex-shrink: 0;
	}

	.incident-details {
		font-size: 13px;
		margin-top: -5px;
		color: var(--mut);
	}

	.incident-details p {
		margin-bottom: 0;
	}

	@media (max-width: 600px) {
		.container {
			flex-direction: column;
			gap: 0.5rem;
		}
	}
</style>
