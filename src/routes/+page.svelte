<script lang="ts">
	let myModal: HTMLDialogElement;

	let audioElement: HTMLAudioElement;
	let streamURL = 'https://stream.radioalikhwan.com';

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
	}

	function showComment() {
		const element = document.getElementById('comments');
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}

	$effect(() => {
		if (audioElement) {
			audioElement.volume = volume;
		}

		if (mute) {
			volume = 0;
		} else {
			volume = 1;
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
</script>

<audio bind:this={audioElement} src="https://stream.radioalikhwan.com"></audio>

<div class="relative h-svh w-full bg-[url('/backgrounds/bg2.png')] bg-cover bg-center text-white">
	<!-- Header -->
	<div class="absolute left-0 top-0 z-10 h-svh w-full bg-black/40 p-9 pt-5"></div>

	<div class="absolute left-0 top-0 z-20 flex h-full w-full flex-col justify-evenly p-10 pt-5">
		<div class="flex justify-between">
			<a href="https://radioalikhwan.com/">
				<img src="/icons/leave.svg" class="w-5" alt="" />
			</a>
			<div>
				<h1 class="text-end text-xs font-semibold sm:block">Copyright © PT Skytel Indonesia</h1>
			</div>
		</div>

		<div class=" flex h-full w-full flex-col items-center justify-center gap-5">
			<div class="h-64 w-64 rounded-full bg-white/30 p-3">
				<div class=" flex h-full w-full items-center justify-center rounded-full bg-white shadow">
					<img src="/logo/logo-alikhwan-nobg.png" class="w-52" alt="" />
				</div>
			</div>

			<h1 class="text-center text-[1.5rem] font-extrabold sm:text-[2rem] sm:font-bold">
				Radio Al-Ikhwan 101,9 FM Makassar
			</h1>

			<div class="mb-3 flex gap-4">
				<a
					href="https://www.facebook.com/RadioAlikhwanMakassar?locale=id_ID"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img src="/icons/facebook.svg" alt="Facebook" />
				</a>
				<a
					href="https://www.instagram.com/fmraimakassar?igsh=ejJiYTF4bW5pOHVj"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img src="/icons/instagram.svg" alt="Instagram" />
				</a>

				<a href="https://www.tiktok.com/@radioalikhwan" target="_blank" rel="noopener noreferrer">
					<img src="/icons/tiktok.svg" alt="" />
				</a>

				<a
					href="https://www.facebook.com/sharer/sharer.php?u=https://play.radioalikhwan.com/"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img src="/icons/youtube.svg" alt="" />
				</a>
			</div>
		</div>

		<!-- Konten Utama -->
		<div class="flex w-full items-end">
			<div class="flex w-full flex-col gap-5">
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
						class="w-full bg-gray-300"
					/>

					<button onmousedown={increaseVolume}>
						<img src="/icons/volumeup.svg" class="w-10" alt="" />
					</button>
				</div>

				<!-- Kontrol Pemutar -->
				<div class="mb-3 flex w-full items-center justify-center gap-8">
					<button onclick={toggleMute}>
						{#if volume == 0}
							<img src="/icons/unmute.svg" class="w-7" alt="" />
						{:else}
							<img src="/icons/mute.svg" class="w-7" alt="" />
						{/if}
					</button>

					<button onclick={togglePlay}>
						{#if play}
							<img src="/icons/stop.svg" class="w-10" alt="" />
						{:else}
							<img src="/icons/play.svg" class="w-10" alt="" />
						{/if}
					</button>

					<button onclick={showComment}>
						<img src="/icons/comment.svg" class="w-7" alt="" />
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
