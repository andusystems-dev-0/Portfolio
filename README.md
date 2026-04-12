# Andusystems Portfolio

A personal portfolio website for Alex — Developer & Infrastructure Engineer. Built with SvelteKit and featuring an animated flip-clock role display, dark theme with copper accents, and staggered entrance animations.

## Features

- **Flip-clock role animation** — cycles through roles (Systems Engineer, DevOps Engineer, Full Stack Developer, etc.) with 3D character-flip transitions
- **Interactive swipe detection** — rapid hover across characters triggers the next role
- **Dark gradient theme** — deep background with a custom copper (`#c8b89a`) accent palette
- **Static pre-rendered SPA** — built with SvelteKit's static adapter for fast, cacheable delivery
- **Containerized deployment** — multi-stage Docker build served via nginx as a non-root user
- **GitOps CI/CD** — automated container builds with image tag promotion to a GitOps repository
- **Accessibility** — respects `prefers-reduced-motion` to disable animations for users who request it

## Tech Stack

| Layer       | Technology                                     |
|-------------|-------------------------------------------------|
| Framework   | SvelteKit 2.5, Svelte 4.2                      |
| Styling     | Tailwind CSS 3.4, Skeleton UI 2.10             |
| Typography  | Bebas Neue (display), DM Sans (body), DM Mono  |
| Build       | Vite 5.2, TypeScript 5.4                       |
| Runtime     | nginx-unprivileged 1.27 (Alpine)               |
| Container   | Docker multi-stage (Node 20 Alpine → nginx)     |
| CI/CD       | GitHub Actions (self-hosted runner)             |
| GitOps      | ArgoCD (automatic deployment on image tag bump) |

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Type-check the project
npm run check

# Build for production
npm run build

# Preview the production build
npm run preview
```

## Docker

Build and run the containerized version:

```bash
docker build -t portfolio .
docker run -p 8080:8080 portfolio
```

The container runs as a non-root user (uid 101) on port 8080.

## Project Structure

```
src/
├── app.html              # HTML shell — Open Graph meta, Google Fonts, dark mode
├── app.postcss           # Global styles — Tailwind directives, background gradient
├── app.d.ts              # SvelteKit ambient type definitions
├── lib/
│   └── components/
│       ├── FlipChar.svelte   # Individual 3D flip-card character
│       ├── FlipText.svelte   # Flip-clock role cycler (4 s interval, swipe detection)
│       ├── Hero.svelte       # Hero section — headline, flip-text, action links
│       └── Nav.svelte        # Top navigation bar
└── routes/
    ├── +layout.svelte    # Root layout (imports global styles)
    ├── +layout.ts        # Prerender + CSR-only flags
    └── +page.svelte      # Homepage composition (Nav + Hero)
static/
├── favicon.svg           # Copper "A" on dark background
└── robots.txt            # Allow all crawlers
```

## Configuration Reference

| File                 | Purpose                                                |
|----------------------|--------------------------------------------------------|
| `svelte.config.js`  | Static adapter, prerender settings, SPA fallback        |
| `vite.config.ts`    | Vite build config with SvelteKit plugin                 |
| `tailwind.config.js`| Dark mode, copper palette, custom fonts, Skeleton UI    |
| `postcss.config.js` | Tailwind CSS + Autoprefixer pipeline                    |
| `tsconfig.json`     | Strict TypeScript, ESM interop, bundler module resolution |
| `nginx.conf`        | SPA fallback routing, gzip compression, immutable caching |
| `Dockerfile`        | Multi-stage build (Node 20 builder → nginx runtime)      |

## Architecture Summary

The site is a single-page application pre-rendered at build time via SvelteKit's static adapter. All rendering happens client-side — there is no server runtime. The page consists of a `Nav` bar and a `Hero` section containing the headline, a `FlipText` role cycler (composed of individual `FlipChar` components), and action links.

In production, a CI pipeline builds the Docker image, pushes it to an internal container registry, and bumps the image tag in a GitOps repository. ArgoCD detects the change and rolls the deployment automatically.

Static assets are served by nginx with one-year immutable cache headers and gzip compression.

See [docs/architecture.md](docs/architecture.md) for component diagrams, data flows, and design decisions.

## Further Documentation

- [Architecture](docs/architecture.md) — component diagram, data flows, CI/CD pipeline, design decisions
- [Development](docs/development.md) — prerequisites, build commands, local setup, styling guide
- [Changelog](CHANGELOG.md) — version history

## License

Private. All rights reserved.


##################################################3# TEMPORARY, PLEASE REMOVE ################################################

Good call on pulling back from full terminal aesthetic — the flip-clock is a design statement and a heavy terminal theme would fight it. The cursor after your name is a perfect subtle nod without committing to the bit.

---

## Revised Design Direction

**Aesthetic:** Brutalist-minimal. Black background, white typography, zero decoration. The flip-clock and the live badges are the *only* visual interest — everything else gets out of their way.

**Color Palette (monotone):**

| Role | Value |
|---|---|
| Background | `#0a0a0a` |
| Primary text | `#f0f0f0` |
| Muted text | `#555555` |
| Accent / pulse | `#ffffff` |
| Divider | `#1a1a1a` |
| Hover tint (icons) | `#cccccc` |

No copper. Clean. The flip-clock already provides motion — color would be noise.

**Typography:**
- **Name:** Bebas Neue (already planned) — `font-size: clamp(4rem, 10vw, 9rem)`
- **Location + muted labels:** `Space Mono` — fits the technical identity without going full terminal
- **CTA buttons / footer:** `Inter` or `Space Mono` — your call, Inter is cleaner

---

## What Needs to Be Added (Ordered Build List)

**1. Cursor after name**
- A `|` character in a `<span>` with a CSS `blink` keyframe animation — no library
- Match the name font size, white, ~1s blink cycle
- `animation: blink 1s step-end infinite`

**2. Location line**
- `Johnson City, TN` in Space Mono, small, muted (`#555555`), directly under name+cursor line
- No icon, no flag emoji — just text

**3. Live cluster status badge**
- `ClusterStatus.svelte` component
- Polls your homelab `/healthz` endpoint via `fetch` on mount + every 60s
- Green pulse dot (CSS `@keyframes pulse` with `box-shadow`) + `"infra: operational"`
- Fallback: gray dot + `"status unavailable"` on timeout/error
- Style: monospace label, small, sits below the flip-clock

**4. GitHub commit sparkline**
- No library — raw SVG rendered from GitHub public API data
- Endpoint: `https://api.github.com/users/YOUR_USER/events`
- Filter `PushEvent`, bucket last 30 days, normalize bar heights
- Sits next to or below the cluster badge — same horizontal band
- Label: `"push activity · 30d"` in muted Space Mono

**5. CTA row**
- Three icon-buttons: andusystems.com, GitHub, Resume PDF
- Use `lucide-svelte` for icons (Globe, Github, FileText)
- White icons, no fill, border `1px solid #2a2a2a`, hover → border goes white
- Below: `mailto:` link in Space Mono, small

**6. Tech stack footer**
- Icon strip from `simple-icons` SVG set (self-hosted, no CDN dependency)
- Icons: Kubernetes, Docker, Terraform, Ansible, Go, Svelte, Proxmox, ArgoCD, Linux
- All white/`#f0f0f0`, same size (`24px`), hover → full white + slight scale
- Separated by a `1px solid #1a1a1a` rule

**7. Particle field**
- Already in progress via Threlte — confirm z-index is behind all content
- Opacity: `0.15–0.25` max so it doesn't pull focus from the flip-clock

---

## Libraries / Fonts Summary

| Thing | Library / Source |
|---|---|
| Icons (CTA) | `lucide-svelte` |
| Icons (footer) | `simple-icons` SVGs, self-hosted |
| Fonts | Google Fonts — Bebas Neue, Space Mono, Inter |
| 3D / particles | `threlte` (already in use) |
| Cluster polling | Native `fetch` in Svelte `onMount` |
| Sparkline | Raw SVG — no library |
| Flip-clock | Your existing Three.js element |

---

## What to Skip / Not Add

- No scroll animations or entrance transitions — they delay the impact
- No hover tooltips on the tech stack icons — KISS
- No separate "about" section — the flip-clock says it all
- No dark/light toggle — it's always dark, that's the point

---

The page should load and feel *immediately* done. Name, cursor blink, flip-clock running, badges live, icons at the bottom. Five seconds to understand everything about you. Want me to start scaffolding any of the Svelte components?



