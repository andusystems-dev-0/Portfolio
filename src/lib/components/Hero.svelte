<script lang="ts">
	import { onMount } from 'svelte';
	import FlipText from './FlipText.svelte';

	let show = [false, false, false, false];

	onMount(() => {
		show.forEach((_, i) => {
			setTimeout(
				() => {
					show[i] = true;
					show = show;
				},
				300 + i * 120
			);
		});
	});
</script>

<div class="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
	<div class="text-center space-y-8 pointer-events-auto px-6">
		<!-- Headline -->
		<h1
			class="font-display text-7xl md:text-9xl tracking-tight text-white transition-all duration-700"
			class:opacity-0={!show[0]}
			class:translate-y-4={!show[0]}
			class:opacity-100={show[0]}
			class:translate-y-0={show[0]}
		>
			ALEX TEST
		</h1>

		<!-- Flip Clock Roles -->
		<div
			class="transition-all duration-700"
			class:opacity-0={!show[1]}
			class:translate-y-4={!show[1]}
			class:opacity-100={show[1]}
			class:translate-y-0={show[1]}
		>
			<FlipText />
		</div>

		<!-- Subheading -->
		<!---<p
			class="font-sans text-lg text-gray-400 max-w-md mx-auto font-light transition-all duration-700"
			class:opacity-0={!show[2]}
			class:translate-y-4={!show[2]}
			class:opacity-100={show[2]}
			class:translate-y-0={show[2]}
		>
			Building infrastructure, shipping code, and managing fleets.
		</p>-->

		<!-- Links -->
		<div
			class="flex flex-col sm:flex-row gap-4 justify-center pt-2 transition-all duration-700"
			class:opacity-0={!show[3]}
			class:translate-y-4={!show[3]}
			class:opacity-100={show[3]}
			class:translate-y-0={show[3]}
		>
			<!---><a
				href="https://github.com/dts-dev-0"
				target="_blank"
				rel="noopener noreferrer"
				class="group flex items-center gap-3 px-6 py-3 border border-copper/30 rounded-lg
					hover:border-copper hover:shadow-[0_0_20px_rgba(200,184,154,0.15)]
					transition-all duration-300 hover:scale-105"
			>
				<svg class="w-5 h-5 text-copper" fill="currentColor" viewBox="0 0 24 24">
					<path
						d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
					/>
				</svg>
				<span class="text-gray-200 group-hover:text-white font-sans text-sm">GitHub</span>
			</a>

			<a
				href="https://andusystems.com"
				target="_blank"
				rel="noopener noreferrer"
				class="group flex items-center gap-3 px-6 py-3 border border-copper/30 rounded-lg
					hover:border-copper hover:shadow-[0_0_20px_rgba(200,184,154,0.15)]
					transition-all duration-300 hover:scale-105"
			>
				<svg
					class="w-5 h-5 text-copper"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
					/>
				</svg>
				<span class="text-gray-200 group-hover:text-white font-sans text-sm">Andusystems</span>
			</a>

			<a
				href="/resume.pdf"
				download
				class="group flex items-center gap-3 px-6 py-3 border border-copper/30 rounded-lg
					hover:border-copper hover:shadow-[0_0_20px_rgba(200,184,154,0.15)]
					transition-all duration-300 hover:scale-105"
			>
				<svg
					class="w-5 h-5 text-copper"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
					/>
				</svg>
				<span class="text-gray-200 group-hover:text-white font-sans text-sm">Resume</span>
			</a>-->
		</div>
	</div>
</div>
