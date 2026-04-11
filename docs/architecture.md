# Architecture

## Overview

The Portfolio site is a statically pre-rendered single-page application built with SvelteKit. It compiles to plain HTML, CSS, and JavaScript at build time and is served from an nginx container with no server-side runtime. Deployment is fully automated through a GitOps pipeline — a CI workflow builds and pushes the container image, updates an image tag in a separate infrastructure repository, and ArgoCD rolls the new version into the cluster.

## Component Diagram

```
┌─────────────────────────────────────────────────────┐
│  +page.svelte  (homepage)                           │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │  Nav.svelte                                  │   │
│  │  (top navigation bar)                        │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │  Hero.svelte                                 │   │
│  │  ┌────────────────────────────────────────┐  │   │
│  │  │  Headline  "ALEX"                      │  │   │
│  │  └────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────┐  │   │
│  │  │  FlipText.svelte                       │  │   │
│  │  │  ┌──────┐ ┌──────┐ ┌──────┐  ...      │  │   │
│  │  │  │Flip  │ │Flip  │ │Flip  │           │  │   │
│  │  │  │Char  │ │Char  │ │Char  │           │  │   │
│  │  │  └──────┘ └──────┘ └──────┘           │  │   │
│  │  └────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────┐  │   │
│  │  │  Action Links (GitHub, Site, Resume)   │  │   │
│  │  └────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## Component Responsibilities

### +layout.svelte / +layout.ts

- Imports global PostCSS styles
- Sets `prerender = true` and `ssr = false` — the site is rendered entirely client-side as a static SPA

### +page.svelte

- Composes the full-screen page from `Nav` and `Hero`
- Provides the viewport container (`h-screen w-screen`)

### Nav.svelte

- Absolute-positioned navigation bar at the top of the viewport
- Currently a minimal placeholder for future navigation items

### Hero.svelte

- Central content area with staggered entrance animations
- Each child element fades in and translates upward with a 120 ms offset (total stagger: 300 ms base + N x 120 ms)
- Contains the headline, `FlipText`, and external action links
- Action links include hover effects: scale-up and copper glow

### FlipText.svelte

- Manages the animated role cycler
- Maintains a list of six roles and auto-advances every 4 seconds via `setInterval`
- Pads each role string to a uniform length (the longest role) to prevent layout shift
- Staggers individual `FlipChar` transitions at 30 ms per character
- Implements a "swipe" interaction: 3 rapid hover events within 500 ms triggers the next role

### FlipChar.svelte

- Renders a single character as a split-flap (flip-clock) card
- Uses CSS 3D transforms with a 300 px perspective
- Three animation phases:
  1. **Phase 0** — static display
  2. **Phase 1** — top flap rotates down (200 ms, ease-in)
  3. **Phase 2** — bottom flap rotates up (200 ms, ease-out)
- Reactively triggers the flip sequence whenever the `char` prop changes
- Exposes an `onswipe` callback for the hover-based swipe interaction

## Data Flow

```
  setInterval (4 s)
        │
        ▼
  FlipText ── currentIndex ──▶ roles[i]
        │                         │
        │                   pad to max len
        │                         │
        │                         ▼
        │                  char[] array
        │                    │  │  │
        │              30 ms stagger
        │                    │  │  │
        ▼                    ▼  ▼  ▼
  FlipChar  ◄── char prop change triggers flip
        │
        │  onswipe (hover x 3 within 500 ms)
        │
        ▼
  FlipText ── advance to next role, restart timer
```

There is no server-side data fetching, API calls, or external state. All state is local to the Svelte components and driven by timers and user interaction.

## Build Pipeline

```
  npm run build
       │
       ▼
  Vite + SvelteKit
       │
       ├── Svelte compilation (components → JS)
       ├── Tailwind CSS purge + minification
       ├── Static adapter pre-renders all routes
       │
       ▼
  build/   (static HTML, CSS, JS, assets)
```

## CI/CD Pipeline

The project uses a GitHub Actions workflow (`.github/workflows/build-and-push.yml`) with a self-hosted runner.

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
       ├── Commit and push (with retry for concurrent updates)
       │
       ▼
  ArgoCD detects change → rolls deployment
```

Key details:

| Aspect | Description |
|--------|-------------|
| **Trigger** | Push to `main` or manual dispatch |
| **Concurrency** | One build per ref; newer pushes cancel in-flight runs |
| **Image tagging** | Immutable tag from short commit SHA, plus a floating `latest` tag |
| **Registry auth** | Credentials stored as repository secrets |
| **GitOps update** | Clones the infrastructure repo, updates the manifest via `sed`, commits, and pushes with retry logic (up to 3 attempts with rebase) |

## Deployment Architecture

```
  ┌─────────────────────────────────────────┐
  │  Docker Multi-Stage Build               │
  │                                         │
  │  Stage 1: node:20-alpine (builder)      │
  │    npm ci → npm run build               │
  │                                         │
  │  Stage 2: nginx-unprivileged:1.27-alpine│
  │    COPY build/ → /usr/share/nginx/html  │
  │    COPY nginx.conf                      │
  │    Runs as non-root (uid 101)           │
  │    Listens on port 8080                 │
  └─────────────────────────────────────────┘
```

### nginx Configuration

The runtime nginx instance is configured with:

- **SPA fallback** — `try_files $uri $uri/ /index.html` routes all paths to the SPA entry point
- **Immutable asset caching** — JS, CSS, images, and fonts receive one-year `Cache-Control: public, immutable` headers (safe because Vite content-hashes filenames)
- **Gzip compression** — enabled for text, JSON, JavaScript, CSS, and SVG with a 256-byte minimum size threshold

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Static adapter + CSR-only** | No server runtime needed; the site is purely presentational with no dynamic data |
| **`ssr = false`** | Animations and DOM measurements require the browser; SSR would flash unstyled content |
| **nginx-unprivileged** | Security best practice — no root process, no privileged port binding |
| **3D flip animation in pure CSS** | No animation library dependency; leverages hardware-accelerated CSS transforms |
| **Character-level stagger** | Creates the mechanical flip-clock aesthetic; each `FlipChar` is an independent reactive unit |
| **Role string padding** | Prevents layout shift when switching between roles of different lengths |
| **`prefers-reduced-motion` respect** | Accessibility: disables transitions for users who request reduced motion |
| **Immutable asset caching (1 year)** | Vite hashes filenames on build; long cache TTLs are safe and improve load performance |
| **Gzip compression** | Reduces transfer size for text-based assets with minimal CPU overhead |
| **GitOps image tag bump** | Decouples the build from the deploy; ArgoCD reconciles the desired state automatically |
| **Concurrency control in CI** | Prevents parallel builds from racing on the same ref; newer pushes cancel stale runs |
| **Immutable SHA tags** | Each build produces a unique, traceable image tag; `latest` is a convenience alias only |

## Invariants

- The site has **no server-side runtime** — it is fully static after build
- All navigation is client-side (SPA fallback via `try_files` in nginx)
- The flip animation always completes its full 400 ms cycle before accepting a new character change
- Role strings are always padded to the maximum role length to prevent layout reflow
- The container always runs as a non-root user (uid 101)
- Every production image is tagged with the source commit SHA for traceability
