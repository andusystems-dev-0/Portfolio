<script lang="ts">
  import { onMount } from 'svelte';

  const USERNAME = 'andusystems-dev-0';
  const DAYS = 14;
  const CELL = 8;
  const GAP = 2;
  const ROW_GAP = 3;
  const WEEK_GAP = 5;
  const LABELS_W = 0;
  const LABELS_GAP = 0;
  const BLOCKS = 4;
  const BLOCK_H = 6;
  const COLORS = ['#161616', '#0e4429', '#006d32', '#26a641', '#39d353'];

  type Cell = { count: number; col: number; row: number; tip: string };

  let cells: Cell[] = [];
  let numWeeks = 0;
  let loaded = false;
  let failed = false;

  function dateKey(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function level(count: number, mx: number): number {
    if (count <= 0) return 0;
    const q = count / mx;
    if (q <= 0.25) return 1;
    if (q <= 0.5) return 2;
    if (q <= 0.75) return 3;
    return 4;
  }

  function blockRange(b: number): string {
    const s = b * BLOCK_H;
    const e = s + BLOCK_H;
    return `${String(s).padStart(2, '0')}:00\u2013${String(e % 24).padStart(2, '0')}:00`;
  }

  onMount(async () => {
    try {
      const counts = new Map<string, number>();
      const cutoff = Date.now() - DAYS * 86400000;

      for (let page = 1; page <= 5; page++) {
        const res = await fetch(
          `https://api.github.com/users/${USERNAME}/events/public?per_page=100&page=${page}`
        );
        if (!res.ok) throw new Error();
        const events: any[] = await res.json();
        if (!events.length) break;

        let allOld = true;
        for (const ev of events) {
          if (ev.type !== 'PushEvent') continue;
          const d = new Date(ev.created_at);
          if (d.getTime() < cutoff) continue;
          allOld = false;
          const key = `${dateKey(d)}-${Math.floor(d.getHours() / BLOCK_H)}`;
          counts.set(key, (counts.get(key) || 0) + (ev.payload?.size || 1));
        }
        if (allOld) break;
      }

      const now = new Date();
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);
      const nowHour = now.getHours();
      const todayStr = dateKey(today);

      const rangeStart = new Date(today);
      rangeStart.setDate(rangeStart.getDate() - (DAYS - 1));

      const gridStart = new Date(rangeStart);
      gridStart.setDate(gridStart.getDate() - ((gridStart.getDay() + 6) % 7));

      const grid: Cell[] = [];
      const cursor = new Date(gridStart);

      while (cursor <= today) {
        const diff = Math.round((cursor.getTime() - gridStart.getTime()) / 86400000);
        const week = Math.floor(diff / 7);
        const row = diff % 7;
        const inRange = cursor >= rangeStart;
        const curKey = dateKey(cursor);
        const isToday = curKey === todayStr;
        const label = cursor.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        for (let b = 0; b < BLOCKS; b++) {
          const futureBlock = isToday && b * BLOCK_H > nowHour;
          const key = `${curKey}-${b}`;
          const n = (inRange && !futureBlock) ? (counts.get(key) || 0) : -1;

          grid.push({
            count: n,
            col: week * BLOCKS + b,
            row,
            tip: n >= 0
              ? `${label} ${blockRange(b)}: ${n > 0 ? n + ' commit' + (n === 1 ? '' : 's') : 'no commits'}`
              : '',
          });
        }

        cursor.setDate(cursor.getDate() + 1);
      }

      numWeeks = Math.floor(Math.round((today.getTime() - gridStart.getTime()) / 86400000) / 7) + 1;
      cells = grid;
      loaded = true;
    } catch {
      failed = true;
    }
  });

  function cellX(col: number): number {
    const week = Math.floor(col / BLOCKS);
    const block = col % BLOCKS;
    const weekBlockW = BLOCKS * (CELL + GAP) - GAP;
    return LABELS_W + LABELS_GAP + week * (weekBlockW + WEEK_GAP) + block * (CELL + GAP);
  }

  $: weekBlockW = BLOCKS * (CELL + GAP) - GAP;
  $: gridW = numWeeks * (weekBlockW + WEEK_GAP) - WEEK_GAP;
  $: svgW = LABELS_W + LABELS_GAP + gridW;
  $: svgH = 7 * (CELL + ROW_GAP) - ROW_GAP;
  $: max = cells.reduce((m, c) => c.count > m ? c.count : m, 0) || 1;

</script>

{#if loaded}
  <div class="feed-wrapper">
    <svg width={svgW} height={svgH} class="heatmap">
      {#each cells as cell}
        {#if cell.count >= 0}
          <rect
            x={cellX(cell.col)}
            y={cell.row * (CELL + ROW_GAP)}
            width={CELL}
            height={CELL}
            rx="2"
            fill={COLORS[level(cell.count, max)]}
          >
            <title>{cell.tip}</title>
          </rect>
        {/if}
      {/each}
    </svg>
    <span class="feed-label">push activity · 14d</span>
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
    gap: 0.35rem;
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
    font-size: 0.55rem;
    color: #6a6a6a;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .muted {
    color: #333333;
  }
</style>
