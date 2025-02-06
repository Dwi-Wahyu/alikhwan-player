import { config } from 'dotenv';
config();

import { log } from 'console';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: '\*'
	}
});

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

const PORT = process.env.WS_PORT || 3000;
server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
