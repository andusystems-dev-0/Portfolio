<script lang="ts">
	import type { Project } from '$lib/projects';

	export let data: { projects: Project[] };
</script>

<svelte:head>
	<title>Projects — Alex</title>
	<meta name="description" content="Projects built and shipped by Alex — founder of Hireship." />
</svelte:head>

<main class="page">
	<div class="content">
		<h1 class="title">PROJECTS</h1>

		{#if data.projects.length === 0}
			<p class="empty">No projects yet.</p>
		{:else}
			<ul class="list">
				{#each data.projects as project (project.url)}
					<li class="item">
						{#if project.screenshot}
							<img
								class="shot"
								src={project.screenshot}
								alt={`${project.name} screenshot`}
								loading="lazy"
							/>
						{:else}
							<!-- Graceful placeholder — set `screenshot` in src/lib/projects.ts
							     once a real asset lives at static/projects/<name>.png -->
							<div class="shot shot--empty" aria-hidden="true">
								<span>Screenshot coming soon</span>
							</div>
						{/if}

						<div class="body">
							<a href={project.url} target="_blank" rel="noopener" class="project-title">
								{project.name}
							</a>
							<p class="desc">{project.description}</p>
							<a href={project.url} target="_blank" rel="noopener" class="visit">
								{project.url.replace(/^https?:\/\//, '')} &rarr;
							</a>
						</div>
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
		gap: 2.5rem;
	}

	.item {
		display: flex;
		gap: 1.5rem;
		border-top: 1px solid #1f1f24;
		padding-top: 1.75rem;
	}

	.shot {
		flex-shrink: 0;
		width: 240px;
		aspect-ratio: 16 / 10;
		object-fit: cover;
		border-radius: 6px;
		border: 1px solid #1f1f24;
	}

	.shot--empty {
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(10, 10, 15, 0.5);
		border-style: dashed;
		border-color: #2a2a30;
	}

	.shot--empty span {
		font-family: 'Space Mono', monospace;
		font-size: 0.75rem;
		color: #555555;
		letter-spacing: 0.05em;
	}

	.body {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.project-title {
		font-family: 'DM Sans', sans-serif;
		font-size: 1.35rem;
		font-weight: 700;
		color: #f0f0f0;
		text-decoration: none;
		transition: color 0.2s;
	}

	.project-title:hover {
		color: #c8b89a;
	}

	.desc {
		font-family: 'DM Sans', sans-serif;
		font-size: 0.95rem;
		color: #999999;
		line-height: 1.55;
		margin: 0.5rem 0 0;
	}

	.visit {
		font-family: 'Space Mono', monospace;
		font-size: 0.75rem;
		color: #777777;
		letter-spacing: 0.05em;
		text-decoration: none;
		margin-top: 0.85rem;
		transition: color 0.2s;
	}

	.visit:hover {
		color: #c8b89a;
	}

	@media (max-width: 640px) {
		.title {
			font-size: 48px;
		}
		.item {
			flex-direction: column;
		}
		.shot {
			width: 100%;
		}
	}
</style>
