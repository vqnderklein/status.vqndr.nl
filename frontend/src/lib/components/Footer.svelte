<script lang="ts">
	import { Copyright } from "@lucide/svelte";
	import SignupForUpdates from "./SignupForUpdates.svelte";
	import type { SubscribePayload } from "$lib/types";

	let showSubscribe = $state(false);

	const groups = [
		{ id: "website", name: "Website" },
		{ id: "login", name: "Inloggen" },
		{ id: "api", name: "API" },
		{ id: "cdn", name: "CDN" },
		{ id: "hosts", name: "Hosts" },
	];

	async function subscribe(payload: SubscribePayload) {
		const res = await fetch("/api/v1/subscriptions", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		if (!res.ok) throw new Error("Subscribe failed"); // the dialog shows the error message
	}
</script>

<footer>
	<div class="branding">
		<div id="logoContainer">
			<img
				class="favicon"
				src="https://vqnderklein.nl/img/favicon-light.svg"
				alt=""
			/>
			<p>vqnderklein</p>
		</div>
		<p>
			Deze status wordt elke minuut automatisch gecontroleerd en kan
			daardoor iets achterlopen op de werkelijkheid.
		</p>
	</div>
	<div class="links">
		<span class="header"> Pagina's </span>
		<ul>
			<li><a href="/">Overzicht</a></li>
			<li><a href="/history">Incidenten</a></li>
			<li>
				<button onclick={() => (showSubscribe = true)}>Volg updates</button>
			</li>
		</ul>
	</div>
	<div class="links">
		<span class="header"> Meer </span>
		<ul>
			<li>
				<a href="https://vqnderklein.nl" target="_blank"
					>Naar vqnderklein.nl</a
				>
			</li>
			<li>
				<a href="https://vqnderklein.nl/contact" target="_blank"
					>Contact opnemen</a
				>
			</li>
		</ul>
	</div>
</footer>
<div class="copyright">
	<span class="copyright">
		<Copyright size={15} /> 2026 vqnderklein.nl
	</span>
	<span class="timings"> Alle tijden in Nederlandse tijd </span>
</div>

<SignupForUpdates bind:open={showSubscribe} />

<style>
	footer {
		display: grid;
		grid-template-columns: 1.6fr 1fr 1fr;
		gap: 32px;
		margin-top: 5rem;
		border-top: 1px solid var(--line);
		padding: 2rem 0;
		border-bottom: 1px solid var(--line);
	}

	#logoContainer {
		display: flex;
		gap: 5px;
		align-items: center;
	}

	#logoContainer img {
		max-height: 30px;
	}

	footer .header {
		color: var(--mut);
	}

	footer ul {
		list-style-type: none;
		margin: 0;
		padding: 0;
		margin-top: 1rem;
	}

	footer ul li {
		padding: 5px 0;
	}

	footer ul li a {
		text-decoration: none;
		color: var(--panel-text);
		font-size: 15px;
	}

	footer ul li a:hover,
	footer ul li button:hover {
		text-decoration: underline;
	}

	footer ul li button {
		background-color: transparent;
		border: transparent;
		outline: transparent;
		cursor: pointer;
		color: var(--panel-text);
		font-family: "Figtree Variable", sans-serif;
		font-size: 15px;
		padding: 0;
	}

	.copyright .copyright {
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.copyright {
		color: var(--mut);
		display: flex;
		font-size: 14px;
		justify-content: space-between;
		align-items: center;
		padding: 10px 0;
	}

	#logoContainer p {
		font-size: 14px;
		margin: 0;
		color: var(--panel-text);
	}

	.branding p {
		color: var(--panel-subtext);
		line-height: 1.4;
		font-size: 15px;
	}
</style>
