import { config } from 'dotenv';
config();

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { handler } from '../build/handler.js';

const port = process.env.PORT || 3000;
const app = express();
const server = createServer(app);

const io = new Server(server);

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

// SvelteKit should handle everything else using Express middleware
// https://github.com/sveltejs/kit/tree/master/packages/adapter-node#custom-server
app.use(handler);

server.listen(port);
