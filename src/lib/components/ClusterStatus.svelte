<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  type Status = 'operational' | 'degraded' | 'unavailable';

  const clusters = [
    { label: 'mgmt', path: '/api/status/management' },
    { label: 'net', path: '/api/status/networking' },
    { label: 'stor', path: '/api/status/storage' },
    { label: 'mon', path: '/api/status/monitoring' },
    { label: 'port', path: '/api/status/portfolio' },
  ];

  let statuses: Status[] = clusters.map(() => 'unavailable');
  let interval: ReturnType<typeof setInterval>;

  async function checkHealth(index: number) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(clusters[index].path, {
        signal: controller.signal
      });
      clearTimeout(timeout);
      statuses[index] = res.ok ? 'operational' : 'degraded';
    } catch {
      statuses[index] = 'unavailable';
    }
    statuses = statuses;
  }

  function checkAll() {
    clusters.forEach((_, i) => checkHealth(i));
  }

  onMount(() => {
    checkAll();
    interval = setInterval(checkAll, 60000);
  });

  onDestroy(() => clearInterval(interval));
</script>

<div class="cluster-status-wrapper">
  <div class="cluster-status">
    {#each clusters as cluster, i}
      <div class="cluster">
        <span class="dot {statuses[i]}" />
        <span class="label">{cluster.label}</span>
      </div>
    {/each}
  </div>
  <span class="status-label">cluster status</span>
</div>

<style>
  .cluster-status-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;
  }

  .status-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.55rem;
    color: #6a6a6a;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .cluster-status {
    display: grid;
    grid-template-columns: repeat(2, auto);
    gap: 0.35rem 0.35rem;
  }

  .cluster {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .label {
    font-family: 'Space Mono', monospace;
    font-size: 0.65rem;
    color: #555555;
    letter-spacing: 0.08em;
  }

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
  }

  .dot.operational {
    background-color: #4ade80;
    box-shadow: 0 0 6px #4ade80;
    animation: pulse 2s ease-in-out infinite;
  }

  .dot.degraded {
    background-color: #facc15;
    box-shadow: 0 0 6px #facc15;
  }

  .dot.unavailable {
    background-color: #555555;
  }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 4px #4ade80; }
    50% { box-shadow: 0 0 12px #4ade80; }
  }
</style>
