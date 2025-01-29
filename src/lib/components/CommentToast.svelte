<script>
	import CloseIcon from '$lib/icons/closeIcon.svelte';
	import toast_ from 'svelte-5-french-toast';

	export let toast;

	const randomEmote = ['😊', '😂', '😍', '😁', '🎶', '😎', '😉'];

	// Pilih emote secara acak
	let randomIndex = Math.floor(Math.random() * randomEmote.length);

	export let nama;
	export let isi;
</script>

<div class="flex gap-4">
	<div class="mr-10 flex items-center gap-3">
		<div>
			<!-- Menggunakan emote acak -->
			<span class="text-xl">{randomEmote[randomIndex]}</span>
		</div>
		<div>
			<h1 class="font-semibold">{nama}</h1>
			<h1>{isi}</h1>
		</div>
	</div>
	<button on:click={() => toast_.dismiss(toast.id)}>
		<CloseIcon />
	</button>
</div>
