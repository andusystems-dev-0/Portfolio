# Changelog

All notable changes to the Portfolio project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Project documentation (README, architecture, development guide, changelog)

## [0.1.0] - 2026-04-07

### Added
- Initial portfolio site with SvelteKit, Tailwind CSS, and Skeleton UI
- Flip-clock character animation (`FlipChar`, `FlipText` components)
- Hero section with staggered entrance animations and action links
- Navigation bar component
- Dark gradient theme with custom copper accent palette
- Google Fonts integration (Bebas Neue, DM Mono, DM Sans)
- Open Graph meta tags for social sharing
- SVG favicon (copper "A" on dark background)
- `robots.txt` allowing all crawlers
- `prefers-reduced-motion` accessibility support

### Changed
- Dockerfile updated to use `nginx-unprivileged` image for non-root execution
- nginx configuration changed to listen on port 8080

### Infrastructure
- Multi-stage Docker build (Node 20 Alpine builder, nginx 1.27 Alpine runtime)
- nginx configuration with SPA fallback routing, gzip compression, and immutable asset caching
- SvelteKit static adapter for pre-rendered output
- TypeScript strict mode with `svelte-check` validation
