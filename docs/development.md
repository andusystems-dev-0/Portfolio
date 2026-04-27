# Development Guide

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | 20+ | Required for build and dev server |
| npm | 9+ | Bundled with Node.js 20 |
| Docker | 20+ | Optional — only needed for container builds |

## Local development setup

```bash
# Clone the repository
git clone <repository-url> && cd Portfolio

# Install dependencies
npm install

# Start the dev server (with hot module replacement)
npm run dev
```

The dev server starts at `http://localhost:5173` by default. Vite will pick the next available port if 5173 is in use.

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with hot module replacement |
| `npm run build` | Production build via SvelteKit static adapter |
| `npm run preview` | Serve the production build locally for verification |
| `npm run check` | Run `svelte-check` for TypeScript and Svelte errors |

## Build

```bash
npm run build
```

Output is written to `build/` as static HTML, CSS, and JS. The SvelteKit static adapter pre-renders all routes, including `/api/contributions`, at build time.

To preview the production build locally:

```bash
npm run preview
```

## Docker build

```bash
# Build the image
docker build -t portfolio .

# Run the container
docker run -p 8080:8080 portfolio
```

The Docker build is two-stage:

1. **Builder** — Node 20 Alpine installs dependencies (`npm ci`) and runs the production build
2. **Runtime** — nginx-unprivileged 1.27 Alpine serves the static output on port 8080

The container runs as a non-root user (uid 101). The nginx configuration includes SPA fallback routing, gzip compression, and immutable asset caching.

## Project layout

```
├── src/
│   ├── app.html              # HTML template (meta tags, fonts, dark mode)
│   ├── app.postcss           # Global CSS (Tailwind directives, background gradient)
│   ├── app.d.ts              # SvelteKit ambient types
│   ├── lib/
│   │   └── components/       # Reusable Svelte components
│   │       ├── FlipChar.svelte       # Individual 3D flip-card character
│   │       ├── FlipText.svelte       # Flip-clock role cycler
│   │       ├── Hero.svelte           # Hero section with animations
│   │       ├── GitFeed.svelte        # GitHub contribution heatmap
│   │       ├── ClusterStatus.svelte  # Homelab cluster status indicators
│   │       └── TechStack.svelte      # Scrolling technology ticker
│   └── routes/
│       ├── +layout.svelte    # Root layout (imports global styles)
│       ├── +layout.ts        # prerender = true, ssr = false
│       ├── +page.svelte      # Homepage (Hero + TechStack)
│       └── api/contributions/
│           └── +server.ts    # Pre-rendered GitHub contributions endpoint
├── static/                   # Served as-is (favicon, resume PDF, robots.txt)
├── docs/                     # Project documentation
├── Dockerfile                # Multi-stage container build
├── nginx.conf                # Production nginx configuration
├── svelte.config.js          # SvelteKit + static adapter config
├── tailwind.config.js        # Tailwind theme (copper palette, fonts)
├── postcss.config.js         # PostCSS processors (Tailwind + Autoprefixer)
├── vite.config.ts            # Vite configuration with SvelteKit plugin
├── tsconfig.json             # TypeScript settings (strict mode)
└── package.json              # Dependencies and scripts
```

## Styling

The project uses **Tailwind CSS** for utility classes. Dark mode is always active — the `class="dark"` attribute is set on the root `<html>` element in `src/app.html`.

### Color tokens

| Token | Value | Usage |
|---|---|---|
| `copper` | `#c8b89a` | Primary accent color |
| `copper-light` | `#d4c9b0` | Hover / light variant |
| `copper-dark` | `#a89878` | Active / dark variant |

### Font families

| Token | Typeface | Usage |
|---|---|---|
| `font-display` | Bebas Neue | Headlines |
| `font-sans` | DM Sans | Body text |
| `font-mono` | Space Mono | Flip-clock characters |

Fonts are loaded via Google Fonts in `src/app.html`.

### Background

The global background is a radial gradient defined in `src/app.postcss` — an ellipse from `#12121a` to `#0a0a0f` centered at 50% 40%.

### Reduced motion

The `prefers-reduced-motion` media query in `src/app.postcss` disables all CSS transitions globally when the user has requested reduced motion. Any new animated component must respect this automatically if it uses CSS transitions.

## Type checking

```bash
npm run check
```

Runs `svelte-check` with TypeScript in strict mode. This validates both `.svelte` and `.ts` files. The project uses bundler module resolution (`moduleResolution: "bundler"` in `tsconfig.json`).

## Adding a new component

1. Create a `.svelte` file in `src/lib/components/`
2. Import it with `$lib/components/YourComponent.svelte`
3. Use Tailwind utilities and the copper color tokens for consistent styling
4. Wrap any animations in a check for `prefers-reduced-motion` or use CSS transitions (handled globally)

## Adding a new route

1. Create a directory under `src/routes/` (e.g., `src/routes/projects/`)
2. Add a `+page.svelte` file in that directory
3. The static adapter pre-renders the route automatically at build time
4. Client-side navigation between routes is handled by SvelteKit's router

## CI/CD

The project uses a GitHub Actions workflow (`.github/workflows/build-and-push.yml`) on a self-hosted runner. On push to `main`:

1. Builds the Docker image using the multi-stage `Dockerfile`
2. Tags the image with the short commit SHA (immutable) and `latest`
3. Pushes both tags to an internal container registry
4. Clones the infrastructure GitOps repository and updates the deployment manifest
5. ArgoCD detects the manifest change and rolls the deployment

Concurrency controls cancel in-flight builds when a newer push arrives on the same ref. Registry credentials are stored as repository secrets.

## Environment variables

No environment variables are required for local development or production builds. The site is fully static.

The CI pipeline uses the following repository secrets (not needed locally):

| Secret | Purpose |
|---|---|
| `NEXUS_USERNAME` | Container registry authentication |
| `NEXUS_PASSWORD` | Container registry authentication |
| `FORGEJO_TOKEN` | Git access for GitOps image tag bump |
