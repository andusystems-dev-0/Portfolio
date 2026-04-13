<script lang="ts">
	import { onMount } from 'svelte';
  import { FileText, Mail } from 'lucide-svelte';
  import { siGithub } from 'simple-icons';
	import FlipText from './FlipText.svelte';
  import ClusterStatus from './ClusterStatus.svelte';
  import GitFeed from './GitFeed.svelte';

	let show = [false, false, false, false];

	onMount(() => {
		show.forEach((_, i) => {
			setTimeout(
				() => {
					show[i] = true;
					show = show;
				},
				300 + i * 150
			);
		});
	});
</script>

<main class="page">
  <div class="content">
    <!-- Row 1: Name | FlipText -->
    <div class="cell identity fade" class:visible={show[0]}>
      <h1 class="name">ALEX</h1>
      <p class="location">Johnson City, TN</p>
    </div>
    <div class="cell fade" class:visible={show[0]}>
      <FlipText />
    </div>

    <!-- Row 2: Git Heatmap | Cluster Status -->
    <div class="cell fade" class:visible={show[1]}>
      <GitFeed />
    </div>
    <div class="cell fade" class:visible={show[1]}>
      <ClusterStatus />
    </div>

    <!-- Row 3: CTAs — right-align in col1, left-align in col2 to center on gap -->
    <div class="cell fade" class:visible={show[2]}>
      <div class="cta-row">
        <a href="https://github.com/andusystems-dev-0" target="_blank" rel="noopener" class="cta-btn">
          <svg
            role="img"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d={siGithub.path} />
          </svg>
          <span>Github</span>
        </a>

        <a href="/AlexResume e.pdf" target="_blank" class="cta-btn">
          <FileText size={18} />
          <span>Resume</span>
        </a>
      </div>
    </div>
    <div class="cell fade" class:visible={show[2]}>
      <a href="mailto:alex@andusystems.com" class="cta-email">
        <Mail size={18} />
        <span>alex@andusystems.com</span>
      </a>
    </div>
  </div>
</main>

<style>
  .page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem 2rem 5.5rem;
  }

  .content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem 4rem;
    align-items: center;
    width: 100%;
    max-width: 900px;
    transform: translateX(2rem);
  }

  /* ── Entrance ── */
  .fade {
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .fade.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── Grid cells ── */
  .cell {
    display: flex;
    align-items: center;
  }

  .cell.identity {
    flex-direction: column;
    align-items: flex-start;
  }

  /* ── Name ── */
  .name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 80px;
    color: #f0f0f0;
    line-height: 1;
  }

  .location {
    font-family: 'Space Mono', monospace;
    font-size: 0.85rem;
    color: #999999;
    letter-spacing: 0.05em;
    margin-top: 0rem;
  }

  /* ── CTAs ── */
  .cta-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;
  }

  .cta-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Space Mono', monospace;
    font-size: 0.85rem;
    color: #f0f0f0;
    text-decoration: none;
    letter-spacing: 0.06em;
    border: 1px solid #3a3a3a;
    padding: 0.5rem 0.9rem;
    transition: border-color 0.2s, color 0.2s;
  }

  .cta-btn:hover {
    border-color: #f0f0f0;
    color: #ffffff;
  }

  .cta-email {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Space Mono', monospace;
    font-size: 0.85rem;
    color: #999999;
    text-decoration: none;
    letter-spacing: 0.05em;
    transition: color 0.2s;
  }

  .cta-email:hover {
    color: #f0f0f0;
  }

  /* ── Mobile ── */
  @media (max-width: 640px) {
    .content {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }
</style>
