<script lang="ts">
	import { enhance } from '$app/forms';
	import Comment from '$lib/components/Comment.svelte';
	import type { PageProps } from './$types';

	import toast, { Toaster } from 'svelte-5-french-toast';
	import ToastContainer from '$lib/components/ToastContainer.svelte';

	let myModal: HTMLDialogElement;

	let audioElement: HTMLAudioElement;
	let streamURL = 'https://stream.radioparadise.com/mp3-192';

	let play = $state(false);

	let volume = $state(1);

	function openModal() {
		myModal?.showModal();
	}

	function decreaseVolume() {
		volume = Math.max(0, volume - 0.1);
	}

	function increaseVolume() {
		volume = Math.min(1, volume + 0.1);
	}

	let { data, form }: PageProps = $props();

	$effect(() => {
		if (audioElement) {
			audioElement.volume = volume;
		}

		if (form?.success) {
			toast.success('Berhasil Menambahkan Komentar', { position: 'bottom-right' });
			myModal.close();
		}
	});

	function togglePlay() {
		if (play) {
			audioElement.pause();
			play = false;
		} else {
			audioElement.play();
			play = true;
		}
	}

	let showToastContainer = $state(true);

	function checkScreenWidth() {
		if (typeof window !== 'undefined') {
			showToastContainer = window.innerWidth >= 640;
		}
	}

	checkScreenWidth();

	$effect(() => {
		if (typeof window !== 'undefined') {
			// Ensure this runs only in the browser
			window.addEventListener('resize', checkScreenWidth);
			return () => {
				window.removeEventListener('resize', checkScreenWidth);
			};
		}
	});
</script>

<Toaster />

<audio bind:this={audioElement} src="https://stream.radioparadise.com/mp3-192"></audio>

{#if showToastContainer}
	<ToastContainer allComment={data.allComment} />
{/if}

<div class="relative h-svh w-full bg-[url('/backgrounds/bg2.png')] bg-cover bg-center text-white">
	<!-- Header -->
	<div class="absolute left-0 top-0 z-10 h-svh w-full bg-black/40 p-9 pt-5">
		<div class="flex justify-between">
			<a href="https://radioalikhwan.com/">
				<img src="/icons/leave.svg" class="w-5" alt="" />
			</a>
			<div>
				<h1 class="text-end text-xs font-semibold sm:block">Copyright © PT Skytel Indonesia</h1>
			</div>
		</div>

		<div class="flex h-full w-full items-center justify-center sm:hidden">
			<div class="mb-20 h-64 w-64 rounded-full bg-white/30 p-3">
				<div
					class="mb-32 flex h-full w-full items-center justify-center rounded-full bg-white shadow"
				>
					<img src="/logo/logo-alikhwan-nobg.png" class="w-52" alt="" />
				</div>
			</div>
		</div>
	</div>

	<!-- Konten Utama -->
	<div class="absolute z-20 flex h-full w-full items-end">
		<div class="flex w-full flex-col gap-5 p-10">
			<!-- Judul dan Logo -->
			<div class="hidden items-center gap-3 sm:flex">
				<img src="/logo/alikhwan-player-white.png" class="w-[4rem]" alt="" />
				<div>
					<h1 class="text-2xl font-bold">Radio Al-Ikhwan 101,9 FM Makassar</h1>
					<h1 class="text-xl font-semibold">radio al ikhwan jingle (1)</h1>
				</div>
			</div>

			<!-- Kontrol Volume -->
			<div class="flex w-full items-center justify-between gap-3">
				<button onmousedown={decreaseVolume}>
					<img src="/icons/volumedown.svg" class="w-10" alt="" />
				</button>

				<input
					type="range"
					min={0}
					max={1}
					step={0.01}
					bind:value={volume}
					class="range range-xs bg-gray-300"
				/>

				<button onmousedown={increaseVolume}>
					<img src="/icons/volumeup.svg" class="w-10" alt="" />
				</button>
			</div>

			<!-- Kontrol Pemutar -->
			<div class="flex w-full items-center justify-between">
				<img src="/icons/volumex.svg" class="w-7" alt="" />

				<button onclick={togglePlay}>
					{#if play}
						<img src="/icons/stop.svg" class="w-10" alt="" />
					{:else}
						<img src="/icons/play.svg" class="w-10" alt="" />
					{/if}
				</button>

				<button onclick={openModal}>
					<img src="/icons/comment.svg" class="w-7" alt="" />
				</button>
			</div>
		</div>
	</div>
</div>

<div class="flex w-full flex-col gap-2 bg-[#1B1B1B] p-10 text-white sm:hidden">
	<h1 class=" mb-2 text-xl font-semibold">Komentar</h1>

	<Comment dataKomentar={data.allComment} />
</div>

<!-- Modal -->
<dialog bind:this={myModal} id="my_modal_3" class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
		</form>
		<form action="?/postKomentar" method="POST" class="mt-3 flex w-full flex-col gap-3" use:enhance>
			<h1 class="text-center text-xl font-bold">Tambahkan Komentar</h1>
			<div>
				<label for="nama" class="mb-2 block font-semibold">Nama</label>
				<input
					type="text"
					id="nama"
					name="nama"
					placeholder="Ketik Nama"
					class="input input-bordered w-full text-sm"
				/>
				{#if form?.nama_kosong}<p class="mt-1 text-sm font-semibold text-red-600">
						Mohon isi nama anda
					</p>{/if}
			</div>
			<div>
				<label for="komentar" class="mb-2 block font-semibold">Komentar</label>
				<textarea
					name="isi"
					id="komentar"
					class="textarea textarea-bordered w-full"
					placeholder="Ketik Komentar"
				></textarea>
				{#if form?.komentar_kosong}<p class="text-sm font-semibold text-red-600">
						Mohon isi komentar anda
					</p>{/if}
			</div>

			<button type="submit" class="btn btn-neutral">Submit</button>
		</form>
	</div>
</dialog>
