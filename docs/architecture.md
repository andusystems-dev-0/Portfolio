# Architecture

## Overview

The Portfolio site is a statically pre-rendered single-page application built with SvelteKit. It compiles to plain HTML, CSS, and JavaScript at build time and is served from an nginx container with no server-side runtime.

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
- Each child element fades in and translates upward with a 120 ms offset (total stagger: 300 ms base + N × 120 ms)
- Contains the headline, `FlipText`, and external action links
- Action links include hover effects: scale-up and copper glow

### FlipText.svelte
- Manages the animated role cycler
- Maintains a list of roles and auto-advances every 4 seconds via `setInterval`
- Pads each role string to a uniform length for visual consistency
- Staggers individual `FlipChar` transitions at 30 ms per character
- Implements a "swipe" interaction: 3 rapid hover events within 500 ms triggers the next role

### FlipChar.svelte
- Renders a single character as a split-flap (flip-clock) card
- Uses CSS 3D transforms with a 300 px perspective
- Three animation phases:
  1. Phase 0 — static display
  2. Phase 1 — top flap rotates down (200 ms, ease-in)
  3. Phase 2 — bottom flap rotates up (200 ms, ease-out)
- Reactively triggers the flip sequence whenever the `char` prop changes
- Exposes an `onswipe` callback for the hover-based swipe interaction

## Data Flow

```
  setInterval (4s)
        │
        ▼
  FlipText ── currentIndex ──▶ roles[i]
        │                         │
        │                   pad to max len
        │                         │
        │                         ▼
        │                  char[] array
        │                    │  │  │
        │              30ms stagger
        │                    │  │  │
        ▼                    ▼  ▼  ▼
  FlipChar  ◄── char prop change triggers flip
        │
        │  onswipe (hover × 3)
        │
        ▼
  FlipText ── advance to next role
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
       ├── Static adapter pre-renders pages
       │
       ▼
  build/   (static HTML, CSS, JS, assets)
```

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
| **Gzip compression** | Reduces transfer size for text-based assets (CSS, JS, SVG) with minimal CPU overhead |

## Invariants

- The site has **no server-side runtime** — it is fully static after build
- All navigation is client-side (SPA fallback via `try_files` in nginx)
- The flip animation always completes its full 400 ms cycle before accepting a new character change
- Role strings are always padded to the maximum role length to prevent layout reflow
- The container always runs as a non-root user
