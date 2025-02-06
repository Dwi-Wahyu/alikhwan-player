import { sveltekit } from '@sveltejs/kit/vite';

import { type ViteDevServer, defineConfig } from 'vite';

import { Server } from 'socket.io';

const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;

		const io = new Server(server.httpServer);

		let totalListeners = 0;

		io.on('connection', async (socket) => {
			socket.emit('total listener', totalListeners);

			socket.on('add online user', async () => {
				totalListeners += 1;

				console.log('Jumlah Pendengar : ' + totalListeners);

				io.emit('total listener', totalListeners);
			});

			socket.on('disconnect', async () => {
				totalListeners -= 1;

				if (totalListeners < 0) {
					totalListeners = 0;
				}

				console.log('Jumlah Pendengar : ' + totalListeners);

				io.emit('total listener', totalListeners);
			});
		});
	}
};

export default defineConfig({
	plugins: [sveltekit(), webSocketServer],

	preview: {
		port: 2521
	},

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
