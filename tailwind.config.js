import { skeleton } from '@skeletonlabs/tw-plugin';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/@skeletonlabs/skeleton/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {
			colors: {
				copper: {
					DEFAULT: '#c8b89a',
					light: '#d4c9b0',
					dark: '#a89878'
				}
			},
			fontFamily: {
				display: ['"Bebas Neue"', 'sans-serif'],
				mono: ['"DM Mono"', 'monospace'],
				sans: ['"DM Sans"', 'sans-serif']
			}
		}
	},
	plugins: [
		skeleton({
			themes: { preset: ['skeleton'] }
		})
	]
};
