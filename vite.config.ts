import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],

	preview: {
		port: 2521
	},

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
