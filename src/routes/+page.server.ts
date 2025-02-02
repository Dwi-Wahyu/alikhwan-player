import { prisma } from '$lib/utils/prisma';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const addListenerOnline = await prisma.pendengar_online.upsert({
		create: {
			jumlah: 1,
			id: 'jumlah'
		},
		update: {
			jumlah: {
				increment: 1
			}
		},
		where: {
			id: 'jumlah'
		}
	});

	return { jumlahPendengar: addListenerOnline.jumlah };
};

export const actions = {
	onLeave: async (event) => {
		const decrementOnlineUser = await prisma.pendengar_online.update({
			data: {
				jumlah: {
					decrement: 1
				}
			},
			where: {
				id: 'jumlah'
			}
		});

		console.log(decrementOnlineUser);
	}
} satisfies Actions;
