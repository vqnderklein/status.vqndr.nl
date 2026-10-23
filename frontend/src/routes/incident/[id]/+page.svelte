<script>
    import { Clock, ChevronLeft, ChevronRight } from "@lucide/svelte";

    import StatusDot from "$lib/components/StatusDot.svelte";

    let report = $state(true);
</script>

<svelte:head>
    <title>[name] &dash; Network status &bull; vqnderklein.nl</title>
</svelte:head>

<a class="backAnchor" href="/history"><ChevronLeft size={12} /> Alle incidenten</a>
<div class="statusbar">
    <div class="incident-status">
        <StatusDot state="mnt" size={12} /> Onderhoud
    </div>
    <div class="status-timing">
        <Clock size={17} style="fill: var(--mnt);color:black;" /> Bezig
    </div>
</div>

<h1>Onderhoud: opslag en back-ups server 2</h1>

<div class="incidentDetails">
    <div class="incidentDetailBlock">
        <div class="title">
            Gestart
        </div>
        <div class="content">
            23 oktober 2026, 11:40
        </div>
    </div>
    <div class="incidentDetailBlock">
        <div class="title">
            Duur
        </div>
        <div class="content">
            Bezig
        </div>
    </div>
    <div class="incidentDetailBlock">
        <div class="title">
            Getroffen
        </div>
        <div class="content">
            Server 2 · CDN, opslag en back-ups, Afbeeldingen, Downloads, E-mail
        </div>
    </div>
    <div class="incidentDetailBlock">
        <div class="title">
            Aangemaakt
        </div>
        <div class="content">
            Handmatig
        </div>
    </div>
</div>

{#if report}
    <a href="/incident/438943849389/report" id="reportBttn">Lees het incidentrapport <ChevronRight size={15} /></a>
{/if}

<h2>Verloop</h2>
<div class="incidentTreeContainer">
    <div class="line"></div>
    <div class="updatesWrapper">
        <div class="updateContainer">
            <div class="header">
                <span class="title">Bezig</span>
                <span class="time">11:40</span>
            </div>
            <p class="update-content">
               Server 2 wordt verplaatst naar nieuwe schijven. Downloads kunnen tijdelijk trager zijn. 
            </p>
        </div>
        <div class="updateContainer">
            <div class="header">
                <span class="title">Bezig</span>
                <span class="time">11:40</span>
            </div>
            <p class="update-content">
               Server 2 wordt verplaatst naar nieuwe schijven. Downloads kunnen tijdelijk trager zijn. 
            </p>
        </div>
    </div>
</div>

<style>
    #reportBttn {
        gap: 5px;
        border-radius: 50px;
        text-decoration: none;
        padding: 16px 24px;
        display: flex;
        align-items: center;
        border: 1px solid var(--panel-text);
        margin: 2rem 0;
        width: max-content;
        color: var(--panel-text);
        transition: 250ms ease-in background-color;
    }

    #reportBttn:hover {
        background-color: var(--panel-text);
        color: black;
    }

    .incidentTreeContainer {
        display: flex;
        gap: 1rem;
        height: 100%;
    }

    .line {
        width: 1px;
        display: block;
        position: relative;
        background-color: var(--line);
    }

    .updateContainer {
        position: relative;
        padding-bottom: 2rem;
    }

    .updateContainer::after {
        content: "";
        position: absolute;
        height: 9px;
        left: calc(-1rem - 5px);
        top: 5px;
        width: 9px;
        aspect-ratio: 1;
        border-radius: 50%;
        background-color: var(--mnt);
    }

    .updateContainer .header {
        display: flex;
        gap: 7px;
        align-items: center;
    }

    .updateContainer .header .title {
        color: var(--panel-text);
        font-weight: 500;
    }

    .updateContainer .header .time {
        color: var(--mut);
        font-weight: 200;
        font-size: 14px;
    }

    .updateContainer .update-content {
        color: var(--panel-subtext);
        margin: 0;
        padding-top: 5px;
    }

    .incidentDetails {
        margin: 1rem 0;
        padding: 1.2rem 0;
        border-bottom: 1px solid var(--line);
        border-top: 1px solid var(--line);
        display: grid;
        grid-template-columns: repeat(3, 1fr);
    }

   h2 {
		color: var(--mut);
		font-weight: 400;
        margin-top: 2rem;
		font-size: 16px;
	}


    .incidentDetailBlock .title {
        color: var(--mut);
        font-size: 14px;
        padding-bottom: 5px;
    }

    .incidentDetailBlock .content {
        color: var(--panel-text);
    }

    .statusbar {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .backAnchor {
        text-decoration: none;
        color: var(--mut);
        margin-bottom: 2rem;
        display: flex;
        align-items: center;
        margin-top: -1rem;
        gap: 5px;
        display: block;
    }

    .statusbar div {
        display: flex;
        align-items: center;
        color: var(--mut);
        gap: 7px;
    }

    h1 {
        font-weight: 500;
        color: var(--panel-text);
    }
</style>