<script>
	import { CircleCheck } from "@lucide/svelte";

	let { finished = false, task = "" } = $props();
</script>

<div class="container">
	<div class="status">
		{#if finished}
			<CircleCheck color="black" size={25} style="fill: var(--ok);" />
		{:else}
			<div class="circle"></div>
		{/if}
	</div>
	<div class="content">
		{task}
		{#if finished}
			<span>&bull; Afgerond</span>
		{:else}
			<span>&bull; Gepland</span>
		{/if}
	</div>
</div>

<style>
	.content span {
		color: var(--mut);
		font-size: 13px;
	}

	.content {
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.container {
		text-decoration: none;
		color: var(--panel-text);
		display: grid;
		padding: 10px 0;
		grid-template-columns: 35px 1fr;
		border-bottom: 1px solid var(--line);
	}

	.circle {
		height: 19px;
		width: 19px;
		border-radius: 50%;
		border: 1px solid var(--mut);
	}

	@media screen and (max-width: 400px) {
		.content span {
			display: none;
		}
	}
</style>
