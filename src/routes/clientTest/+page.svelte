<script>
    import { onMount } from "svelte";
    import * as skio from "sveltekit-io";

    /** @type {{ controllerId: string }} */
    export let params;

    let socket;
    let logs = [];

    /** @type {URL} */
    let controllerURL;

    onMount(() => {
        socket = skio.get();
        socket.on(`output`, data => {
            logs = [...logs, data];
        });
        console.log(socket)
        controllerURL = new URL(`/${socket.id}`, location.origin);
    })
</script>

{#if socket}
    <pre>Socket ID: {socket.id}</pre>
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