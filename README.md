# Portfolio

> Personal portfolio site for a Systems & Software Engineer — static SvelteKit SPA deployed to the andusystems homelab.

## Purpose

This repository contains a personal portfolio website showcasing engineering skills and homelab work. The site is built with SvelteKit and compiles to a fully static SPA at build time. It is containerized and deployed to the andusystems Kubernetes cluster via a GitOps pipeline driven by ArgoCD.

The site features a flip-clock role animation, a live GitHub contribution heatmap, real-time homelab cluster status indicators, and a scrolling technology stack ticker.

## At a glance

| Field | Value |
|---|---|
| Type | application |
| Role | service |
| Primary stack | SvelteKit + Tailwind CSS + TypeScript |
| Deployed by | hub ArgoCD (GitOps image tag bump via CI) |
| Status | production |

## Components

| Component | Purpose | Location |
|---|---|---|
| `Hero` | Headline, animated role cycler, and action links | `src/lib/components/Hero.svelte` |
| `FlipText` | Manages role cycling — auto-advances every 4 s, swipe interaction | `src/lib/components/FlipText.svelte` |
| `FlipChar` | Single flip-clock character — 3D CSS transform, two-phase animation | `src/lib/components/FlipChar.svelte` |
| `GitFeed` | 30-day GitHub contribution heatmap fetched from the contributions API | `src/lib/components/GitFeed.svelte` |
| `ClusterStatus` | Live status indicators for five homelab clusters, polled every 60 s | `src/lib/components/ClusterStatus.svelte` |
| `TechStack` | Fixed-footer scrolling ticker of technology icons | `src/lib/components/TechStack.svelte` |
| Contributions API | Pre-rendered endpoint that proxies GitHub contribution data | `src/routes/api/contributions/+server.ts` |
| Root layout | Global style imports and SPA shell | `src/routes/+layout.svelte` |

## Architecture

```
  Browser
    │
    ▼
  nginx (non-root, port 8080)
    │  SPA fallback — try_files → index.html
    │  Immutable cache headers for hashed assets
    │
    ▼
  +page.svelte
    ├── Hero ──▶ FlipText ──▶ FlipChar × N
    ├── GitFeed ──▶ GET /api/contributions ──▶ (pre-rendered JSON)
    └── TechStack (static icon ticker)

  ClusterStatus ──▶ GET <cluster-status-proxy> (runtime, every 60 s)

  CI/CD
    push → GitHub Actions → Docker build → registry push
                          → GitOps manifest bump → ArgoCD sync
```

The page is pre-rendered at build time; the contributions endpoint is also pre-rendered (static JSON). `ClusterStatus` performs live HTTP polling at runtime. See [docs/architecture.md](docs/architecture.md) for the full breakdown.

## Quick start

### Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| Node.js | 20+ | Build and dev server |
| npm | 9+ | Package management (bundled with Node 20) |
| Docker | 20+ | Container builds (optional for local dev) |

### Deploy / run

```bash
git clone <repository-url> && cd Portfolio
npm install
npm run dev
# dev server at http://localhost:5173

# production build
npm run build
npm run preview

# containerized
docker build -t portfolio .
docker run -p 8080:8080 portfolio
```

See [docs/development.md](docs/development.md) for Docker details, type checking, and styling conventions.

## Configuration

### CI secrets (repository settings)

| Key | Required | Description |
|---|---|---|
| `NEXUS_USERNAME` | CI only | Container registry username |
| `NEXUS_PASSWORD` | CI only | Container registry password |
| `FORGEJO_TOKEN` | CI only | Git token for GitOps manifest bump |

No environment variables are required for local development. The site is fully static.

### Key config files

| File | Purpose |
|---|---|
| `svelte.config.js` | Static adapter, prerender settings, SPA fallback |
| `tailwind.config.js` | Dark mode, copper color palette, custom font families |
| `nginx.conf` | SPA fallback routing, gzip compression, immutable asset caching |
| `Dockerfile` | Multi-stage build (Node 20 builder → nginx-unprivileged runtime) |
| `vite.config.ts` | Vite build configuration with SvelteKit plugin |

## Repository layout

```
.
├── src/
│   ├── app.html                  # HTML shell — OG meta, Google Fonts, dark mode class
│   ├── app.postcss               # Global styles — Tailwind directives, dark gradient
│   ├── app.d.ts                  # SvelteKit ambient type definitions
│   ├── lib/
│   │   └── components/           # Reusable Svelte components
│   │       ├── FlipChar.svelte
│   │       ├── FlipText.svelte
│   │       ├── Hero.svelte
│   │       ├── GitFeed.svelte
│   │       ├── ClusterStatus.svelte
│   │       └── TechStack.svelte
│   └── routes/
│       ├── +layout.svelte        # Root layout
│       ├── +layout.ts            # prerender = true, ssr = false
│       ├── +page.svelte          # Homepage composition
│       └── api/contributions/    # Pre-rendered GitHub contributions endpoint
├── static/                       # Static assets (favicon, resume PDF, robots.txt)
├── docs/                         # Project documentation
├── Dockerfile                    # Multi-stage build (Node 20 → nginx)
├── nginx.conf                    # SPA routing, gzip, immutable caching
├── svelte.config.js              # Static adapter, prerender config
├── tailwind.config.js            # Copper palette, custom fonts, dark mode
├── postcss.config.js             # Tailwind + Autoprefixer
├── vite.config.ts                # Vite + SvelteKit plugin
└── package.json                  # Dependencies and npm scripts
```

## Related repos

| Repo | Relation |
|---|---|
| andusystems-management | hub — provisions the cluster ArgoCD apps that run this service |
| andusystems-infrastructure | GitOps target — CI bumps the portfolio image tag in this repo |

## Further documentation

- [Architecture](docs/architecture.md) — component diagram, data flows, design decisions, invariants
- [Development](docs/development.md) — local setup, build commands, styling guide, CI/CD
- [Changelog](CHANGELOG.md) — release history
