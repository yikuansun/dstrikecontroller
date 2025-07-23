<script>
    import { onMount } from "svelte";
    import * as skio from "sveltekit-io";

    /** @type {{ controllerId: string }} */
    export let params;

    let socket;
    let logs = [];

    onMount(() => {
        socket = skio.get();
        socket.on(`output`, data => {
            logs = [...logs, data];
        });
        console.log(socket)
    })
</script>

{#if socket}
    <pre>Socket ID: {socket.id}</pre>
{/if}
<pre>Logs:</pre>
{#each logs as log}
    <code>{JSON.stringify(log)}</code> <br />
{/each}