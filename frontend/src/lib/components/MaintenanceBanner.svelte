<script lang="ts">
	import { ChevronRight } from "@lucide/svelte";
	import type { MaintenanceWindow } from "$lib/types";
	import { formatWindow } from "$lib/format";

	let { maintenance }: { maintenance: MaintenanceWindow } = $props();
</script>

<a class="container" href="/incident/{maintenance.id}">
	<div class="content">
		<div class="icon"></div>
		<div class="details">
			<span
				>Gepland onderhoud &bull; <span>{maintenance.title}</span>
				&bull; {formatWindow(
					maintenance.startsAt,
					maintenance.endsAt,
				)}</span
			>
		</div>
	</div>
	<span class="anchor">Details <ChevronRight size={14} /></span>
</a>

<style>
	.icon {
		height: 8px;
		width: 8px;
		background-color: var(--mnt);
		border-radius: 50%;
	}

	.container:hover .anchor {
		color: var(--panel-text);
	}

	.content {
		display: flex;
		gap: 10px;
		align-items: center;
	}

	.container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		max-width: 700px;
		margin-bottom: 3rem;
		padding: 12px 16px;
		text-decoration: none;
		font-size: 15px;
		border-radius: 7px;
		color: var(--panel-text);
		background: color-mix(in oklab, var(--mnt) 12%, var(--bg));
		border: 1px solid color-mix(in oklab, var(--mnt) 30%, var(--bg));
	}

	.container span.anchor {
		display: flex;
		align-items: center;
		transition: 300ms ease color;
		gap: 5px;
		text-decoration: none;
		color: var(--mut);
	}
</style>
