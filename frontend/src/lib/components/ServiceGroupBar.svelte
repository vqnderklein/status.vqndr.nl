<script lang="ts">
	let {
		onHover
	}: {
		onHover: (event: MouseEvent) => void;
	} = $props();
</script>

<div
	class="bar"
	onmouseenter={onHover}
	role="img"
	aria-label="Operationeel"
></div>

<style>
	.bar {
		width: 100%;
		height: 28px;
		min-width: 0;
		background: var(--ok);
		opacity: 0.6;
		border-radius: 5px;
		cursor: pointer;
		transition: opacity 150ms ease;
	}

	.bar:hover {
		opacity: 1;
	}
</style>