# Webflow Starter

Generic development starter for Webflow projects.

## Stack

- Webflow
- Vite
- pnpm
- Barba.js
- GSAP
- Lenis
- ESLint
- Stylelint
- Prettier
- Husky
- lint-staged
- Cloudflare R2

## Requirements

- Node.js 24+
- pnpm
- Git

## Installation

```bash
pnpm install
```

## Development

Default workflow (staging CDN, Odyn-style): watch sources, rebuild on save, upload
to R2 staging automatically. Webflow staging must load assets from your CDN
(`PUBLIC_ASSET_URL` + `R2_STAGING_PREFIX`). Refresh the page after each upload;
there is no in-browser live reload on Webflow.

```bash
pnpm dev
```

Optional local Vite server (localhost HMR, no R2 upload):

```bash
pnpm dev:local
```

```text
http://localhost:3000/src/js/main.js
```

Point Webflow custom code at that URL only on your machine.

## Build

```bash
pnpm build
```

Production assets are generated in:

```text
dist/
├── main.js
└── main.css
```

## Quality checks

Run all checks:

```bash
pnpm check
```

JavaScript:

```bash
pnpm lint:js
```

CSS:

```bash
pnpm lint:css
```

Format:

```bash
pnpm format
```

## Deployment

One-off staging upload (same output as `pnpm dev`, without watch):

```bash
pnpm deploy:staging
```

Production (explicit only, minified):

```bash
pnpm deploy:production
```

## JavaScript architecture

### Core

```text
src/js/core/
```

Contains global infrastructure and dependencies.

Core files should not contain project-specific components.

### Modules

```text
src/js/modules/
```

Contains project components and interactions.

Examples:

```text
accordion.js
marquee.js
scroll-reveal.js
slider.js
video-player.js
```

Each module should expose an initialization function.

Example:

```js
export function initAccordion() {
  // ...
}
```

The module must then be registered inside:

```text
src/js/modules/index.js
```

### Page transitions

Barba handles navigation with `sync: true` (outgoing and incoming containers
overlap during the GSAP transition). Override animations in
`src/js/project/transition.js`. Lifecycle hooks live in
`src/js/project/lifecycle.js` (`once`, `beforeEnter`, `afterEnter`).

In Webflow, use Barba attributes on the wrapper and container, and
`data-barba-update` on persistent nav links when needed.

### Webflow forms

Webflow binds its form handlers on full page load, so forms stop working once
Barba swaps the container. `core/refresh.js` rebinds them after every visit,
along with the Cloudflare Turnstile widgets whose tokens go stale.

Two settings are required in Webflow itself:

1. **Site Settings → Apps & Integrations → Form integrations**: turn on
   "Bots are being blocked" and "Spam is being filtered".
2. **A form on every page.** Cloudflare only injects the Turnstile runtime when
   it finds a `data-turnstile-sitekey` in the DOM. If a page has no form,
   `window.turnstile` is undefined when the visitor navigates to a page that
   does have one. Add a hidden Webflow Form Block to the global footer to cover
   this. Not needed if the footer already contains a newsletter form.

IX2 is intentionally not reinitialised: all animation is handled by GSAP, and
restarting IX2 would replay Webflow interactions on every navigation.

## CSS architecture

Custom CSS is kept intentionally small.

Most visual styling should remain inside Webflow.

```text
src/css/
├── variables.css
├── global.css
├── components.css
└── main.css
```

Use custom CSS only when Webflow cannot reasonably handle the required behavior.

## Rules

- Use ES modules.
- Do not add global variables.
- Keep `main.js` as an orchestrator.
- Keep reusable infrastructure inside `core/`.
- Keep project interactions inside `modules/`.
- Respect `prefers-reduced-motion`.
- Do not duplicate Webflow styling in CSS.
- Avoid unnecessary dependencies.
