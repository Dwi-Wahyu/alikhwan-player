<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import moment from 'moment';
	import toast from 'svelte-5-french-toast';

	let { dataKomentar } = $props();

	let replyTo = $state('');
	let id_komentar = $state('');

	let replyModal: HTMLDialogElement;

	let liked: string[] = $state([]);
	let disliked: string[] = $state([]);

	let showReply: string[] = $state([]);

	function triggerReply(id: string, nama: string) {
		replyTo = nama;
		id_komentar = id;
		replyModal?.showModal();
	}

	function toggleShowReply(id: string) {
		showReply.push(id);
	}

	async function handleSubmitReply(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);

		const response = await fetch('/?/replyKomentar', {
			method: 'POST',
			body: formData
		});

		const result = await response.json();

		console.log(result);

		if (result.type == 'success') {
			replyModal.close();
			toast.success('Berhasil Membalas Komentar', { position: 'bottom-right' });
			invalidateAll();
		}
	}

	async function handleLike(id: string, tipe: string) {
		const formData = new FormData();
		formData.append('id', id);
		formData.append('tipe', tipe);

		const response = await fetch('/?/like', {
			method: 'POST',
			body: formData
		});

		const result = await response.json();
		if (result.type == 'success') {
			invalidateAll();
			liked = [...liked, id];
			disliked = disliked.filter((item) => item !== id);
		}
	}

	async function handleDislike(id: string, tipe: string) {
		const formData = new FormData();
		formData.append('id', id);
		formData.append('tipe', tipe);

		const response = await fetch('/?/dislike', {
			method: 'POST',
			body: formData
		});

		const result = await response.json();
		if (result.type == 'success') {
			invalidateAll();
			disliked = [...disliked, id];
			liked = liked.filter((item) => item !== id);
		}
	}
</script>

{#if !dataKomentar.length}
	<div class="flex w-full justify-center gap-2 text-center">
		<img src="/icons/empty.svg" alt="" />
		<h1 class="text-lg font-semibold">Belum Ada Komentar</h1>
	</div>
{/if}

{#each dataKomentar as komentar}
	<div class="flex items-center justify-between pb-2">
		<div class="flex items-center gap-3">
			<div>
				<div class="mb-1">
					<h1 class="font-semibold">{komentar.nama}</h1>
					<h1>{komentar.isi}</h1>
				</div>

				<div class="flex items-center gap-1">
					<h1 class="text-xs">{moment(komentar.createdAt).format('YYYY-MM-DD')}</h1>

					<button class="text-xs" onclick={() => triggerReply(komentar.id, komentar.nama)}>
						Reply
					</button>
				</div>
			</div>
		</div>

		<div class="flex items-center gap-2">
			<button onclick={() => handleLike(komentar.id, 'komentar')}>
				{#if liked.find((value) => value == komentar.id)}
					<img src="/icons/liked.svg" alt="" />
				{:else}
					<img src="/icons/like.svg" alt="" />
				{/if}
				<h1>{komentar.like}</h1>
			</button>
			<button onclick={() => handleDislike(komentar.id, 'komentar')}>
				{#if disliked.find((value) => value == komentar.id)}
					<img class="rotate-180" src="/icons/liked.svg" alt="" />
				{:else}
					<img class="rotate-180" src="/icons/like.svg" alt="" />
				{/if}
				<h1>{komentar.dislike}</h1>
			</button>
		</div>
	</div>

	{#if komentar.subkomentar.length && !showReply.includes(komentar.id)}
		<button class="text-sm" onclick={() => toggleShowReply(komentar.id)}>
			Show {komentar.subkomentar.length} replies
		</button>
	{/if}

	{#if showReply.includes(komentar.id)}
		{#each komentar.subkomentar as subkomentar}
			<div class="flex items-center justify-between pb-2 pl-5">
				<div class="flex items-center gap-3">
					<div>
						<div class="mb-1">
							<div class="flex items-center gap-2">
								<h1 class="font-semibold">{subkomentar.nama}</h1>
								<img src="/icons/triangle.svg" alt="" />
								<h1>{subkomentar.replyTo}</h1>
							</div>
							<h1>{subkomentar.isi}</h1>
						</div>

						<div class="flex items-center gap-1">
							<h1 class="text-xs">{moment(subkomentar.createdAt).format('YYYY-MM-DD')}</h1>

							<button
								class="text-xs"
								onclick={() => triggerReply(subkomentar.id_komentar, subkomentar.nama)}
							>
								Reply
							</button>
						</div>
					</div>
				</div>
				<div class="flex items-center gap-2">
					<button onclick={() => handleLike(subkomentar.id, 'subkomentar')}>
						{#if liked.find((value) => value == subkomentar.id)}
							<img src="/icons/liked.svg" alt="" />
						{:else}
							<img src="/icons/like.svg" alt="" />
						{/if}
						<h1>{subkomentar.like}</h1>
					</button>
					<button onclick={() => handleDislike(subkomentar.id, 'subkomentar')}>
						{#if disliked.find((value) => value == subkomentar.id)}
							<img class="rotate-180" src="/icons/liked.svg" alt="" />
						{:else}
							<img class="rotate-180" src="/icons/like.svg" alt="" />
						{/if}
						<h1>{subkomentar.dislike}</h1>
					</button>
				</div>
			</div>
		{/each}
	{/if}
{/each}

<!-- Modal -->
<dialog
	bind:this={replyModal}
	id="my_modal_3"
	class="modal modal-bottom text-black sm:modal-middle"
>
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
		</form>
		<!-- <form
			action="?/replyKomentar"
			method="POST"
			class="mt-3 flex w-full flex-col gap-3"
			use:enhance
		> -->
		<form class="mt-3 flex w-full flex-col gap-3" onsubmit={handleSubmitReply}>
			<h1 class="text-center text-xl font-bold">Reply Komentar {replyTo}</h1>
			<input
				type="text"
				id="id_komentar"
				name="id_komentar"
				bind:value={id_komentar}
				class="input input-bordered hidden w-full"
			/>
			<input
				type="text"
				id="replyTo"
				name="replyTo"
				bind:value={replyTo}
				class="input input-bordered hidden w-full"
			/>
			<div>
				<label for="nama" class="mb-2 block font-semibold">Nama</label>
				<input
					type="text"
					id="nama"
					name="nama"
					placeholder="Ketik Nama"
					class="input input-bordered w-full"
					required
				/>
			</div>
			<div>
				<label for="komentar" class="mb-2 block font-semibold">Komentar</label>
				<textarea
					name="isi"
					id="komentar"
					class="textarea textarea-bordered w-full"
					placeholder="Ketik Komentar"
					required
				></textarea>
			</div>

			<button type="submit" class="btn btn-neutral">Submit</button>
		</form>
	</div>
</dialog>
