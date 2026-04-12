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
  <div class="icon-strip">
    {#each icons as { icon, label }}
      <div class="icon-wrap" title={label}>
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
      </div>
    {/each}
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
    padding-bottom: 1.25rem;
    padding-top: 0.75rem;
    gap: 0.75rem;
    background: radial-gradient(ellipse at 50% 100%, #12121a 0%, #0a0a0f 70%);
  }

  .divider {
    width: 100%;
    height: 1px;
    background-color: #1a1a1a;
  }

  .icon-strip {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 1.25rem;
    padding: 0 1.5rem;
  }

  .icon-wrap {
    color: #333333;
    transition: color 0.2s, transform 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default;
  }

  .icon-wrap:hover {
    color: #f0f0f0;
    transform: scale(1.15);
  }
</style>
