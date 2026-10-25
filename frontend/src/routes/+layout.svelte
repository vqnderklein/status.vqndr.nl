<script lang="ts">
	import { Bell } from "@lucide/svelte";

	import { onMount } from "svelte";

	import favicon from "$lib/assets/favicon.svg";
	import "@fontsource-variable/figtree";
	import { page } from "$app/state";
	import "../global.css";

	import type { MaintenanceWindow } from "$lib/types";

	import MaintenanceBanner from "$lib/components/MaintenanceBanner.svelte";
	import SignupForUpdates from "$lib/components/SignupForUpdates.svelte";
	import Footer from "$lib/components/Footer.svelte";

	let showSubscribe = $state(false);

	let cur_state = $state("ok");
	let maintenance = $state<MaintenanceWindow>({
		id: 0,
		title: "database-update",
		startsAt: "2026-10-21T02:00:00Z",
		endsAt: "2026-10-21T04:00:00Z",
		serviceIds: ["api"],
	});

	const incidentId = $derived(Number(page.params.id ?? -1));
	const onOwnPage = $derived(maintenance?.id === incidentId);

	let { children } = $props();

	let darkMode = $state(false);

	onMount(() => {
		const media = window.matchMedia('(prefers-color-scheme: dark)');

		const update = () => (darkMode = media.matches);

		update();
		media.addEventListener('change', update);

		return () => media.removeEventListener('change', update);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link
		rel="icon"
		href={darkMode
			? 'https://vqnderklein.nl/img/favicon-light.svg'
			: 'https://vqnderklein.nl/img/favicon-dark.svg'}
	/>
</svelte:head>

<div class="pageWrapper">
	<aside class={cur_state}>
		<div class="wrapperContainer">
			<div class="content">
				<div id="logoContainer">
					<img
						class="favicon"
						src="https://vqnderklein.nl/img/favicon-light.svg"
						alt=""
					/>
					<p>vqnderklein</p>
				</div>
				<nav>
					<a href="/" class:active={page.url.pathname === "/"}>
						Overzicht
					</a>

					<a
						href="/history"
						class:active={page.url.pathname.startsWith(
							"/history",
						) || page.url.pathname.startsWith("/incident")}
					>
						Incidenten
					</a>
				</nav>
				<h1 class="actualStatus">Alle systemen werken</h1>

				<p id="lastCheck">
					<span class="animation-dot"></span>
					Laatste check 21:44 &bull; volgende over 2 s
				</p>
			</div>
			<div class="bottom">
				<button onclick={() => (showSubscribe = true)} > <Bell size={15} /> Volg Updates </button>
				<div class="disclaimer">
					Deze pagina wordt automatisch bijgewerkt. Bij een
					storing kan de weergave achterlopen.
				</div>
			</div>
		</div>
	</aside>
	<main>
		<div class="wrapper">
			{#if maintenance && !onOwnPage}
				<MaintenanceBanner {maintenance} />
			{/if}
			{@render children()}
			
		</div>
		<Footer />
	</main>
</div>

<SignupForUpdates bind:open={showSubscribe} />

<style>
	@media (prefers-reduced-motion: reduce) {
		.animation-dot::after {
			animation: none;
		}
	}

	.bottom button {
		margin-bottom: 1rem;
		display: flex;
		gap: 7px;
		align-items: center;
		padding: 12px 20px;
		border-radius: 30px;
		background-color: transparent;
		color: var(--panel-text);
		border: 1px solid var(--panel-text);
		cursor: pointer;
		background-color: rgba(255,255,255,.1);
	}

	main .wrapper {
		max-width: 700px;
	}

	.disclaimer {
		position: relative;
		max-width: 100%;
		font-size: 13px;
		color: var(--panel-subtext);
		line-height: 1.4;
	}

	.animation-dot::after {
		content: "";
		position: absolute;
		inset: 0;
		border-radius: 50%;
		border: 5px solid var(--ok);
		animation: pulse 2s ease-out infinite;
		box-sizing: border-box;
	}

	@keyframes pulse {
		from {
			transform: scale(1);
			opacity: 0.9;
		}
		to {
			transform: scale(3);
			opacity: 0;
		}
	}

	#lastCheck {
		font-size: 13px;
		display: flex;
		gap: 12px;
		margin-top: -10px;
		align-items: center;
	}

	#lastCheck .animation-dot {
		border-radius: 50%;
		height: 9px;
		display: block;
		position: relative;
		width: 9px;
		background-color: var(--ok);
	}

	nav {
		margin: 1.5rem 0;
		display: flex;
		gap: 1rem;
	}

	.actualStatus {
		font-weight: 400;
		font-size: 40px;
		margin: 2rem 0;
	}

	nav a {
		color: var(--panel-subtext);
		font-size: 16px;
		text-decoration: none;
	}

	nav a.active {
		color: var(--panel-text);
		position: relative;
	}

	nav a.active::after {
		content: "";
		position: absolute;
		height: 1px;
		width: 100%;
		background-color: var(--panel-text);
		bottom: -5px;
		left: 0;
	}

	.pageWrapper {
		display: grid;
		max-width: 100%;
		overflow: hidden;
		min-height: 100vh;
		grid-template-columns: 400px calc(100% - 400px);
	}

	#logoContainer {
		display: flex;
		gap: 5px;
		align-items: center;
	}

	#logoContainer img {
		max-height: 30px;
	}

	#logoContainer p {
		font-size: 14px;
		margin: 0;
	}

	aside {
		padding: 2rem;
		display: flex;
		justify-content: space-between;
		flex-flow: column;
		background-color: var(--p-ok);
		color: var(--panel-text);
	}

	aside.deg {
		background-color: var(--p-deg);
	}

	aside.out {
		background-color: var(--p-out);
	}

	aside.mnt {
		background-color: var(--p-mnt);
	}

	.pageWrapper {
		display: grid;
		height: 100vh;
		overflow: hidden;
		grid-template-columns: 400px minmax(0, 1fr);
	}

	aside {
		padding: 2rem;
		display: flex;
		justify-content: space-between;
		flex-flow: column;

		background-color: var(--p-ok);
		color: var(--panel-text);

		min-height: 0;
		overflow-y: auto;
		box-sizing: border-box;
	}

	main {
		background-color: var(--bg);
		padding: 3rem 4rem 0 4rem;
		overflow-x: hidden;
		min-width: 0;
		min-height: 0;
		height: 100%;
		box-sizing: border-box;
		overflow-y: auto;
	}

	main .wrapper {
		max-width: 700px;
	}

	main::-webkit-scrollbar {
		display: none;
	}

	@media screen and (min-width: 1300px) {
		.pageWrapper {
			padding: 2rem calc((100% - 1300px) / 2);
			background-color: var(--soft);
			gap: 2rem;

			height: 100vh;
			box-sizing: border-box;
			grid-template-columns: 400px minmax(0, 1fr);
		}

		aside {
			border-radius: 1rem;
		}

		main {
			border-radius: 1rem;
			height: 100%;
		}
	}

	.wrapperContainer {
		display: flex;
		justify-content: space-between;
		flex-flow: column;
		height: 100%;
	}

	@media screen and (max-width: 1150px) {
		main {
			padding: 2rem;
		}
	}

	@media screen and (max-width: 1050px) {
		main {
			padding: 1rem;
			padding-top: 2rem;
		}

		.pageWrapper {
			grid-template-columns: 350px minmax(0, 1fr);
		}
	}

	@media screen and (max-width: 950px) {
		.pageWrapper {
			height: 100%;
			display: block;
		}
		.wrapper {
			padding: 1rem 0 4rem 0;
			margin: auto auto;
		}
		.wrapperContainer {
			max-width: 700px;
			width: 700px;
			margin: auto auto;
		}
		.disclaimer {
			display: none;
		}
		.bottom button {
			display: none;
		}

		aside {
			overflow-x: hidden;
		}
	}

	@media screen and (max-width: 750px) {
		.wrapperContainer,
		.wrapper {
			max-width: 600px;
			width: 600px;
			margin: auto auto;
		}
	}

	@media screen and (max-width: 650px) {
		.wrapperContainer,
		.wrapper {
			max-width: 500px;
			width: 500px;
			margin: auto auto;
		}
	}

	@media screen and (max-width: 550px) {
		.wrapperContainer,
		.wrapper {
			max-width: 90%;
			width: 90%;
			margin: auto auto;
		}
	}

	@media screen and (max-width: 400px) {
		aside {
			padding: 2rem 1rem;
		}
	}
</style>
