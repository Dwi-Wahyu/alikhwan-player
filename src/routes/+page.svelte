<script lang="ts">
	import { io } from 'socket.io-client';
	import { onDestroy, onMount } from 'svelte';

	let socket = io();

	let audioElement: HTMLAudioElement;

	let totalListener = $state(0);
	let play = $state(false);
	let volume = $state(1);
	let mute = $state(false);

	let currentArtist = $state('Unknown Artist');
	let currentTitle = $state('Unknown Title');

	let fetchInterval: number;

	async function fetchNowPlaying() {
		try {
			const response = await fetch(
				'https://stream.radioalikhwan.com/listen/al_ikhwan_fm/status-json.xsl'
				// 'https://stream.radioalikhwan.com/listen/rai_fm_stream/status-json.xsl'
				// 'https://a7.alhastream.com:4190/status-json.xsl',
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();

			if (data.icestats && data.icestats.source) {
				const mainSource = data.icestats.source;
				if (mainSource.artist && mainSource.title) {
					currentArtist = mainSource.artist;
					currentTitle = mainSource.title;
					return;
				} else if (mainSource.yp_currently_playing) {
					// Fallback jika artist dan title terpisah tidak ada, gunakan yp_currently_playing
					const parts = mainSource.yp_currently_playing.split(' - ');
					if (parts.length >= 2) {
						currentArtist = parts[0];
						currentTitle = parts.slice(1).join(' - ');
						return;
					} else {
						currentArtist = 'Unknown Artist';
						currentTitle = mainSource.yp_currently_playing;
						return;
					}
				} else {
					currentArtist = '';
					currentTitle = 'Siaran Studio';
					return;
				}
			}

			// Pastikan data yang kita butuhkan ada
			if (data.icestats && data.icestats.source && data.icestats.source.length > 0) {
				// Asumsi source pertama adalah stream utama
				const mainSource = data.icestats.source[0];
				if (mainSource.artist && mainSource.title) {
					currentArtist = mainSource.artist;
					currentTitle = mainSource.title;
				} else if (mainSource.yp_currently_playing) {
					// Fallback jika artist dan title terpisah tidak ada, gunakan yp_currently_playing
					const parts = mainSource.yp_currently_playing.split(' - ');
					if (parts.length >= 2) {
						currentArtist = parts[0];
						currentTitle = parts.slice(1).join(' - ');
					} else {
						currentArtist = 'Unknown Artist';
						currentTitle = mainSource.yp_currently_playing;
					}
				} else {
					currentArtist = '';
					currentTitle = 'Siaran Studio';
				}
			} else {
				currentArtist = 'Unknown Artist';
				currentTitle = 'No Stream Data Available';
			}
		} catch (error) {
			console.error('Error fetching now playing data:', error);
			currentArtist = 'Error';
			currentTitle = 'Failed to load song info';
		}
	}

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

	onMount(() => {
		socket.emit('add online user');
		socket.on('total listener', (total: number) => {
			totalListener = total;
		});

		fetchNowPlaying();
		fetchInterval = setInterval(fetchNowPlaying, 10000); // 10 detik

		window.addEventListener('beforeunload', () => {
			socket.disconnect();
		});
	});

	onDestroy(() => {
		socket.disconnect();
		// Bersihkan interval saat komponen dihancurkan untuk menghindari memory leaks
		clearInterval(fetchInterval);
	});
</script>

<!-- <audio bind:this={audioElement} src="https://stream.radioalikhwan.com/listen/rai_fm_stream/1" -->
<!-- <audio bind:this={audioElement} src="https://a7.alhastream.com:4190/radio"></audio> -->
<audio bind:this={audioElement} src="https://stream.radioalikhwan.com/listen/al_ikhwan_fm/stream"
></audio>

<div class="relative h-svh w-full bg-[url('/backgrounds/bg2.png')] bg-cover bg-center text-white">
	<div class="absolute left-0 top-0 z-10 h-svh w-full bg-black/40 p-9 pt-5"></div>

	<div class="absolute left-0 top-0 z-20 flex h-full w-full flex-col justify-evenly p-10 pt-5">
		<div class="flex justify-between">
			<div class="flex items-center gap-1">
				<img src="/icons/online-user.svg" alt="Pendengar" />
				<h1>{totalListener}</h1>
			</div>

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

			<div class="text-center">
				<h2 class="text-xl font-bold">{currentTitle}</h2>
				<p class="text-lg">{currentArtist}</p>
			</div>

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

		<div class="flex w-full items-end">
			<div class="flex w-full flex-col gap-5">
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

					<div class="flex items-center gap-3">
						<a href="https://wa.link/ahx3qj" target="_blank">
							<img src="/icons/whatsapp.svg" alt="" />
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
