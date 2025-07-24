<script>
    import { onMount } from "svelte";
    import ioClient from "socket.io-client";
    import { page } from '$app/state';
    
    let io = ioClient(page.url.origin);

    /** @type {Object[]} */
    let logs = [];

    /** @type {URL} */
    let controllerURL;
    let controllerId = "";

    onMount(() => {
        io.on("connect", () => {
            console.log(io)
            if (io.id) controllerId = io.id;
            io.on(`output`, data => {
                logs = [...logs, data];
            });
            controllerURL = new URL(`/controller/${controllerId}`, location.origin);

        });
        io.on("connect_error", err => {
            console.log(err.message);
        });
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