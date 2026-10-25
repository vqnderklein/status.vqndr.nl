<script lang="ts">
	import { ChevronLeft, ChevronRight } from "@lucide/svelte";

	let {
		currentPage,
		totalPages,
		onPageChange,
	}: {
		currentPage: number;
		totalPages: number;
		onPageChange: (page: number) => void;
	} = $props();

	type PageItem = number | "ellipsis";

	const visiblePages = $derived.by((): PageItem[] => {
		if (totalPages <= 4) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		if (currentPage <= 2) {
			return [1, 2, 3, "ellipsis", totalPages];
		}

		if (currentPage >= totalPages - 1) {
			return [
				1,
				"ellipsis",
				totalPages - 2,
				totalPages - 1,
				totalPages,
			];
		}

		return [
			1,
			"ellipsis",
			currentPage - 1,
			currentPage,
			currentPage + 1,
			"ellipsis",
			totalPages,
		];
	});
</script>

{#if totalPages > 1}
	<nav class="pagination" aria-label="Paginering">
		<button
			class="arrow"
			disabled={currentPage === 1}
			onclick={() => onPageChange(currentPage - 1)}
			aria-label="Vorige pagina"
		>
			<ChevronLeft size={17} />
		</button>

		{#each visiblePages as page, i (`${page}-${i}`)}
			{#if page === "ellipsis"}
				<span class="ellipsis" aria-hidden="true">…</span>
			{:else}
				<button
					class:active={currentPage === page}
					aria-current={currentPage === page
						? "page"
						: undefined}
					aria-label={`Pagina ${page}`}
					onclick={() => onPageChange(page)}
				>
					{page}
				</button>
			{/if}
		{/each}

		<button
			class="arrow"
			disabled={currentPage === totalPages}
			onclick={() => onPageChange(currentPage + 1)}
			aria-label="Volgende pagina"
		>
			<ChevronRight size={17} />
		</button>
	</nav>
{/if}

<style>
	.pagination {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	button {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 36px;
		height: 36px;
		padding: 0 10px;
		border: 1px solid transparent;
		border-radius: 8px;
		background: transparent;
		color: var(--mut);
		font: inherit;
		cursor: pointer;
		transition:
			background-color 200ms ease,
			color 200ms ease;
	}

	button:hover:not(:disabled) {
		background: var(--panel);
		color: var(--panel-text);
	}

	button.active {
		background: var(--panel);
		border-color: var(--mut);
		color: var(--panel-text);
	}

	button:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	.ellipsis {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 20px;
		color: var(--mut);
	}
</style>
