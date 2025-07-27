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

    /** @type {HTMLDivElement} */
    let logBook;

    onMount(() => {
        io.on("connect", () => {
            console.log(io)
            if (io.id) controllerId = io.id;
            io.on(`output`, data => {
                logs = [...logs, data];
                setTimeout(() => {
                    logBook.scrollTop = logBook.scrollHeight;
                }, 7);
            });
            controllerURL = new URL(`/controller/${controllerId}`, location.origin);

        });
        io.on("connect_error", err => {
            console.log(err.message);
        });
        io.connect();
    });
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
<br /> <br />
<div style:width="800px" style:height="400px" style:overflow-y="scroll" bind:this={logBook}>
    <div style:background-color="white" style:position="sticky" style:top="0" style:font-weight="bold">Logs:</div>
    {#each logs as log, i}
        <pre style:background-color={(i % 2 === 0) ? "#DDDDDD" : "white"}
            style:text-wrap="auto">{JSON.stringify(log)}</pre>
    {/each}
</div>