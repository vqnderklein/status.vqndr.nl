<script lang="ts">
	import { page } from "$app/state";
	import { Mail, Rss, Megaphone, X } from "@lucide/svelte";

	import type { SubscribePayload } from "$lib/types";

	let {
		open = $bindable(false),
		incident = null,
	}: {
		open: boolean;
		/** pass this when the dialog is opened from an incident page */
		incident?: { id: number; title: string } | null;
	} = $props();

	type Tab = "email" | "rss";

	let dialog = $state<HTMLDialogElement>();

	let tab = $state<Tab>("email");
	let email = $state("");
	let incidentOnly = $state(false);
	let specific = $state(false);
	let selected = $state<string[]>([]);
	let error = $state("");
	let sending = $state(false);
	let sent = $state(false);
	let copied = $state(false);

	const groups = [
		{ id: "website", name: "Website" },
		{ id: "login", name: "Inloggen" },
		{ id: "api", name: "API" },
		{ id: "cdn", name: "CDN" },
		{ id: "hosts", name: "Hosts" },
	];

	async function onsubscribe(payload: SubscribePayload) {
		const res = await fetch("/api/v1/subscriptions", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		if (!res.ok) throw new Error("Subscribe failed"); // the dialog shows the error message
	}

	// Open / close the native <dialog> when `open` changes
	$effect(() => {
		if (!dialog) return;
		if (open && !dialog.open) {
			reset();
			dialog.showModal();
		} else if (!open && dialog.open) {
			dialog.close();
		}
	});

	function reset() {
		tab = "email";
		email = "";
		incidentOnly = incident !== null;
		specific = false;
		selected = groups.map((g) => g.id);
		error = "";
		sending = false;
		sent = false;
		copied = false;
	}

	const feedUrl = $derived(
		`${page.url.origin}${incidentOnly && incident ? `/incident/${incident.id}` : ""}/feed.xml`,
	);

	const infoText = $derived(
		incidentOnly
			? "Je ontvangt een e-mail bij elke update van dit incident."
			: specific
				? `Je ontvangt e-mails voor ${selected.length} van ${groups.length} services.`
				: "Je ontvangt e-mails over nieuwe incidenten en over updates van bestaande incidenten.",
	);

	function toggleGroup(id: string) {
		if (selected.includes(id)) {
			if (selected.length > 1)
				selected = selected.filter((g) => g !== id); // keep at least one
		} else {
			selected = [...selected, id];
		}
	}

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		error = "";

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
			error = "Vul een geldig emailadres in.";
			return;
		}

		sending = true;
		try {
			await onsubscribe({
				email: email.trim(),
				incidentId: incidentOnly && incident ? incident.id : null,
				groupIds: !incidentOnly && specific ? selected : null,
			});
			sent = true;
		} catch {
			error = "Er ging iets fout, probeer het later opnieuw";
		} finally {
			sending = false;
		}
	}

	async function copyFeed() {
		try {
			await navigator.clipboard.writeText(feedUrl);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			/* clipboard blocked: the field is selectable anyway */
		}
	}
</script>

<dialog
	bind:this={dialog}
	aria-labelledby="subscribe-title"
	onclose={() => (open = false)}
	onclick={(e) => {
		// a click on the backdrop targets the <dialog> itself
		if (e.target === dialog) open = false;
	}}
>
	<form onsubmit={submit}>
		<header>
			<h2 id="subscribe-title">Volg updates</h2>
			<button
				type="button"
				class="close"
				aria-label="Close"
				onclick={() => (open = false)}
			>
				<X size={18} />
			</button>
		</header>

		<div class="body">
			{#if sent}
				<p class="sentText">
					We hebben een bevestigingsemail verstuurd naar <b
						>{email}</b
					>. Klik op de link in de email op te abonneren op
					updates.
				</p>
				<div class="info">
					<Megaphone size={16} />
					<span>Geen? Controleer uw spam folder</span>
				</div>
			{:else}
				<div
					class="tabs"
					role="tablist"
					aria-label="How do you want to receive updates?"
				>
					<button
						type="button"
						role="tab"
						aria-selected={tab === "email"}
						onclick={() => (tab = "email")}
					>
						<Mail size={16} /> Email
					</button>
					<button
						type="button"
						role="tab"
						aria-selected={tab === "rss"}
						onclick={() => (tab = "rss")}
					>
						<Rss size={16} /> RSS
					</button>
				</div>

				{#if tab === "email"}
					<label class="label" for="subscribe-email"
						>Vul uw emailadres in</label
					>
					<input
						id="subscribe-email"
						type="email"
						inputmode="email"
						autocomplete="email"
						placeholder="e.g. name@example.com"
						bind:value={email}
						aria-invalid={error ? true : undefined}
						aria-describedby={error
							? "subscribe-error"
							: undefined}
					/>
					{#if error}<p
							id="subscribe-error"
							class="error"
							role="alert"
						>
							{error}
						</p>{/if}

					{#if incident}
						<label class="check">
							<input
								type="checkbox"
								bind:checked={incidentOnly}
							/>
							<span>
								Volg alleen dit incident
								<small>{incident.title}</small>
							</span>
						</label>
					{/if}

					{#if !incidentOnly}
						<label class="check">
							<input
								type="checkbox"
								bind:checked={specific}
							/>
							<span>Volg specifieke componenten</span>
						</label>

						{#if specific}
							<div class="groups">
								{#each groups as group (group.id)}
									<label class="check">
										<input
											type="checkbox"
											checked={selected.includes(
												group.id,
											)}
											onchange={() =>
												toggleGroup(
													group.id,
												)}
										/>
										<span>{group.name}</span>
									</label>
								{/each}
							</div>
						{/if}
					{/if}

					<div class="info">
						<Megaphone size={16} />
						<span>{infoText}</span>
					</div>
				{:else}
					<label class="label" for="subscribe-feed"
						>Feed address</label
					>
					<input
						id="subscribe-feed"
						class="mono"
						readonly
						value={feedUrl}
						onfocus={(e) => e.currentTarget.select()}
					/>
					<div class="info">
						<Megaphone size={16} />
						<span
							>Plak dit adres in je feedlezer en je ziet
							elke update zodra die wordt geplaatst.</span
						>
					</div>
				{/if}
			{/if}
		</div>

		<footer>
			{#if sent}
				<button
					type="button"
					class="primary"
					onclick={() => (open = false)}>Close</button
				>
			{:else if tab === "email"}
				<button type="submit" class="primary" disabled={sending}>
					{sending ? "Aanmelden." : "Volg"}
				</button>
			{:else}
				<button type="button" class="primary" onclick={copyFeed}>
					{copied ? "Gekopieerd" : "Kopieer"}
				</button>
			{/if}
		</footer>
	</form>
</dialog>

<style>
	dialog {
		width: min(560px, calc(100vw - 32px));
		max-height: calc(100vh - 48px);
		padding: 0;
		border: 1px solid var(--line);
		border-radius: 12px;
		background: var(--bg);
		color: var(--ink);
		box-shadow: 0 12px 40px rgb(0 0 0 / 0.18);
		overflow: auto;
		max-width: 100%;
		overflow-x: hidden;
	}
	dialog::backdrop {
		background: rgb(10 20 20 / 0.3);
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 14px 14px 14px 22px;
		border-bottom: 1px solid var(--line);
	}
	h2 {
		margin: 0;
		font-size: 17px;
		font-weight: 500;
	}
	.close {
		display: grid;
		place-items: center;
		width: 34px;
		height: 34px;
		border: 0;
		border-radius: 50%;
		background: none;
		color: var(--mut);
		cursor: pointer;
	}
	.close:hover {
		background: var(--soft);
		color: var(--ink);
	}

	.body {
		padding: 6px 22px 22px;
	}

	.tabs {
		display: flex;
		gap: 24px;
		margin-bottom: 18px;
		border-bottom: 1px solid var(--line);
	}
	.tabs button {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-bottom: -1px;
		padding: 14px 2px 10px;
		border: 0;
		border-bottom: 2px solid transparent;
		background: none;
		color: var(--mut);
		font: inherit;
		cursor: pointer;
	}
	.tabs button[aria-selected="true"] {
		color: var(--ink);
		border-color: var(--ink);
	}

	.label {
		display: block;
		margin-bottom: 8px;
		font-size: 15px;
	}
	input[type="email"],
	input[readonly] {
		width: 100%;
		height: 44px;
		box-sizing: border-box;
		padding: 0 14px;
		border: 1px solid var(--line);
		border-radius: 8px;
		background: var(--bg);
		color: var(--ink);
		font: inherit;
	}
	input::placeholder {
		color: var(--mut);
		opacity: 0.7;
	}
	input:focus-visible {
		outline: 3px solid color-mix(in oklab, var(--mnt) 40%, transparent);
		border-color: var(--mnt);
	}
	.mono {
		font-family: ui-monospace, Menlo, monospace;
		font-size: 13px;
	}
	.error {
		margin: 8px 0 0;
		font-size: 14px;
		color: color-mix(in oklab, var(--out) 70%, var(--ink));
	}

	.check {
		display: flex;
		gap: 10px;
		align-items: flex-start;
		margin-top: 18px;
		cursor: pointer;
	}
	.check input {
		margin: 4px 0 0;
		accent-color: var(--ink);
	}
	.check small {
		display: block;
		font-size: 13px;
		color: var(--mut);
	}
	.groups {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0 16px;
		margin-left: 26px;
	}
	.groups .check {
		margin-top: 12px;
	}

	.info {
		display: flex;
		gap: 12px;
		align-items: flex-start;
		margin-top: 20px;
		padding: 14px 16px;
		border-radius: 8px;
		background: var(--soft);
		color: var(--mut);
		font-size: 14px;
		line-height: 1.45;
	}
	.info :global(svg) {
		flex: none;
		margin-top: 2px;
	}
	.sentText {
		margin: 18px 0 0;
	}

	footer {
		display: flex;
		justify-content: flex-end;
		padding: 14px 22px;
		border-top: 1px solid var(--line);
	}
	.primary {
		padding: 9px 18px;
		border: 0;
		border-radius: 8px;
		background: var(--soft);
		color: var(--ink);
		font: inherit;
		cursor: pointer;
	}
	.primary:hover:not(:disabled) {
		background: var(--line);
	}
	.primary:disabled {
		opacity: 0.6;
		cursor: default;
	}

	@media (max-width: 480px) {
		.groups {
			grid-template-columns: 1fr;
		}
	}
</style>
