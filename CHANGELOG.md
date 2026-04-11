# Changelog

All notable changes to the Portfolio project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Changed
- Updated project documentation (README, architecture, development guide, changelog)

## [0.1.1] - 2026-04-09

### Changed
- Refactored Dockerfile to optimize image size and improve build efficiency
- CI pipeline clones GitOps repository via cluster-internal Git URL for reliability
- Improved commit message formatting for image tag bump commits in CI

## [0.1.0] - 2026-04-08

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
- Project documentation (README, architecture guide, development guide, changelog)

### Infrastructure
- Multi-stage Docker build (Node 20 Alpine builder → nginx-unprivileged 1.27 Alpine runtime)
- nginx configuration with SPA fallback routing, gzip compression, and immutable asset caching
- Container runs as non-root user (uid 101) on port 8080
- SvelteKit static adapter for pre-rendered output
- TypeScript strict mode with `svelte-check` validation
- GitHub Actions CI/CD workflow with self-hosted runner
- Automated image tag bump in GitOps infrastructure repository
