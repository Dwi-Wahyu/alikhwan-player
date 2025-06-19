import { config } from 'dotenv';
config();

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { handler } from '../build/handler.js';

const port = process.env.PORT || 3000;
const app = express();
const server = createServer(app);

// Konfigurasi CORS (jika client beda origin atau pakai dev server Vite)
const io = new Server(server, {
	cors: {
		origin: '*', // Ganti ini dengan origin yang tepat untuk produksi
		methods: ['GET', 'POST']
	}
});

let totalListeners = 0;

io.on('connection', (socket) => {
	console.log('Socket connected:', socket.id);
	socket.emit('total listener', totalListeners);

	socket.on('add online user', () => {
		totalListeners = (totalListeners ?? 0) + 1;
		console.log('Menambahkan Jumlah Pendengar :', totalListeners);
		io.emit('total listener', totalListeners);
	});

	socket.on('disconnect', () => {
		totalListeners = Math.max(0, (totalListeners ?? 0) - 1);
		console.log('Mengurangi Jumlah Pendengar :', totalListeners);
		io.emit('total listener', totalListeners);
	});
});

// Integrasi middleware SvelteKit
app.use(handler);

// Mulai server
server.listen(port, () => {
	console.log(`✅ Server berjalan di http://localhost:${port}`);
});
