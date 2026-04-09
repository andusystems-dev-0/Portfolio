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
1. **Builder** — Node 20 Alpine installs dependencies and runs the production build
2. **Runtime** — nginx-unprivileged 1.27 Alpine serves the static output on port 8080

The container runs as a non-root user.

## Project Layout

```
├── src/
│   ├── app.html            # HTML template (meta tags, fonts, dark mode)
│   ├── app.postcss          # Global CSS (Tailwind directives, background)
│   ├── app.d.ts             # SvelteKit ambient types
│   ├── lib/
│   │   └── components/      # Reusable Svelte components
│   │       ├── FlipChar.svelte
│   │       ├── FlipText.svelte
│   │       ├── Hero.svelte
│   │       └── Nav.svelte
│   └── routes/
│       ├── +layout.svelte   # Root layout
│       ├── +layout.ts       # Prerender + CSR config
│       └── +page.svelte     # Homepage
├── static/                  # Served as-is (favicon, robots.txt)
├── Dockerfile               # Multi-stage container build
├── nginx.conf               # Production nginx configuration
├── svelte.config.js         # SvelteKit + static adapter config
├── tailwind.config.js       # Tailwind theme (copper palette, fonts)
├── postcss.config.js        # PostCSS processors
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript settings
└── package.json             # Dependencies and scripts
```

## Styling

The project uses **Tailwind CSS** with the **Skeleton UI** component library.

Key theme customizations in `tailwind.config.js`:

| Token           | Value                        | Usage                          |
|-----------------|------------------------------|--------------------------------|
| `copper`        | `#c8b89a`                    | Primary accent color           |
| `copper-light`  | `#d4c9b0`                    | Hover/light accent variant     |
| `copper-dark`   | `#a89878`                    | Active/dark accent variant     |
| `font-display`  | Bebas Neue                   | Headlines                      |
| `font-sans`     | DM Sans                      | Body text                      |
| `font-mono`     | DM Mono                      | Flip-clock characters          |

Dark mode is enabled via the `class` strategy (`darkMode: 'class'` in Tailwind config), and the HTML shell sets `class="dark"` on the root element.

## Type Checking

```bash
npm run check
```

Runs `svelte-check` with TypeScript in strict mode. This validates both `.svelte` and `.ts` files.

## Adding a New Component

1. Create a `.svelte` file in `src/lib/components/`
2. Import it from `$lib/components/YourComponent.svelte`
3. Use Tailwind utilities and the copper color tokens for consistent styling
4. Respect `prefers-reduced-motion` for any animations

## Adding a New Route

1. Create a directory under `src/routes/` (e.g., `src/routes/projects/`)
2. Add a `+page.svelte` file in that directory
3. The static adapter will pre-render the new route automatically

## Environment Variables

No environment variables are required for development or production. The site is fully static with no external service dependencies.
