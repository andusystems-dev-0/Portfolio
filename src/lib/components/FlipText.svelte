<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import FlipChar from './FlipChar.svelte';

	const roles = [
		'Systems Engineer',
		'Software Engineer',
		'DevOps Engineer',
		'Platform Engineer'
	];

	const maxLen = Math.max(...roles.map((r) => r.length));
	const paddedRoles = roles.map((r) => r.padEnd(maxLen));

	let chars: string[] = Array(maxLen).fill(' ');
	let currentRole = 0;
	let timer: ReturnType<typeof setInterval>;

	// Swipe detection: 3 hovers within 500ms advances to next role
	let swipeCount = 0;
	let swipeTimer: ReturnType<typeof setTimeout>;

	function handleSwipe() {
		swipeCount++;
		clearTimeout(swipeTimer);
		swipeTimer = setTimeout(() => {
			swipeCount = 0;
		}, 500);

		if (swipeCount >= 3) {
			swipeCount = 0;
			clearTimeout(swipeTimer);
			advanceRole();
		}
	}

	function advanceRole() {
		currentRole = (currentRole + 1) % roles.length;
		flipToRole(currentRole);
		resetTimer();
	}

	function resetTimer() {
		clearInterval(timer);
		timer = setInterval(() => {
			currentRole = (currentRole + 1) % roles.length;
			flipToRole(currentRole);
		}, 4000);
	}

	function flipToRole(index: number, staggerMs: number = 30) {
		const target = paddedRoles[index].split('');
		for (let i = 0; i < maxLen; i++) {
			setTimeout(() => {
				chars[i] = target[i];
				chars = chars;
			}, i * staggerMs);
		}
	}

	onMount(() => {
		flipToRole(0, 50);
		resetTimer();
	});

	onDestroy(() => {
		clearInterval(timer);
		clearTimeout(swipeTimer);
	});
</script>

<div class="flip-display">
	{#each chars as char, i (i)}
		<FlipChar {char} onswipe={handleSwipe} />
	{/each}
</div>

<style>
	.flip-display {
		display: inline-flex;
		justify-content: flex-start;
		padding: 4px;
		margin-left: -4px;
		border-radius: 8px;
		border: 1px solid rgba(200, 184, 154, 0.06);
		background: rgba(10, 10, 15, 0.5);
	}
</style>
