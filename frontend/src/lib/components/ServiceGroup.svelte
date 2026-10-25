<script lang="ts">
	import { ChevronDown, CircleCheck } from "@lucide/svelte";
	import { slide } from "svelte/transition";

	import ServiceGroupRow from "./ServiceGroupRow.svelte";

	let open = $state(false);
	let incident = $state("1");
	let maintenace = $state(true);

	function toggle() {
		open = !open;
	}
</script>

<div class="container">
	<div
		class="header"
		role="button"
		tabindex="0"
		aria-expanded={open}
		onclick={toggle}
		onkeydown={(e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				toggle();
			}
		}}
	>
		<div class="information">
			<CircleCheck
				title="Operationeel"
				aria-label="Operationeel"
				size={25}
				style="fill: var(--ok);"
			/>

			<p class="groupName">Website</p>

			<div class="extra-information-wrapper">
				<span class="groupRows">
					2 onderdelen
					<ChevronDown
						size={13}
						style={`transform: rotate(${open ? 180 : 0}deg); transition: transform 200ms ease;`}
					/>
				</span>

				<div class="containerDescription">
					<span class="groupDescription">i</span>
					<div class="descriptionHover">
						Registratie en authenticatie
					</div>
				</div>
			</div>
		</div>

		{#if !open}
			<div class="uptime">100,00%</div>
		{/if}
	</div>
	{#if maintenace}
		<p class="maintenance-message">Onderhoud gepland op 25 okt</p>
	{/if}

	{#if !open}
		<ServiceGroupRow {incident} header={false} />
	{:else}
		<div class="detailServiceGroup" transition:slide={{ duration: 250 }}>
			<ServiceGroupRow {incident} />
			<ServiceGroupRow />
		</div>
	{/if}
</div>

<style>
	.maintenance-message {
		color: var(--mnt);
		margin: 0;
		font-size: 15px;
		padding-bottom: 1rem;
	}

	.extra-information-wrapper {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.container {
		width: 100%;
		margin: 1rem 0;
		min-width: 0;
	}

	.detailServiceGroup {
		padding-left: 1rem;
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

	.groupRows {
		padding: 4px 10px;
		border: 1px solid var(--mut);
		border-radius: 15px;
		display: flex;
		align-items: center;
		color: var(--mut);
		font-size: 13px;
		gap: 5px;
	}

	.header:hover .groupRows {
		color: var(--panel-subtext);
		border-color: var(--panel-subtext);
	}

	.groupName {
		color: var(--ink);
		font-weight: 600;
	}

	.containerDescription {
		position: relative;
		display: flex;
		align-items: center;
	}

	.groupDescription {
		color: var(--panel-line);
		border: 1px solid;
		border-radius: 50%;
		font-size: 13px;
		cursor: help;
		width: 18px;
		height: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.descriptionHover {
		position: absolute;
		bottom: calc(100% + 8px);
		left: 50%;
		transform: translateX(-50%);
		width: max-content;
		max-width: 240px;
		padding: 8px 12px;
		background-color: var(--panel);
		color: var(--ink);
		border: 1px solid var(--panel-line);
		border-radius: 8px;
		font-size: 13px;
		text-align: center;
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		z-index: 10;
	}

	.containerDescription:hover .descriptionHover {
		opacity: 1;
		visibility: visible;
		background-color: var(--bg);
	}

	.uptime {
		color: var(--mut);
	}

	@media screen and (max-width: 400px) {
		.extra-information-wrapper {
			position: absolute;
			top: 3rem;
		}

		.header[aria-expanded=true] .extra-information-wrapper {
			position: relative;
			top: 0;
		}

		.header[aria-expanded=true] {
			padding-bottom: 0;
		}

		.header {
			padding-bottom: 2rem;
			position: relative;
		}
	}
</style>
