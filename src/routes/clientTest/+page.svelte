<script>
    import { onMount } from "svelte";
    import { io } from "$lib/webSocketConnection";

    /** @type {{ controllerId: string }} */
    export let params;

    let logs = [];

    /** @type {URL} */
    let controllerURL;
    let controllerId = "";

    onMount(() => {
        io.on("connect", () => {
            console.log(io)
            controllerId = io.id;
            io.on(`output`, data => {
                logs = [...logs, data];
            });
            controllerURL = new URL(`/${controllerId}`, location.origin);

        })
        io.connect();
    })
</script>

{#if controllerId}
    <pre>Controller ID: {controllerId}</pre>
{/if}

{#if controllerURL}
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={controllerURL.toString()}"
        alt={controllerURL.toString()} />
    <br />
    <a href={controllerURL.toString()} target="_blank">{controllerURL.toString()}</a>
{/if}
<pre>Logs:</pre>
{#each logs as log}
    <code>{JSON.stringify(log)}</code> <br />
{/each}