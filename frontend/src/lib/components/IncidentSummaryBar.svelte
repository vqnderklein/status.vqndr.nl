<script>
    import { CircleCheck } from "@lucide/svelte";
</script>

<a class="container" href="/incident/438943849389">
    <div class="information">
        <div class="incident-title">
            Foutmeldingen bij het opslaan van gegevens
        </div>
        <div class="incident-details">
            <p>10 december 2025 &bull; 38 min &bull; Automatisch gedetecteerd</p>
        </div>
    </div>
    <div class="status">
        <CircleCheck color="black" style="fill: var(--ok);" /> Verholpen  
    </div>
</a>

<style>

.container {
    text-decoration: none;
    color: var(--panel-text);
    display: flex;
    justify-content: space-between;
    padding: 7px 0;
    border-bottom: 1px solid var(--line);
}

.container:hover .incident-title {
    text-decoration: underline;
}

.incident-title {
    font-size: 18px;
}

.container .status {
    display: flex;
    align-items: start;
    color: var(--mut);
    gap: 7px;
}

.incident-details {
    font-size: 13px;
    margin-top: -5px;
    color: var(--mut);
}

</style>