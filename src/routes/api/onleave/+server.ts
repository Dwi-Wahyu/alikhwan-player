import { json } from '@sveltejs/kit';
import { prisma } from '$lib/utils/prisma';

export async function POST() {
	try {
		const decrementOnlineUser = await prisma.pendengar_online.update({
			data: {
				jumlah: {
					decrement: 1
				}
			},
			where: {
				id: 'jumlah',
				jumlah: {
					gt: 0
				}
			}
		});

		console.log(decrementOnlineUser);

		return json({ success: true });
	} catch (error) {
		console.error('Gagal mengupdate jumlah pendengar:', error);
		return json({ success: false }, { status: 500 });
	}
}
