<script lang="ts">
  import { onMount } from 'svelte';

  const GITHUB_USERNAME = 'andusystems-dev-0';
  const DAYS = 30;

  let buckets: number[] = Array(DAYS).fill(0);
  let loaded = false;
  let failed = false;

  onMount(async () => {
    try {
      const res = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/events/public`
      );
      if (!res.ok) throw new Error();
      const events = await res.json();

      const now = Date.now();
      const dayMs = 86400000;

      for (const event of events) {
        if (event.type !== 'PushEvent') continue;
        const age = Math.floor((now - new Date(event.created_at).getTime()) / dayMs);
        if (age < DAYS) buckets[DAYS - 1 - age]++;
      }

      loaded = true;
    } catch {
      failed = true;
    }
  });

  const WIDTH = 120;
  const HEIGHT = 24;
  const GAP = 1;
  const barWidth = (WIDTH - GAP * (DAYS - 1)) / DAYS;
  const max = Math.max(...buckets, 1);

  $: bars = buckets.map((val, i) => ({
    x: i * (barWidth + GAP),
    height: Math.max(2, (val / max) * HEIGHT),
    y: HEIGHT - Math.max(2, (val / max) * HEIGHT)
  }));
</script>

{#if loaded}
  <div class="feed-wrapper">
    <svg width={WIDTH} height={HEIGHT} class="feed">
      {#each bars as bar}
        <rect
          x={bar.x}
          y={bar.y}
          width={barWidth}
          height={bar.height}
          rx="1"
        />
      {/each}
    </svg>
    <span class="feed-label">push activity · 30d</span>
  </div>
{:else if failed}
  <div class="feed-wrapper">
    <span class="feed-label muted">activity unavailable</span>
  </div>
{/if}

<style>
  .feed-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
  }

  .feed rect {
    fill: #f0f0f0;
    opacity: 0.4;
    transition: opacity 0.2s;
  }

  .feed rect:hover {
    opacity: 1;
  }

  .feed-label {
    font-family: 'Space Mono', monospace;
    font-size: 0.6rem;
    color: #555555;
    letter-spacing: 0.08em;
  }

  .muted {
    color: #333333;
  }
</style>
