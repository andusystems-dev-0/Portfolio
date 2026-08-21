<script lang="ts">
	import type { PostMetadata } from '$lib/posts';
	import type { SvelteComponent } from 'svelte';

	export let data: {
		slug: string;
		content: typeof SvelteComponent;
		metadata: PostMetadata;
	};

	const dateFmt = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		timeZone: 'UTC'
	});
</script>

<svelte:head>
	<title>{data.metadata.title} — the operator</title>
	{#if data.metadata.description}
		<meta name="description" content={data.metadata.description} />
	{/if}
</svelte:head>

<main class="page">
	<article class="content">
		<header class="head">
			<time class="date" datetime={data.metadata.date}>
				{dateFmt.format(new Date(data.metadata.date))}
			</time>
			<h1 class="title">{data.metadata.title}</h1>
		</header>

		<div class="prose">
			<svelte:component this={data.content} />
		</div>
	</article>
</main>

<style>
	.page {
		display: flex;
		justify-content: center;
		min-height: 100vh;
		padding: 7rem 2rem 5.5rem;
	}

	.content {
		width: 100%;
		max-width: 680px;
	}

	.head {
		margin: 0 0 2.5rem;
	}

	.date {
		display: block;
		font-family: 'Space Mono', monospace;
		font-size: 0.8rem;
		color: #777777;
		letter-spacing: 0.05em;
		margin-bottom: 0.75rem;
	}

	.title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 56px;
		color: #f0f0f0;
		line-height: 1.05;
		margin: 0;
	}

	.prose {
		font-family: 'DM Sans', sans-serif;
		color: #d0d0d0;
		font-size: 1rem;
		line-height: 1.7;
	}

	.prose :global(h2) {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 32px;
		color: #f0f0f0;
		margin: 2.5rem 0 1rem;
		letter-spacing: 0.02em;
	}

	.prose :global(h3) {
		font-family: 'DM Sans', sans-serif;
		font-size: 1.15rem;
		font-weight: 700;
		color: #f0f0f0;
		margin: 2rem 0 0.75rem;
	}

	.prose :global(p) {
		margin: 0 0 1.25rem;
	}

	.prose :global(a) {
		color: #c8b89a;
		text-decoration: underline;
		text-decoration-color: #3a3a3a;
		text-underline-offset: 3px;
		transition: text-decoration-color 0.2s;
	}

	.prose :global(a:hover) {
		text-decoration-color: #c8b89a;
	}

	.prose :global(ul),
	.prose :global(ol) {
		margin: 0 0 1.25rem;
		padding-left: 1.5rem;
	}

	.prose :global(li) {
		margin-bottom: 0.4rem;
	}

	.prose :global(code) {
		font-family: 'Space Mono', monospace;
		font-size: 0.9em;
		background: #15151b;
		border: 1px solid #1f1f24;
		border-radius: 3px;
		padding: 0.1em 0.35em;
		color: #c8b89a;
	}

	.prose :global(pre) {
		background: #0f0f14;
		border: 1px solid #1f1f24;
		border-radius: 6px;
		padding: 1rem 1.1rem;
		overflow-x: auto;
		margin: 0 0 1.5rem;
	}

	.prose :global(pre code) {
		background: transparent;
		border: none;
		padding: 0;
		color: #d0d0d0;
		font-size: 0.85rem;
		line-height: 1.6;
	}

	.prose :global(blockquote) {
		margin: 0 0 1.5rem;
		padding: 0.25rem 0 0.25rem 1.1rem;
		border-left: 2px solid #c8b89a;
		color: #999999;
		font-style: italic;
	}

	.prose :global(hr) {
		border: none;
		border-top: 1px solid #1f1f24;
		margin: 2.5rem 0;
	}

	.prose :global(img) {
		max-width: 100%;
		border-radius: 6px;
		margin: 1.5rem 0;
	}

	@media (max-width: 640px) {
		.title {
			font-size: 40px;
		}
	}
</style>
