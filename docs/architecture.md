# Architecture

## Overview

The Portfolio site is a statically pre-rendered single-page application built with SvelteKit. It compiles to plain HTML, CSS, and JavaScript at build time and is served from an nginx container with no server-side runtime. The only runtime network activity is `ClusterStatus`, which polls a reverse-proxied status endpoint every 60 seconds.

Deployment is fully automated through a GitOps pipeline — a CI workflow builds and pushes the container image, updates an image tag in a separate infrastructure repository, and ArgoCD rolls the new version into the cluster.

## Component Diagram

```
┌──────────────────────────────────────────────────────────────┐
│  +page.svelte  (homepage)                                    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  Hero.svelte                                         │    │
│  │  ┌──────────────────────────────────────────────┐    │    │
│  │  │  Headline  "ALEX"  +  location               │    │    │
│  │  └──────────────────────────────────────────────┘    │    │
│  │  ┌──────────────────────────────────────────────┐    │    │
│  │  │  FlipText.svelte                             │    │    │
│  │  │  ┌────────┐ ┌────────┐ ┌────────┐  ...      │    │    │
│  │  │  │FlipChar│ │FlipChar│ │FlipChar│           │    │    │
│  │  │  └────────┘ └────────┘ └────────┘           │    │    │
│  │  └──────────────────────────────────────────────┘    │    │
│  │  ┌──────────────────────────────────────────────┐    │    │
│  │  │  GitFeed.svelte  (30-day contribution grid)  │    │    │
│  │  └──────────────────────────────────────────────┘    │    │
│  │  ┌──────────────────────────────────────────────┐    │    │
│  │  │  ClusterStatus.svelte  (5 cluster indicators)│    │    │
│  │  └──────────────────────────────────────────────┘    │    │
│  │  ┌──────────────────────────────────────────────┐    │    │
│  │  │  Action Links  (GitHub · Resume · Email)     │    │    │
│  │  └──────────────────────────────────────────────┘    │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  TechStack.svelte  (fixed footer ticker)             │    │
│  └──────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

### +layout.svelte / +layout.ts

- Imports global PostCSS styles (`app.postcss`)
- Sets `prerender = true` and `ssr = false` — the site is rendered entirely client-side as a static SPA

### +page.svelte

- Composes the full-screen page from `Hero` and `TechStack`
- Provides the outer viewport container

### Hero.svelte

- Central content area with staggered entrance animations (300 ms base + 150 ms per child)
- Displays headline, location, `FlipText` role cycler, `GitFeed`, `ClusterStatus`, and action links
- Action links: GitHub profile, downloadable resume PDF, email CTA
- Hover effects: scale-up and copper glow on interactive elements

### FlipText.svelte

- Manages the animated role cycler
- Maintains four roles (Systems Engineer, Software Engineer, DevOps Engineer, Platform Engineer)
- Auto-advances every 4 seconds via `setInterval`
- Pads each role string to the maximum role length to prevent layout shift
- Staggers individual `FlipChar` transitions at 30 ms per character
- Swipe interaction: 3 rapid hover events within 500 ms triggers the next role

### FlipChar.svelte

- Renders a single character as a split-flap (flip-clock) card
- Uses CSS 3D transforms with a 300 px perspective
- Three animation phases:
  1. **Phase 0** — static display
  2. **Phase 1** — top flap rotates down (200 ms, ease-in)
  3. **Phase 2** — bottom flap rotates up (200 ms, ease-out)
- Reactively triggers the flip sequence whenever the `char` prop changes
- Exposes an `onswipe` callback for the hover-based swipe interaction
- Respects `prefers-reduced-motion`

### GitFeed.svelte

- Renders a 30-day GitHub contribution heatmap (5 rows × 6 columns grid)
- Fetches contribution data from the `/api/contributions` pre-rendered endpoint
- Maps contribution level (0–4) to fill color (from `#161616` through `#39d353`)
- Includes error handling for failed fetches

### ClusterStatus.svelte

- Displays live status for five homelab clusters: Management, Networking, Storage, Monitoring, Portfolio
- Polls a reverse-proxied status endpoint every 60 seconds with a 5-second timeout
- Three states: operational (green pulse), degraded (amber), unavailable (gray)

### TechStack.svelte

- Fixed-position footer with a horizontally scrolling ticker
- Displays 15 technology icons with labels (Kubernetes, ArgoCD, Helm, Docker, Terraform, Ansible, Proxmox, Kafka, Airflow, .NET, Angular, Svelte, TypeScript, Go, SQL)
- Uses gradient masks for a fade effect at the edges and hover-pause behavior

## Data Flows

### Flip animation

```
  setInterval (4 s)
        │
        ▼
  FlipText ─── currentIndex ──▶ roles[i]
        │                           │
        │                     pad to max len
        │                           │
        │                           ▼
        │                    char[] array
        │                     │   │   │
        │               30 ms stagger
        │                     │   │   │
        ▼                     ▼   ▼   ▼
  FlipChar ◄─── char prop change triggers flip
        │
        │  onswipe (hover × 3 within 500 ms)
        │
        ▼
  FlipText ─── advance to next role, restart timer
```

### GitHub contribution heatmap

```
  Build time
      │
      ▼
  /api/contributions (+server.ts)
      │
      ├── Fetch GitHub contributions page (HTML)
      ├── Parse contribution level attributes
      └── Return JSON { date, level }[]
      │
      ▼
  Static JSON embedded in pre-rendered output
      │
      ▼  (runtime)
  GitFeed ─── GET /api/contributions ──▶ render heatmap grid
```

### Cluster status polling

```
  ClusterStatus (browser, runtime)
      │
      ├── onMount + setInterval (60 s)
      │
      ▼
  GET <cluster-status-proxy>
      │
      ├── 200 → operational
      ├── non-200 → degraded
      └── timeout / network error → unavailable
```

## Build Pipeline

```
  npm run build
       │
       ▼
  Vite + SvelteKit static adapter
       │
       ├── Svelte compilation (components → JS)
       ├── Tailwind CSS purge + minification
       ├── Pre-render all routes (including /api/contributions)
       │
       ▼
  build/   (static HTML, CSS, JS, assets)
```

## CI/CD Pipeline

```
  Push to main
       │
       ▼
  GitHub Actions (self-hosted runner)
       │
       ├── Checkout source
       ├── Compute image tag (short commit SHA)
       ├── Log in to internal container registry
       ├── Build Docker image (multi-stage)
       ├── Push image (SHA tag + latest)
       │
       ▼
  Bump image tag in GitOps repo
       │
       ├── Clone infrastructure repository from internal Git host
       ├── Update manifest with new image tag
       ├── Commit and push (with retry — up to 3 attempts with rebase)
       │
       ▼
  ArgoCD detects change → rolls deployment
```

| Aspect | Description |
|---|---|
| Trigger | Push to `main` or manual dispatch |
| Concurrency | One build per ref; newer pushes cancel in-flight runs |
| Image tagging | Immutable tag from short commit SHA plus a floating `latest` tag |
| Registry auth | Credentials stored as repository secrets |
| GitOps update | `sed`-based manifest update with retry rebase logic |

## Deployment Architecture

```
  Docker Multi-Stage Build

  Stage 1: node:20-alpine (builder)
    npm ci → npm run build → build/

  Stage 2: nginx-unprivileged:1.27-alpine (runtime)
    COPY build/ → /usr/share/nginx/html
    COPY nginx.conf
    Runs as non-root (uid 101), listens on port 8080
```

### nginx configuration

| Feature | Detail |
|---|---|
| SPA fallback | `try_files $uri $uri/ /index.html` routes all paths to the SPA entry point |
| Immutable asset caching | One-year `Cache-Control: public, immutable` for JS, CSS, images, fonts (safe because Vite content-hashes filenames) |
| Gzip compression | Enabled for text, JSON, JavaScript, CSS, SVG with a 256-byte minimum threshold |

## Key Design Decisions

| Decision | Rationale |
|---|---|
| Static adapter + CSR-only | No server runtime needed; the site is purely presentational with minimal dynamic data |
| `ssr = false` | Animations and DOM measurements require the browser; SSR would flash unstyled content |
| Contributions endpoint pre-rendered | Avoids runtime GitHub dependency; contribution data is baked in at build time |
| `ClusterStatus` runtime polling | Cluster health is genuinely dynamic and must be live; 60 s interval balances freshness vs. load |
| nginx-unprivileged | Security best practice — no root process, no privileged port binding |
| 3D flip animation in pure CSS | No animation library dependency; leverages hardware-accelerated CSS transforms |
| Character-level stagger | Creates the mechanical flip-clock aesthetic; each `FlipChar` is an independent reactive unit |
| Role string padding | Prevents layout shift when switching between roles of different lengths |
| `prefers-reduced-motion` respect | Disables transitions for users who request reduced motion |
| Immutable asset caching (1 year) | Vite hashes filenames at build time; long TTLs are safe and improve load performance |
| GitOps image tag bump | Decouples the build from the deploy; ArgoCD reconciles desired state automatically |
| Concurrency control in CI | Prevents parallel builds from racing on the same ref |
| Immutable SHA tags | Each build produces a unique, traceable image tag; `latest` is a convenience alias only |

## Invariants

- The site has no server-side runtime — it is fully static after build
- All navigation is client-side (SPA fallback via `try_files` in nginx)
- The flip animation always completes its full 400 ms cycle before accepting a new character change
- Role strings are always padded to the maximum role length to prevent layout reflow
- The container always runs as a non-root user (uid 101)
- Every production image is tagged with the source commit SHA for traceability
- The contributions API endpoint is pre-rendered at build time — it does not make runtime HTTP calls to GitHub
