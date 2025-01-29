<script>
	import { onMount } from 'svelte';

	import toast, { Toaster } from 'svelte-5-french-toast';
	import CommentToast from '$lib/components/CommentToast.svelte';

	let commentToast = $state(-1);

	let { allComment } = $props();

	function setToastInterval() {
		setInterval(() => {
			commentToast += 1;
			if (commentToast >= allComment.length) {
				commentToast = 0;
			}

			const { nama, isi } = allComment[commentToast];
			toast(CommentToast, {
				props: { nama, isi },
				position: 'top-right'
			});
		}, 4000);
	}

	onMount(() => {
		setToastInterval();
	});
</script>
