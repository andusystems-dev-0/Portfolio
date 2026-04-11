# Development Guide

## Prerequisites

| Tool    | Version | Notes                          |
|---------|---------|--------------------------------|
| Node.js | 20+     | Required for build and dev     |
| npm     | 9+      | Comes with Node.js 20          |
| Docker  | 20+     | Optional, for container builds |

## Local Development Setup

```bash
# Clone the repository
git clone <repository-url> && cd Portfolio

# Install dependencies
npm install

# Start the dev server (with hot-reload)
npm run dev
```

The dev server starts on `http://localhost:5173` by default (Vite will pick the next available port if 5173 is in use).

## Available Scripts

| Command            | Description                                         |
|--------------------|-----------------------------------------------------|
| `npm run dev`      | Start Vite dev server with hot module replacement    |
| `npm run build`    | Production build via SvelteKit static adapter        |
| `npm run preview`  | Serve the production build locally for verification  |
| `npm run check`    | Run `svelte-check` for TypeScript and Svelte errors  |

## Build

```bash
npm run build
```

Output is written to the `build/` directory as static HTML, CSS, and JS files. The SvelteKit static adapter pre-renders all routes.

To preview the production build:

```bash
npm run preview
```

## Docker Build

```bash
# Build the image
docker build -t portfolio .

# Run the container
docker run -p 8080:8080 portfolio
```

The Docker build is a two-stage process:

1. **Builder** — Node 20 Alpine installs dependencies (`npm ci`) and runs the production build
2. **Runtime** — nginx-unprivileged 1.27 Alpine serves the static output on port 8080

The container runs as a non-root user (uid 101). The nginx configuration includes SPA fallback routing, gzip compression, and immutable asset caching.

## Project Layout

```
├── src/
│   ├── app.html            # HTML template (meta tags, fonts, dark mode)
│   ├── app.postcss          # Global CSS (Tailwind directives, background gradient)
│   ├── app.d.ts             # SvelteKit ambient types
│   ├── lib/
│   │   └── components/      # Reusable Svelte components
│   │       ├── FlipChar.svelte   # Individual 3D flip-card character
│   │       ├── FlipText.svelte   # Flip-clock role cycler
│   │       ├── Hero.svelte       # Hero section with animations
│   │       └── Nav.svelte        # Top navigation bar
│   └── routes/
│       ├── +layout.svelte   # Root layout (imports global styles)
│       ├── +layout.ts       # Prerender + CSR config
│       └── +page.svelte     # Homepage (Nav + Hero)
├── static/                  # Served as-is (favicon, robots.txt)
├── docs/                    # Project documentation
├── Dockerfile               # Multi-stage container build
├── nginx.conf               # Production nginx configuration
├── svelte.config.js         # SvelteKit + static adapter config
├── tailwind.config.js       # Tailwind theme (copper palette, fonts)
├── postcss.config.js        # PostCSS processors (Tailwind + Autoprefixer)
├── vite.config.ts           # Vite configuration with SvelteKit plugin
├── tsconfig.json            # TypeScript settings (strict mode)
└── package.json             # Dependencies and scripts
```

## Styling

The project uses **Tailwind CSS** with the **Skeleton UI** component library.

### Color Tokens

| Token           | Value       | Usage                      |
|-----------------|-------------|----------------------------|
| `copper`        | `#c8b89a`   | Primary accent color       |
| `copper-light`  | `#d4c9b0`   | Hover / light variant      |
| `copper-dark`   | `#a89878`   | Active / dark variant      |

### Font Families

| Token          | Typeface    | Usage                |
|----------------|-------------|----------------------|
| `font-display` | Bebas Neue  | Headlines            |
| `font-sans`    | DM Sans     | Body text            |
| `font-mono`    | DM Mono     | Flip-clock characters |

Fonts are loaded via Google Fonts in `src/app.html`.

### Dark Mode

Dark mode is enabled via the `class` strategy (`darkMode: 'class'` in `tailwind.config.js`). The HTML shell in `src/app.html` sets `class="dark"` on the root element.

### Background

The global background is a radial gradient defined in `src/app.postcss` — an ellipse from `#12121a` to `#0a0a0f` centered at 50% 40%.

## Type Checking

```bash
npm run check
```

Runs `svelte-check` with TypeScript in strict mode. This validates both `.svelte` and `.ts` files. The project uses bundler module resolution (`moduleResolution: "bundler"` in `tsconfig.json`).

## Adding a New Component

1. Create a `.svelte` file in `src/lib/components/`
2. Import it from `$lib/components/YourComponent.svelte`
3. Use Tailwind utilities and the copper color tokens for consistent styling
4. Respect `prefers-reduced-motion` for any animations — the global styles in `app.postcss` disable transitions when the user preference is set

## Adding a New Route

1. Create a directory under `src/routes/` (e.g., `src/routes/projects/`)
2. Add a `+page.svelte` file in that directory
3. The static adapter will pre-render the new route automatically
4. Client-side navigation between routes is handled by SvelteKit's router

## CI/CD

The project includes a GitHub Actions workflow (`.github/workflows/build-and-push.yml`) that runs on a self-hosted runner. On push to `main`:

1. Builds the Docker image using the multi-stage `Dockerfile`
2. Tags the image with the short commit SHA (immutable) and `latest`
3. Pushes both tags to an internal container registry
4. Clones the infrastructure GitOps repository and updates the deployment manifest with the new image tag
5. ArgoCD detects the manifest change and rolls the deployment

The workflow uses concurrency controls — newer pushes to the same ref cancel in-flight builds. Registry credentials are stored as repository secrets.

## Environment Variables

No environment variables are required for local development or production builds. The site is fully static with no external service dependencies.

The CI pipeline uses the following repository secrets (not needed for local development):

| Secret | Purpose |
|--------|---------|
| `NEXUS_USERNAME` | Container registry authentication |
| `NEXUS_PASSWORD` | Container registry authentication |
| `FORGEJO_TOKEN`  | Git access for GitOps image tag bump |
