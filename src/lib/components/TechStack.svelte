<script lang="ts">
  import {
    siKubernetes,
    siDocker,
    siTerraform,
    siAnsible,
    siGo,
    siSvelte,
    //siArgocd,
    siLinux,
    siProxmox,
    siNginx,
    siGit,
  } from 'simple-icons';

  const icons = [
    { icon: siKubernetes, label: 'Kubernetes' },
    { icon: siDocker, label: 'Docker' },
    { icon: siTerraform, label: 'Terraform' },
    { icon: siAnsible, label: 'Ansible' },
    { icon: siGo, label: 'Go' },
    { icon: siSvelte, label: 'Svelte' },
    //{ icon: siArgocd, label: 'ArgoCD' },
    { icon: siLinux, label: 'Linux' },
    { icon: siProxmox, label: 'Proxmox' },
    { icon: siNginx, label: 'Nginx' },
    { icon: siGit, label: 'Git' },
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
              width="20"
              height="20"
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
    padding-bottom: 1rem;
    padding-top: 0.75rem;
    gap: 0.75rem;
    background: radial-gradient(ellipse at 50% 100%, #12121a 0%, #0a0a0f 70%);
  }

  .divider {
    width: 100%;
    height: 1px;
    background-color: #1a1a1a;
  }

  .ticker-mask {
    width: 100%;
    overflow: hidden;
    -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  }

  .ticker-track {
    display: flex;
    align-items: center;
    width: max-content;
    animation: scroll 25s linear infinite;
  }

  .ticker-track:hover {
    animation-play-state: paused;
  }

  .icon-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    width: 5rem;
    flex-shrink: 0;
    color: #333333;
    transition: color 0.2s, transform 0.2s;
    cursor: default;
  }

  .icon-cell:hover {
    color: #f0f0f0;
    transform: scale(1.15);
  }

  .icon-label {
    font-family: 'Space Mono', monospace;
    font-size: 0.6rem;
    color: #6a6a6a;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }

  @keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-25%); }
  }
</style>
