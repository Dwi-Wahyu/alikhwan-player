<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	let audioElement: HTMLAudioElement;
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let play = $state(false);
	let volume = $state(1);
	let mute = $state(false);

	function decreaseVolume() {
		volume = Math.max(0, volume - 0.1);
	}

	function increaseVolume() {
		volume = Math.min(1, volume + 0.1);
	}

	function toggleMute() {
		mute = !mute;
		volume = mute ? 0 : 1;
	}

	function showComment() {
		const element = document.getElementById('comments');
		element?.scrollIntoView({ behavior: 'smooth' });
	}

	$effect(() => {
		if (audioElement) {
			audioElement.volume = volume;
		}
	});

	function togglePlay() {
		if (audioElement) {
			if (play) {
				audioElement.pause();
			} else {
				audioElement.play();
			}
			play = !play;
		}
	}

	function sendExitData() {
		const fetchRequest = fetch('/api/onleave', {
			method: 'POST'
		});
	}
</script>

<svelte:window on:beforeunload={sendExitData} />

<audio bind:this={audioElement} src="https://stream.radioalikhwan.com"></audio>

<div class="relative h-svh w-full bg-[url('/backgrounds/bg2.png')] bg-cover bg-center text-white">
	<!-- Header -->
	<div class="absolute left-0 top-0 z-10 h-svh w-full bg-black/40 p-9 pt-5"></div>

	<div class="absolute left-0 top-0 z-20 flex h-full w-full flex-col justify-evenly p-10 pt-5">
		<div class="flex justify-end">
			<h1 class="text-end text-xs font-semibold sm:block">Copyright © PT Skytel Indonesia</h1>
		</div>

		<div class="flex h-full w-full flex-col items-center justify-center gap-5">
			<div class="h-64 w-64 rounded-full bg-white/30 p-3">
				<div class="flex h-full w-full items-center justify-center rounded-full bg-white shadow">
					<img src="/logo/logo-alikhwan-nobg.png" class="w-52" alt="Logo Radio Al-Ikhwan" />
				</div>
			</div>

			<h1 class="text-center text-[1.5rem] font-extrabold sm:text-[2rem] sm:font-bold">
				Radio Al-Ikhwan 101,9 FM Makassar
			</h1>

			<div class="mb-3 flex gap-4">
				<a href="https://www.facebook.com/RadioAlikhwanMakassar?locale=id_ID" target="_blank">
					<img src="/icons/facebook.svg" alt="Facebook" />
				</a>
				<a href="https://www.instagram.com/fmraimakassar?igsh=ejJiYTF4bW5pOHVj" target="_blank">
					<img src="/icons/instagram.svg" alt="Instagram" />
				</a>
				<a href="https://www.tiktok.com/@radioalikhwan" target="_blank">
					<img src="/icons/tiktok.svg" alt="Tiktok" />
				</a>
				<a
					href="https://www.facebook.com/sharer/sharer.php?u=https://play.radioalikhwan.com/"
					target="_blank"
				>
					<img src="/icons/youtube.svg" alt="Youtube" />
				</a>
			</div>
		</div>

		<!-- Konten Utama -->
		<div class="flex w-full items-end">
			<div class="flex w-full flex-col gap-5">
				<!-- Kontrol Volume -->
				<div class="flex w-full items-center justify-between gap-3">
					<button onmousedown={decreaseVolume}>
						<img src="/icons/volumedown.svg" class="w-10" alt="Volume Turun" />
					</button>

					<input
						type="range"
						min={0}
						max={1}
						step={0.01}
						bind:value={volume}
						class="w-full bg-gray-300"
					/>

					<button onmousedown={increaseVolume}>
						<img src="/icons/volumeup.svg" class="w-10" alt="Volume Naik" />
					</button>
				</div>

				<!-- Kontrol Pemutar -->
				<div class="mb-3 flex w-full items-center justify-between px-1">
					<a href="https://radioalikhwan.com/">
						<img src="/icons/leave.svg" class="w-5" alt="Keluar" />
					</a>

					<div class="flex items-center gap-8">
						<button onclick={toggleMute}>
							{#if volume === 0}
								<img src="/icons/unmute.svg" class="w-7" alt="Unmute" />
							{:else}
								<img src="/icons/mute.svg" class="w-7" alt="Mute" />
							{/if}
						</button>

						<button onclick={togglePlay}>
							{#if play}
								<img src="/icons/stop.svg" class="w-10" alt="Stop" />
							{:else}
								<img src="/icons/play.svg" class="w-10" alt="Play" />
							{/if}
						</button>

						<button onclick={showComment}>
							<img src="/icons/comment.svg" class="w-7" alt="Komentar" />
						</button>
					</div>

					{#if data.jumlahPendengar}
						<div class="flex items-center gap-1">
							<img src="/icons/online-user.svg" alt="Pendengar" />
							<h1>{data.jumlahPendengar}</h1>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
