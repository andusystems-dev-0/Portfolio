<script lang="ts">
	import type { PostSummary } from '$lib/posts';

	export let data: { posts: PostSummary[] };

	const dateFmt = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		timeZone: 'UTC'
	});
</script>

<svelte:head>
	<title>Blog — the operator</title>
	<meta name="description" content="Posts on infrastructure, projects, and engineering notes." />
</svelte:head>

<main class="page">
	<div class="content">
		<h1 class="title">BLOG</h1>

		{#if data.posts.length === 0}
			<p class="empty">No posts yet.</p>
		{:else}
			<ul class="list">
				{#each data.posts as post (post.slug)}
					<li class="item">
						<a href="/blog/{post.slug}" class="row">
							<time class="date" datetime={post.date}>
								{dateFmt.format(new Date(post.date))}
							</time>
							<span class="post-title">{post.title}</span>
						</a>
						{#if post.description}
							<p class="desc">{post.description}</p>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
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
		max-width: 720px;
	}

	.title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 64px;
		color: #f0f0f0;
		line-height: 1;
		margin: 0 0 2.5rem;
	}

	.empty {
		font-family: 'Space Mono', monospace;
		font-size: 0.9rem;
		color: #777777;
	}

	.list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
	}

	.item {
		border-top: 1px solid #1f1f24;
		padding-top: 1.25rem;
	}

	.row {
		display: flex;
		align-items: baseline;
		gap: 1.25rem;
		text-decoration: none;
		color: #f0f0f0;
		transition: color 0.2s;
	}

	.row:hover {
		color: #c8b89a;
	}

	.date {
		font-family: 'Space Mono', monospace;
		font-size: 0.75rem;
		color: #777777;
		letter-spacing: 0.05em;
		flex-shrink: 0;
		min-width: 6.5rem;
	}

	.post-title {
		font-family: 'DM Sans', sans-serif;
		font-size: 1.15rem;
		font-weight: 700;
	}

	.desc {
		font-family: 'DM Sans', sans-serif;
		font-size: 0.9rem;
		color: #999999;
		margin: 0.5rem 0 0 7.75rem;
		line-height: 1.5;
	}

	@media (max-width: 640px) {
		.title {
			font-size: 48px;
		}
		.row {
			flex-direction: column;
			gap: 0.25rem;
		}
		.desc {
			margin-left: 0;
		}
	}
</style>
