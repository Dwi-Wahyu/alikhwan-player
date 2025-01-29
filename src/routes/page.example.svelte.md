<script lang="ts">
	import DeformedCircleVisualizer from '$lib/visualizations/core/DeformedCircleVisualizer.svelte';
	import InnerGlowVisualizer from '$lib/visualizations/core/InnerGlowVisualizer.svelte';
	import MicrophoneVisualizer from '$lib/visualizations/core/MicrophoneVisualizer.svelte';
	import SpeakerVisualizer from '$lib/visualizations/core/SpeakerVisualizer.svelte';
	import Glow from '$lib/visualizations/core/Glow.svelte';
	import AudioFrequency from '$lib/visualizations/audio/AudioFrequency.svelte';
	import { WavRecorder, AudioFilePlayer } from '$lib/visualizations/wavtools';

	import CircleBarAudioVisualizer from '$lib/visualizations/audio/CircleBarAudioVisualizer.svelte';
	import BarAudioVisualizer from '$lib/visualizations/audio/BarAudioVisualizer.svelte';
	import CircleCirclesAudioVisualizer from '$lib/visualizations/audio/CircleCirclesAudioVisualizer.svelte';

	export let wavRecorder: WavRecorder = new WavRecorder({ sampleRate: 24000 });

	export let player = new AudioFilePlayer();

	export let currentlyPlaying: WavRecorder | AudioFilePlayer | null = null;

	let state: 'recording' | 'music' | null = null;

	let analysisType: 'music' | 'voice' = 'voice';

	$: analysisType = state === 'music' ? 'music' : 'voice';

	async function microphone() {
		if (state === 'recording') {
			wavRecorder.end();
			state = null;
			return;
		}
		player.stop();

		await wavRecorder.begin();

		wavRecorder.record();

		currentlyPlaying = wavRecorder;

		state = 'recording';
	}

	async function music() {
		if (state === 'music') {
			player.stop();
			state = null;
			return;
		}
		if (wavRecorder.recording) wavRecorder.end();

		await player.loadFile('/tarot.mp3');

		player.play();
		currentlyPlaying = player;

		state = 'music';
	}
</script>

<div class="mx-auto w-full max-w-4xl px-4 py-8 sm:py-24">
	<div class="flex justify-between">
		<div class="flex flex-col gap-2 sm:flex-row">
			<button
				type="button"
				on:click={microphone}
				class="rounded-full px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 {state ===
				'recording'
					? 'border border-stone-500/20 bg-stone-500/10 text-stone-500 hover:bg-stone-500/20'
					: 'border border-amber-500/20 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'}"
				>{state === 'recording' ? 'stop ' : 'start '}microphone</button
			>
			<button
				type="button"
				on:click={music}
				class="rounded-full px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 {state ===
				'music'
					? 'border border-stone-500/20 bg-stone-500/10 text-stone-500 hover:bg-stone-500/20'
					: 'border border-amber-500/20 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'}"
				>{state === 'music' ? 'stop ' : 'start '}music</button
			>
		</div>
		<div class="text-sm font-semibold text-stone-500">
			made by <a href="https://flo-bit.dev/" class="text-amber-600">flo-bit</a>
		</div>
	</div>

    <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
    	<div class="h-64 w-full rounded-xl border border-white/15 p-4">
    		<CircleBarAudioVisualizer
    			audio={currentlyPlaying}
    			startHue={0}
    			endHue={50}
    			rotate={2}
    			{analysisType}
    		/>
    	</div>
    	<div class="h-64 w-full rounded-xl border border-white/15 p-4">
    		<BarAudioVisualizer
    			audio={currentlyPlaying}
    			barSpacing={8}
    			startHue={0}
    			endHue={50}
    			center
    			{analysisType}
    		/>
    	</div>

    	<div class="h-64 w-full rounded-xl border border-white/15 p-4">
    		<CircleCirclesAudioVisualizer
    			audio={currentlyPlaying}
    			startHue={0}
    			endHue={50}
    			{analysisType}
    		/>
    	</div>

    	<AudioFrequency audio={currentlyPlaying} let:getValues {analysisType}>
    		<div class="h-64 w-full rounded-xl border border-white/15 p-4">
    			<Glow glow={20}>
    				<DeformedCircleVisualizer values={getValues(8)} startHue={0} endHue={50} />
    			</Glow>
    		</div>
    		<div class="h-64 w-full overflow-hidden rounded-xl border border-white/15">
    			<Glow glow={10}>
    				<InnerGlowVisualizer values={getValues(32)} startHue={0} endHue={50} />
    			</Glow>
    		</div>
    		<div
    			class="flex h-64 w-full items-center justify-center gap-4 overflow-hidden rounded-xl border border-white/15"
    		>
    			<div class="size-20">
    				<MicrophoneVisualizer value={getValues(3)[1]} />
    			</div>
    			<div class="size-20">
    				<SpeakerVisualizer value={getValues(3)[1]} />
    			</div>
    		</div>
    	</AudioFrequency>
    </div>

</div>
