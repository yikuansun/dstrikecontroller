import { controllers } from "$lib/stores";
import { get } from "svelte/store";

export async function POST({ params, request }) {
    const { controllerId } = params;
    const controller = get(controllers).find(c => c.id === controllerId);
    if (!controller) {
        return new Response(JSON.stringify({ error: "Controller not found" }), { status: 404 });
    }
    const { input } = await request.json();
    controller.input = input;
    // TODO: Send input to the controller by firing event
    return new Response(JSON.stringify({ success: true }));
}