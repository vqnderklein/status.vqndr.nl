<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import "@fontsource-variable/figtree";

  import { page } from "$app/state";

  import type { MaintenanceWindow } from "$lib/types";
  import MaintenanceBanner from "$lib/components/MaintenanceBanner.svelte";

  import "../global.css";

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
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="pageWrapper">
  <aside class={cur_state}>
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
        <a href="/" class:active={page.url.pathname === "/"}> Overzicht </a>

        <a
          href="/history"
          class:active={page.url.pathname.startsWith("/history") ||
            page.url.pathname.startsWith("/incident")}
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
    <div class="disclaimer">
      Deze pagina wordt automatisch bijgewerkt. Bij een storing kan de weergave
      achterlopen.
    </div>
  </aside>
  <main>
    {#if maintenance && !onOwnPage}
      <MaintenanceBanner {maintenance} />
    {/if}
    {@render children()}
  </main>
</div>

<style>
  @media (prefers-reduced-motion: reduce) {
    .animation-dot::after {
      animation: none;
    }
  }

  main {
    background-color: var(--bg);
    padding: 2rem;
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
    height: 100vh;
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
</style>
