<script lang="ts">
  import {
    siKubernetes,
    siDocker,
    siTerraform,
    siAnsible,
    siGo,
    siSvelte,
    siArgo,
    siHelm,
    siProxmox,
    siTypescript,
    siAngular,
    siDotnet,
    siApacheairflow,
    siApachekafka,
    siSqlite,
  } from 'simple-icons';

  const icons = [
    { icon: siKubernetes, label: 'Kubernetes' },
    { icon: siArgo, label: 'ArgoCD' },
    { icon: siHelm, label: 'Helm' },
    { icon: siDocker, label: 'Docker' },
    { icon: siTerraform, label: 'Terraform' },
    { icon: siAnsible, label: 'Ansible' },
    { icon: siProxmox, label: 'Proxmox' },
    { icon: siApachekafka, label: 'Kafka' },
    { icon: siApacheairflow, label: 'Airflow' },
    { icon: siDotnet, label: '.NET' },
    { icon: siAngular, label: 'Angular' },
    { icon: siSvelte, label: 'Svelte' },
    { icon: siTypescript, label: 'TypeScript' },
    { icon: siGo, label: 'Go' },
    { icon: siSqlite, label: 'SQL' },
  ];
</script>

<footer class="tech-footer">
  <div class="divider" />
  <div class="ticker-mask">
    <div class="ticker-track">
      {#each [0, 1, 2, 3] as _copy}
        {#each icons as { icon, label }}
          <div class="icon-cell">
            <svg
              role="img"
              viewBox="0 0 24 24"
              width="26"
              height="26"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              aria-label={label}
            >
              <path d={icon.path} />
            </svg>
            <span class="icon-label">{label}</span>
          </div>
        {/each}
      {/each}
    </div>
  </div>
</footer>

<style>
  .tech-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 0.75rem;
    padding-top: 0;
    gap: 1.25rem;
    background: radial-gradient(ellipse at 50% 100%, #12121a 0%, #0a0a0f 70%);
  }

  .divider {
    width: 100%;
    height: 1px;
    background-color: #1a1a1a;
  }

  .ticker-mask {
    width: 100%;
    overflow-x: hidden;
    overflow-y: visible;
    -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  }

  .ticker-track {
    display: flex;
    align-items: center;
    width: max-content;
    padding-top: 0.5rem;
    animation: scroll 25s linear infinite;
  }

  .ticker-track:hover {
    animation-play-state: paused;
  }

  .icon-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    width: 6rem;
    flex-shrink: 0;
    color: #555555;
    transition: color 0.2s, transform 0.2s;
    cursor: default;
  }

  .icon-cell:hover {
    color: #f0f0f0;
    transform: scale(1.15);
    z-index: 1;
  }

  .icon-label {
    font-family: 'Space Mono', monospace;
    font-size: 0.75rem;
    color: #999999;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }

  @keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-25%); }
  }
</style>
