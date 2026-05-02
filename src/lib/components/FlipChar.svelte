<script lang="ts">
	export let char: string = ' ';
	export let onswipe: (() => void) | undefined = undefined;

	import { onMount } from 'svelte';

	let displayed = ' ';
	let prev = ' ';
	let next = ' ';
	let phase: 0 | 1 | 2 = 0;
	let ready = false;

	onMount(() => {
		ready = true;
		if (char !== displayed) {
			doFlip(displayed, char);
		}
	});

	$: if (ready && char !== displayed && phase === 0) {
		doFlip(displayed, char);
	}

	function doFlip(from: string, to: string) {
		prev = from;
		next = to;
		phase = 1;
		setTimeout(() => {
			phase = 2;
		}, 200);
		setTimeout(() => {
			displayed = to;
			phase = 0;
		}, 400);
	}

	function handleMouseEnter() {
		if (phase !== 0 || displayed === ' ') return;
		onswipe?.();
		prev = displayed;
		next = displayed;
		phase = 1;
		setTimeout(() => {
			phase = 2;
		}, 200);
		setTimeout(() => {
			phase = 0;
		}, 400);
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="card" on:mouseenter={handleMouseEnter}>
	<div class="half top">
		<span class="ch">{phase !== 0 ? next : displayed}</span>
	</div>

	<div class="half bottom">
		<span class="ch">{displayed}</span>
	</div>

	{#if phase === 1}
		<div class="flap top-flap">
			<span class="ch">{prev}</span>
		</div>
	{/if}

	{#if phase === 2}
		<div class="flap bottom-flap">
			<span class="ch">{next}</span>
		</div>
	{/if}

	<div class="split"></div>
</div>

<style>
	.card {
		position: relative;
		width: 1.5ch;
		height: 2.8rem;
		margin: 0 1px;
		perspective: 300px;
		cursor: default;
		overflow: hidden;
	}

	@media (min-width: 768px) {
		.card {
			width: 1.6ch;
			height: 3.6rem;
		}
	}

	.half {
		position: absolute;
		left: 0;
		right: 0;
		height: 50%;
		overflow: hidden;
		background: #141418;
	}

	.half.top {
		top: 0;
		border-radius: 3px 3px 0 0;
	}

	.half.bottom {
		bottom: 0;
		border-radius: 0 0 3px 3px;
	}

	.half.top::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 50%;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.1));
		pointer-events: none;
	}

	.half.bottom::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 50%;
		background: linear-gradient(rgba(0, 0, 0, 0.1), transparent);
		pointer-events: none;
	}

	.ch {
		position: absolute;
		left: 0;
		right: 0;
		height: 2.8rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Space Mono', monospace;
		font-size: 0.95rem;
		font-weight: 500;
		color: #f0f0f0;
		text-transform: uppercase;
		white-space: pre;
	}

	@media (min-width: 768px) {
		.ch {
			height: 3.6rem;
			font-size: 1.35rem;
		}
	}

	.half.top .ch {
		top: 0;
	}
	.half.bottom .ch {
		bottom: 0;
	}

	.flap {
		position: absolute;
		left: 0;
		right: 0;
		height: 50%;
		overflow: hidden;
		background: #141418;
		backface-visibility: hidden;
		z-index: 2;
	}

	.top-flap {
		top: 0;
		border-radius: 3px 3px 0 0;
		transform-origin: bottom center;
		animation: flipDown 0.2s ease-in forwards;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.top-flap .ch {
		top: 0;
	}

	.bottom-flap {
		top: 50%;
		border-radius: 0 0 3px 3px;
		transform-origin: top center;
		animation: flipUp 0.2s ease-out forwards;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
	}

	.bottom-flap .ch {
		bottom: 0;
	}

	.split {
		position: absolute;
		left: 0;
		right: 0;
		top: 50%;
		height: 1px;
		background: rgba(0, 0, 0, 0.5);
		transform: translateY(-0.5px);
		z-index: 5;
		pointer-events: none;
	}

	@keyframes flipDown {
		0% {
			transform: rotateX(0deg);
		}
		100% {
			transform: rotateX(-90deg);
		}
	}

	@keyframes flipUp {
		0% {
			transform: rotateX(90deg);
		}
		100% {
			transform: rotateX(0deg);
		}
	}
</style>
