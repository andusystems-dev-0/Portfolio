# Andusystems Portfolio

A personal portfolio website for Alex — Developer & Infrastructure Engineer. Built with SvelteKit and featuring an animated flip-clock role display, dark theme with copper accents, and staggered entrance animations.

## Features

- **Flip-clock role animation** — cycles through roles (Systems Engineer, DevOps Engineer, Full Stack Developer, etc.) with 3D character-flip transitions
- **Interactive swipe detection** — rapid hover triggers advance the role display
- **Dark gradient theme** — deep background with a custom copper (#c8b89a) accent palette
- **Static pre-rendered SPA** — built with SvelteKit's static adapter for fast, cacheable delivery
- **Containerized deployment** — multi-stage Docker build served via nginx

## Tech Stack

| Layer       | Technology                                     |
|-------------|-------------------------------------------------|
| Framework   | SvelteKit 2.5, Svelte 4.2                      |
| Styling     | Tailwind CSS 3.4, Skeleton UI 2.10             |
| Typography  | Bebas Neue (display), DM Sans (body), DM Mono  |
| Build       | Vite 5.2, TypeScript 5.4                       |
| Runtime     | nginx (Alpine, unprivileged)                    |
| Container   | Docker multi-stage (Node 20 → nginx 1.27)       |

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
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

The container runs as a non-root user on port 8080.

## Project Structure

```
src/
├── app.html              # HTML shell with Open Graph meta, fonts, dark mode
├── app.postcss           # Global styles, background gradient, reduced-motion
├── app.d.ts              # SvelteKit type definitions
├── lib/
│   └── components/
│       ├── FlipChar.svelte   # Individual 3D flip-card character
│       ├── FlipText.svelte   # Flip-clock role cycler (4s interval)
│       ├── Hero.svelte       # Hero section with headline, links, animations
│       └── Nav.svelte        # Top navigation bar
├── routes/
│   ├── +layout.svelte    # Root layout (imports global styles)
│   ├── +layout.ts         # Prerender + CSR-only flags
│   └── +page.svelte       # Homepage (Nav + Hero)
static/
├── favicon.svg            # Copper "A" on dark background
└── robots.txt             # Allow all crawlers
```

## Configuration Reference

| File                 | Purpose                                              |
|----------------------|------------------------------------------------------|
| `svelte.config.js`  | Static adapter, prerender settings, build output dir  |
| `vite.config.ts`    | Vite + SvelteKit plugin                              |
| `tailwind.config.js`| Dark mode, copper palette, custom fonts, Skeleton UI  |
| `postcss.config.js` | Tailwind CSS + Autoprefixer                          |
| `tsconfig.json`     | Strict TypeScript, ESM interop, source maps          |
| `nginx.conf`        | SPA fallback routing, gzip, asset caching            |
| `Dockerfile`        | Multi-stage build (Node builder → nginx runtime)      |

## Architecture Summary

The site is a single-page application pre-rendered at build time via SvelteKit's static adapter. The page consists of a `Nav` bar and a `Hero` section. The hero contains the headline, a `FlipText` component (which orchestrates multiple `FlipChar` components for the role animation), and action links to GitHub, Andusystems, and a resume PDF.

In production, the static assets are served by nginx with long-lived cache headers for immutable assets and gzip compression.

See [docs/architecture.md](docs/architecture.md) for component diagrams and design decisions.

## Further Documentation

- [Architecture](docs/architecture.md) — component diagram, data flows, design decisions
- [Development](docs/development.md) — prerequisites, build commands, local setup
- [Changelog](CHANGELOG.md) — version history

## License

Private. All rights reserved.
