<script>
    import { onMount } from "svelte";
    import * as skio from "sveltekit-io";

    /** @type {{ controllerId: string }} */
    export let params;

    let socket;
    let logs = [];

    onMount(() => {
        socket = skio.get();
        socket.on(`c${params.controllerId}-input`, data => {
            logs = [...logs, data];
        });
        console.log(socket)
    })
</script>

<pre>
    {JSON.stringify(logs, null, 2)}
</pre>