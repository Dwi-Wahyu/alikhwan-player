import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],

	preview: {
		port: 2521
	},

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},

	server: {
		proxy: {
			'/socket.io': {
				target: 'http://localhost:3000', // Sesuaikan dengan URL server Socket.IO
				ws: true // Izinkan WebSocket
			}
		}
	}
});
