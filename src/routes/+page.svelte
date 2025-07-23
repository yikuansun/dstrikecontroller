<script>
    import { goto } from "$app/navigation";

    let controllerId = 0;
</script>

<label>
    Controller ID:
    <input type="number" bind:value={controllerId} />
</label>
<button on:click={() => {
    goto("/" + controllerId);
}}>Go</button>