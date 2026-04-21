# Andusystems Portfolio

A personal portfolio website for a Developer & Infrastructure Engineer. Built with SvelteKit and featuring an animated flip-clock role display, dark theme with copper accents, and staggered entrance animations.

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
│       └─── Hero.svelte       # Hero section — headline, flip-text, action links
│
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
