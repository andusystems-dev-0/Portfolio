<script lang="ts">
	import { page } from '$app/stores';

	$: path = $page.url.pathname;
	$: isHome = path === '/';
	$: isProjects = path === '/projects' || path.startsWith('/projects/');
	$: isBlog = path === '/blog' || path.startsWith('/blog/');
</script>

<header class="header">
	<a href="/" class="brand">the operator</a>
	<nav class="nav">
		<a href="/" class="link" class:active={isHome}>Home</a>
		<a href="/projects" class="link" class:active={isProjects}>Projects</a>
		<a href="/blog" class="link" class:active={isBlog}>Blog</a>
	</nav>
</header>

<style>
	.header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.75rem;
		background: rgba(10, 10, 15, 0.7);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		border-bottom: 1px solid #1f1f24;
	}

	.brand {
		font-family: 'Space Mono', monospace;
		font-size: 0.85rem;
		color: #f0f0f0;
		text-decoration: none;
		letter-spacing: 0.08em;
		transition: color 0.2s;
	}

	.brand:hover {
		color: #c8b89a;
	}

	.nav {
		display: flex;
		gap: 1.5rem;
	}

	.link {
		font-family: 'Space Mono', monospace;
		font-size: 0.8rem;
		color: #999999;
		text-decoration: none;
		letter-spacing: 0.06em;
		transition: color 0.2s;
	}

	.link:hover {
		color: #c8b89a;
	}

	.link.active {
		color: #ffffff;
	}

	.link.active:hover {
		color: #c8b89a;
	}
</style>
