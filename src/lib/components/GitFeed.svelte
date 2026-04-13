<script lang="ts">
  import { onMount } from 'svelte';

  const DAYS = 30;
  const CELL = 12;
  const ROW_GAP = 4;
  const COL_GAP = 6;
  const ROWS = 5;
  const COLORS = ['#161616', '#0e4429', '#006d32', '#26a641', '#39d353'];

  let days: { date: string; level: number; col: number; row: number }[] = [];
  let loaded = false;
  let failed = false;

  onMount(async () => {
    try {
      const res = await fetch('/api/contributions');
      if (!res.ok) throw new Error();
      const levels: Record<string, number> = await res.json();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      days = Array.from({ length: DAYS }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - (DAYS - 1 - i));
        const key = d.toISOString().slice(0, 10);
        return {
          date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          level: levels[key] ?? 0,
          col: Math.floor(i / ROWS),
          row: i % ROWS,
        };
      });

      loaded = true;
    } catch {
      failed = true;
    }
  });

  $: cols = Math.ceil(DAYS / ROWS);
  $: svgW = cols * (CELL + COL_GAP) - COL_GAP;
  $: svgH = ROWS * (CELL + ROW_GAP) - ROW_GAP;
</script>

{#if loaded}
  <div class="feed-wrapper">
    <svg width={svgW} height={svgH} class="heatmap">
      {#each days as day}
        <rect
          x={day.col * (CELL + COL_GAP)}
          y={day.row * (CELL + ROW_GAP)}
          width={CELL}
          height={CELL}
          rx="2"
          fill={COLORS[day.level]}
        >
          <title>{day.date}</title>
        </rect>
      {/each}
    </svg>
    <span class="feed-label">Github Activity</span>
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
    align-items: flex-start;
    gap: 0.5rem;
  }

  .heatmap rect {
    transition: opacity 0.15s;
  }

  .heatmap rect:hover {
    opacity: 0.8;
    stroke: #555555;
    stroke-width: 1;
  }

  .feed-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem;
    color: #999999;
    letter-spacing: 0.08em;
  }

  .muted {
    color: #555555;
  }
</style>
