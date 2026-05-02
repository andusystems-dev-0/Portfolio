# Changelog

All notable changes to the Portfolio project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Changed
- Updated project documentation (README, architecture, development guide, changelog)

## [0.2.0] - 2026-04-26

### Added
- GitHub contribution heatmap (`GitFeed` component) — 30-day grid fetched from pre-rendered contributions API
- Homelab cluster status panel (`ClusterStatus` component) — polls five clusters every 60 s with operational/degraded/unavailable states
- Scrolling technology stack ticker (`TechStack` component) — fixed footer displaying 15 technology icons
- Pre-rendered API endpoint `/api/contributions` that proxies GitHub contribution data as static JSON

### Changed
- Resume updated (contact number removed)
- Hero section expanded with `GitFeed` and `ClusterStatus` sections
- Homepage composition updated from `Nav + Hero` to `Hero + TechStack`
- CTA button border radius tightened to 4 px for consistent styling
- Button border radius updated to 6 px across interactive elements
- Location spacing in hero section reduced
- Mobile centering and border rendering fixed
- Performance improvements to hero entrance animations (stagger timing adjusted to 150 ms)

### Removed
- Unused `Nav` component deleted

### Fixed
- Resume PDF path corrected in hero action link
- Mobile border rendering issues resolved
- GitHub connectivity issues on deployed build resolved
- Overflow issues in hero section resolved

### Infrastructure
- Cluster status endpoints added behind a reverse proxy

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
- Google Fonts integration (Bebas Neue, Space Mono, DM Sans)
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
