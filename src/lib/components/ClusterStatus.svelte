<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  type Status = 'operational' | 'degraded' | 'unavailable';

  let status: Status = 'unavailable';
  let interval: ReturnType<typeof setInterval>;

  async function checkHealth() {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch('https://status.andusystems.com/healthz', {
        signal: controller.signal
      });
      clearTimeout(timeout);
      status = res.ok ? 'operational' : 'degraded';
    } catch {
      status = 'unavailable';
    }
  }

  onMount(() => {
    checkHealth();
    interval = setInterval(checkHealth, 60000);
  });

  onDestroy(() => clearInterval(interval));
</script>

<div class="cluster-status">
  <span class="dot {status}" />
  <span class="label">
    {#if status === 'operational'}
      infra: operational
    {:else if status === 'degraded'}
      infra: degraded
    {:else}
      infra: unavailable
    {/if}
  </span>
</div>

<style>
  .cluster-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: center;
  }

  .label {
    font-family: 'Space Mono', monospace;
    font-size: 0.7rem;
    color: #555555;
    letter-spacing: 0.08em;
  }

  .dot {
    width: 8px;
    height: 8px;
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
