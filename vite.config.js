import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { webSocketServer } from './webSocketPluginVite.js';

export default defineConfig({
	server: {
		port: 5173
	},
	preview: {
		port: 443,
		allowedHosts: ["localhost", "omegapad.fun"]
	},
	plugins: [sveltekit(), webSocketServer]
});
