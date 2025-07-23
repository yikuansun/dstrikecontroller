import { readable, writable } from "svelte/store";

export let nextAvailableId = writable(0);

/** @type {Array.<{
 *  id: number,
 *  token: string,
 * }>} */
let _controllers = [];
export let controllers = writable(_controllers);