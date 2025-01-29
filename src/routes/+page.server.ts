import { prisma } from '$lib/utils/prisma';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const allComment = await prisma.komentar.findMany({
		include: {
			subkomentar: true
		}
	});

	return { allComment };
};

export const actions = {
	postKomentar: async ({ request }) => {
		const formData = await request.formData();

		const nama = formData.get('nama') as string;
		const isi = formData.get('isi') as string;

		let nama_kosong = false;
		let komentar_kosong = false;

		if (!nama) {
			nama_kosong = true;
		}

		if (!isi) {
			komentar_kosong = true;
		}

		if (!nama || !isi) {
			return fail(400, { nama_kosong, komentar_kosong });
		}

		try {
			const createComment = await prisma.komentar.create({
				data: {
					nama,
					isi
				}
			});

			return { success: true };
		} catch (error) {
			return fail(500, { error });
		}
	},
	replyKomentar: async ({ request }) => {
		const formData = await request.formData();

		const id_komentar = formData.get('id_komentar') as string;
		const replyTo = formData.get('replyTo') as string;
		const nama = formData.get('nama') as string;
		const isi = formData.get('isi') as string;

		let nama_kosong = false;
		let komentar_kosong = false;

		if (!nama) {
			nama_kosong = true;
		}

		if (!isi) {
			komentar_kosong = true;
		}

		if (!nama || !isi) {
			return fail(400, { nama_kosong, komentar_kosong });
		}

		try {
			const createSubcomment = await prisma.subkomentar.create({
				data: {
					nama,
					isi,
					id_komentar,
					replyTo
				}
			});

			return { success: true };
		} catch (error) {
			return fail(500, { error });
		}
	},
	like: async ({ request }) => {
		const formData = await request.formData();

		const id = formData.get('id') as string;
		const tipe = formData.get('tipe') as string;

		try {
			if (tipe == 'komentar') {
				await prisma.komentar.update({
					where: {
						id
					},
					data: {
						like: {
							increment: 1
						}
					}
				});
			} else {
				await prisma.subkomentar.update({
					where: {
						id
					},
					data: {
						like: {
							increment: 1
						}
					}
				});
			}

			return { success: true };
		} catch (error) {
			return fail(500, { error });
		}
	},
	dislike: async ({ request }) => {
		const formData = await request.formData();

		const id = formData.get('id') as string;
		const tipe = formData.get('tipe') as string;

		try {
			if (tipe == 'komentar') {
				await prisma.komentar.update({
					where: {
						id
					},
					data: {
						dislike: {
							increment: 1
						}
					}
				});
			} else {
				await prisma.subkomentar.update({
					where: {
						id
					},
					data: {
						dislike: {
							increment: 1
						}
					}
				});
			}

			return { success: true };
		} catch (error) {
			return fail(500, { error });
		}
	}
} satisfies Actions;
