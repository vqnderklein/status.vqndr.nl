<script>
	let { state = "ok", size = 15 } = $props();
</script>

<div class="dot {state}" style="min-height: {size}px; min-width: {size}px"></div>

<style>
    .dot {
        border-radius: 50%;
        position: relative;
        aspect-ratio: 1;
    }

	.dot.ok {
		background-color: var(--ok);
	}

	.dot.deg {
		background-color: var(--deg);
	}

	.dot.out {
		background-color: var(--out);
	}

	.dot.mnt {
		background-color: var(--mnt);
	}
</style>
