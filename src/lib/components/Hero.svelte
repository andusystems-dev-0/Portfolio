<!-- Imports -->
<script lang="ts">
	import { onMount } from 'svelte';
  import { Globe, FileText, Mail } from 'lucide-svelte';
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
				300 + i * 120
			);
		});
	});
</script>

<div class="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
	<div class="text-center space-y-8 pointer-events-auto px-6">
		<!-- Name -->
		<h1 class="name">
		  ALEX
		</h1>
    
    <!-- Location -->
    <p
      class="location transition-all duration-700"
      class:opacity-0={!show[0]}
      class:opacity-100={show[0]}
    >
      Johnson City, TN
    </p>

		<!-- Flip Text -->
		<div
			class="transition-all duration-700"
			class:opacity-0={!show[1]}
			class:translate-y-4={!show[1]}
			class:opacity-100={show[1]}
			class:translate-y-0={show[1]}
		>
			<FlipText />
		</div>

    <!-- Cluster Status -->
    <div
      class="transition-all duration-700"
      class:opacity-0={!show[2]}
      class:opacity-100={show[2]}
    >
      <ClusterStatus />
    </div>

    <!-- Git Feed -->
    <div
      class="badges transition-all duration-700"
      class:opacity-0={!show[2]}
      class:opacity-100={show[2]}
    >
      <GitFeed />
    </div>

    <!-- CTA -->
    <div
      class="cta-row transition-all duration-700"
      class:opacity-0={!show[3]}
      class:opacity-100={show[3]}
    >
      <!--<a href="https://andusystems.com" target="_blank" rel="noopener" class="cta-btn">
        <Globe size={16} />
        <span>andusystems.com</span>
      </a>-->

      <a href="https://github.com/andusystems-dev-0" target="_blank" rel="noopener" class="cta-btn">
        <svg
          role="img"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={siGithub.path} />
        </svg>
        <span>Github</span>
      </a>

      <a href="/resume.pdf" target="_blank" class="cta-btn">
        <FileText size={16} />
        <span>Resume</span>
      </a>
      
      <a href="mailto:alex@andusystems.com" class="cta-email">
        <Mail size={14} />
        <span>alex@andusystems.com</span>
      </a>

    </div>

	</div>
</div>


<!-- Styles -->
<style>
.name {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 48px;
  color: #f0f0f0;
}

.location {
  font-family: 'Space Mono', monospace;
  font-size: 0.75rem;
  color: #555555;
  letter-spacing: 0.05em;
  margin-top: -1rem;
}

.badges {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.cta-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

.cta-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: 'Space Mono', monospace;
  font-size: 0.7rem;
  color: #f0f0f0;
  text-decoration: none;
  letter-spacing: 0.06em;
  border: 1px solid #2a2a2a;
  padding: 0.4rem 0.75rem;
  transition: border-color 0.2s, color 0.2s;
}

.cta-btn:hover {
  border-color: #f0f0f0;
  color: #ffffff;
}

.cta-email {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: 'Space Mono', monospace;
  font-size: 0.6rem;
  color: #555555;
  text-decoration: none;
  letter-spacing: 0.06em;
  transition: color 0.2s;
  width: 100%;
  justify-content: center;
  padding-top: 0.25rem;
}

.cta-email:hover {
  color: #f0f0f0;
}
</style>
