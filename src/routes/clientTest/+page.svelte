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

    let controllerState = {
        alpha: false,
        beta: false,
        gamma: false,
        delta: false,
        dPadUp: false,
        dPadDown: false,
        dPadLeft: false,
        dPadRight: false,
        menu: false,
        x: false,
        select: false,
        stickLeft: { angle: 0, distance: 0, moving: false },
        stickRight: { angle: 0, distance: 0, moving: false },
    }

    onMount(() => {
        io.on("connect", () => {
            console.log(io)
            if (io.id) controllerId = io.id;
            io.on(`output`, data => {
                logs = [...logs, data];
                setTimeout(() => {
                    logBook.scrollTop = logBook.scrollHeight;
                }, 7);

                if (data.button == "alpha") controllerState.alpha = data.state;
                else if (data.button == "beta") controllerState.beta = data.state;
                else if (data.button == "gamma") controllerState.gamma = data.state;
                else if (data.button == "delta") controllerState.delta = data.state;
                else if (data.button == "menu") controllerState.menu = data.state;
                else if (data.button == "x") controllerState.x = data.state;
                else if (data.button == "select") controllerState.select = data.state;
                else if (data.button == "stickLeft") controllerState.stickLeft = data.state;
                else if (data.button == "stickRight") controllerState.stickRight = data.state;
                else if (data.button == "dPadUp") controllerState.dPadUp = data.state;
                else if (data.button == "dPadDown") controllerState.dPadDown = data.state;
                else if (data.button == "dPadLeft") controllerState.dPadLeft = data.state;
                else if (data.button == "dPadRight") controllerState.dPadRight = data.state;
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
<b>State:</b>
<pre>{JSON.stringify(controllerState, null, 4)}</pre>
<br /> <br />
<div style:width="800px" style:height="400px" style:overflow-y="scroll" bind:this={logBook}>
    <div style:background-color="white" style:position="sticky" style:top="0" style:font-weight="bold">Logs:</div>
    {#each logs as log, i}
        <pre style:background-color={(i % 2 === 0) ? "#DDDDDD" : "white"}
            style:text-wrap="auto">{JSON.stringify(log)}</pre>
    {/each}
</div>