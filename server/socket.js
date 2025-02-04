import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: '*' // Izinkan semua origin
	}
});

const prisma = new PrismaClient();

// Simpan jumlah pendengar di memori
let totalListeners = 0;

// Ambil jumlah pendengar dari database saat server dimulai
async function initializeTotalListeners() {
	const onlineUser = await prisma.pendengar_online.findFirst({
		where: {
			id: 'jumlah'
		}
	});
	totalListeners = onlineUser?.jumlah || 0;

	if (!onlineUser) {
		const createRow = await prisma.pendengar_online.create({
			data: {
				id: 'jumlah',
				jumlah: 0
			}
		});

		totalListeners = createRow.jumlah;
	}
}

// Handle koneksi Socket.IO
io.on('connection', async (socket) => {
	// Kirim jumlah pendengar saat ini ke klien yang baru terhubung
	socket.emit('total listener', totalListeners);

	// Handle penambahan pendengar
	socket.on('add online user', async () => {
		totalListeners += 1;
		await prisma.pendengar_online.update({
			where: {
				id: 'jumlah'
			},
			data: {
				jumlah: totalListeners
			}
		});
		// Kirim pembaruan ke semua klien
		io.emit('total listener', totalListeners);
	});

	// Handle pengurangan pendengar saat klien disconnect
	socket.on('disconnect', async () => {
		totalListeners -= 1;
		await prisma.pendengar_online.update({
			where: {
				id: 'jumlah'
			},
			data: {
				jumlah: totalListeners
			}
		});
		// Kirim pembaruan ke semua klien
		io.emit('total listener', totalListeners);
	});
});

// Inisialisasi server
initializeTotalListeners().then(() => {
	const PORT = process.env.WS_PORT || 3000;
	server.listen(PORT, () => {
		console.log(`Server is running on http://localhost:${PORT}`);
	});
});
