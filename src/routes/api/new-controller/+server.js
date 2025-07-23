import { nextAvailableId, controllers } from "$lib/stores";
import { get } from "svelte/store";

export async function POST() {
    let id = get(nextAvailableId);
    nextAvailableId.update(n => n + 1);
    let token = Math.random().toString(36).slice(2);
    let newController = {
        id: id,
        token: token,
    };
    
    controllers.update(controllers => [...controllers, newController]);

    return new Response(JSON.stringify(newController));
}