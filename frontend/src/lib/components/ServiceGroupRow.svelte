<script lang="ts">
	import { tick } from "svelte";
	import { ChevronRight, CircleCheck } from "@lucide/svelte";
	import ServiceGroupBar from "./ServiceGroupBar.svelte";
	import StatusDot from "./StatusDot.svelte";

	let { incident = "", header = true } = $props();

	const barCount = 90;

	let summaryStatusBar = $state<HTMLDivElement | null>(null);
	let tooltipEl = $state<HTMLDivElement | null>(null);
	let tooltipLeft = $state(0);
	let activeBar = $state<number | null>(null);


	async function showTooltip(event: MouseEvent, index: number) {
		// Capture the element before awaiting tick().
		const bar = event.currentTarget as HTMLElement;

		activeBar = index;
		await tick();

		if (!tooltipEl || !summaryStatusBar) return;

		const parentRect = summaryStatusBar.getBoundingClientRect();
		const barRect = bar.getBoundingClientRect();
		const tooltipWidth = tooltipEl.offsetWidth;

		const barCenter = barRect.left + barRect.width / 2 - parentRect.left;

		tooltipLeft = Math.max(
			tooltipWidth / 2,
			Math.min(barCenter, parentRect.width - tooltipWidth / 2),
		);
	}

	function hideTooltip() {
		activeBar = null;
	}
</script>

{#if header}
	<div class="header">
		<div class="information">
			<CircleCheck
				title="Operationeel"
				aria-label="Operationeel"
				size={25}
				style="fill: var(--ok);"
			/>
			<p class="groupName">Website</p>
		</div>

		<div class="uptime">100,00%</div>
	</div>
{/if}

<div class="summaryStatusWrapper" onmouseleave={hideTooltip} role="tooltip">
	<div class="summaryStatusBar" bind:this={summaryStatusBar}>
		{#each Array(barCount) as _, i (i)}
			<ServiceGroupBar onHover={(event) => showTooltip(event, i)} />
		{/each}
	</div>

	{#if activeBar !== null}
		<div
			class="sharedTooltip"
			bind:this={tooltipEl}
			style:left="{tooltipLeft}px"
			role="tooltip"
		>
			<div class="date">Ma 19 Augustus</div>

			{#if incident}
				<a href="/incident/439804390" class="incidentAnchor">
					<StatusDot state="deg" size={10} />

					<div class="incidentWrapper">
						<span class="incidentTitle">
							Trage laadtijden van de website
							<ChevronRight size={15} />
						</span>

						<span class="incidentDetails">
							Verstoring &bull; 15 minuten
						</span>
					</div>
				</a>

				<span class="line"></span>

				<div class="uptime-tooltip incident">
					Uptime 89,95% &bull; 15 minuten verstoring
				</div>
			{:else}
				<div class="uptime-tooltip">
					<StatusDot state="ok" size={10} />
					<p>100% online</p>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.summaryStatusWrapper {
		position: relative;
		min-width: 0;
        margin-bottom: 1rem;
	}

	.summaryStatusBar {
		display: grid;
		grid-template-columns: repeat(90, minmax(0, 5px));
		justify-content: space-between;
		height: 28px;
		overflow: visible;
	}

	.sharedTooltip {
		position: absolute;
		bottom: calc(100% + 10px);
		transform: translateX(-50%);
		width: max-content;
		max-width: min(280px, 100%);
		box-sizing: border-box;
		padding: 5px 16px;
		background: var(--ink);
		color: var(--bg);
		border: 1px solid var(--panel-line);
		border-radius: 8px;
		box-shadow: 0 4px 12px rgb(0 0 0 / 12%);
		z-index: 20;
	}

	.sharedTooltip::after {
		content: "";
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		height: 12px;
	}

	.date {
		margin: 6px 0;
		color: color-mix(in oklab, var(--mnt) 30%, var(--bg));
		font-size: 14px;
		padding-bottom: 3px;
		font-weight: 600;
	}

	.incidentAnchor {
		padding: 6px;
		border-radius: 6px;
		display: flex;
		align-items: flex-start;
		gap: 7px;
		text-decoration: none;
		color: color-mix(in oklab, var(--mnt) 30%, var(--bg));
	}

	.incidentAnchor:hover {
		background-color: rgb(218, 237, 240);
	}

	.incidentWrapper {
		margin-top: -3px;
		min-width: 0;
	}

	.incidentTitle {
		font-weight: 400;
		display: flex;
		align-items: center;
		gap: 3px;
		font-size: 14px;
	}

	.incidentDetails {
		color: var(--bg);
		opacity: 0.4;
		font-size: 13px;
		padding-top: 5px;
		display: block;
	}

	.line {
		width: 100%;
		height: 2px;
		display: block;
		margin: 5px 0;
		background-color: var(--mut);
	}

	.uptime-tooltip {
		display: flex;
		font-size: 14px;
		align-items: center;
		padding-bottom: 5px;
		gap: 5px;
		color: color-mix(in oklab, var(--mnt) 30%, var(--bg));
	}

	.uptime-tooltip p {
		margin: 0;
	}

	.uptime-tooltip.incident {
		font-size: 12px;
	}

	.header {
		justify-content: space-between;
		display: flex;
		cursor: pointer;
		align-items: center;
	}

	.information {
		align-items: center;
		gap: 10px;
		display: flex;
	}

	.groupName {
		color: var(--ink);
		font-weight: 600;
	}

	.uptime {
		color: var(--mut);
	}
</style>
