import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		vitePreprocess(),
		mdsvex({ extensions: ['.md'] })
	],
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: true
		}),
		prerender: {
			entries: ['*', '/api/contributions'],
			handleHttpError: 'warn'
		},
		// CSP via build-time hashes. SvelteKit emits a <meta http-equiv> tag
		// at the top of <head> containing these directives plus a sha256
		// hash for every inline <script> and <style> block it generates,
		// which is what allows the framework's hydration script to run
		// without 'unsafe-inline'. The nginx config drops default-src and
		// script-src from the response header so this meta CSP is the
		// authoritative source for those directives — see nginx.conf.
		csp: {
			mode: 'hash',
			directives: {
				'default-src': ['self'],
				'script-src': ['self'],
				'style-src': ['self', 'unsafe-inline', 'https://fonts.googleapis.com'],
				'font-src': ['self', 'https://fonts.gstatic.com'],
				'img-src': ['self', 'data:'],
				'connect-src': ['self'],
				// Explicit deny for plugin embeds (<object>, <embed>, <applet>).
				// default-src 'self' would technically cover this, but linters
				// (Google CSP Evaluator, observatory.mozilla.org) flag the
				// implicit form. Setting it here is the unambiguous industry
				// pattern.
				'object-src': ['none']
			}
		}
	}
};

export default config;
