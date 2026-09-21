# Webflow Starter

Template for a Nominal Crew Webflow site: custom JS/CSS in the repo, the page in Webflow.

You work here. The other two packages are dependencies:

| Package                                                                            | Role                                                                    |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [webflow-loader](../webflow-loader)                                                | One script in Webflow. Picks localhost, staging CDN, or production CDN. |
| [@nominalcrew/webflow-kit](https://www.npmjs.com/package/@nominalcrew/webflow-kit) | Vite plugin + R2 upload.                                                |

## How a page loads

```text
Webflow page
  → loader.js (CDN)
      → ?nc-env=dev     → https://localhost:3000  (pnpm dev)
      → *.webflow.io    → cdn…/{name}/staging/bundle.*
      → custom domain   → cdn…/{name}/production/bundle.*
```

`name` comes from `webflow.config.js` and must match the loader `data-project`.

## Requirements

- Node.js 24+
- pnpm
- Git
- Cloudflare R2 credentials (to deploy)
- A published Webflow site with the loader snippet

## First setup

### 1. Install

```bash
pnpm install
```

### 2. Environment

```bash
cp .env.example .env
```

Fill at least:

```bash
WEBFLOW_STAGING_URL=https://your-site.webflow.io
```

For deploys, also fill the R2 variables (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`) and `PUBLIC_ASSET_URL` (passed to the plugin as `cdn`). Optional: `PROJECT_ID` if it should differ from `name` in `webflow.config.js`.

### 3. Project name

Set `name` in `webflow.config.js` to the site slug (R2 folder). Keep `assets` as `bundle.js` / `bundle.css` unless the loader attributes change too.

### 4. Webflow

Site Settings → Custom Code → Head — only this (replace the slug):

```html
<script src="https://cdn.nominalcrew.com/loader.js" data-project="webflow-starter"></script>
```

Do not add `bundle.js` or `bundle.css` in Webflow. Publish the site so the `.webflow.io` URL exists, then put that URL in `WEBFLOW_STAGING_URL`.

The CDN loader must be the version that understands `nc-env=dev`. If `?nc-env=dev` still loads staging files, deploy [webflow-loader](../webflow-loader) with `pnpm deploy:loader`.

## Daily development

```bash
pnpm dev
```

Vite starts on `https://localhost:3000` and opens `{WEBFLOW_STAGING_URL}?nc-env=dev`.

- CSS save → hot reload
- JS save → full page reload
- First run: if nothing loads, open `https://localhost:3000`, accept the certificate, reload the Webflow tab
- Stay on local files for the tab (`sessionStorage`) until you open `?nc-env=off`

Without `WEBFLOW_STAGING_URL`, Vite still runs and logs a warning; it does not open the browser.

## Share and go live

```bash
pnpm deploy:staging       # *.webflow.io, no ?nc-env=dev
pnpm deploy:production    # custom domain
```

Staging is unminified with sourcemaps. Production is minified. Neither includes a live-reload client.

Output before upload:

```text
dist/
├── bundle.js
└── bundle.css
```

## Quality checks

```bash
pnpm check        # lint + format check + production build
pnpm lint:js
pnpm lint:css
pnpm format
```

## Stack

Webflow, Vite, pnpm, Barba.js, GSAP, Lenis, ESLint, Stylelint, Prettier, Husky, lint-staged, Cloudflare R2, `@nominalcrew/webflow-kit`.

`vite.config.js` only passes `mode`, `webflow.config.js`, and `cdn` into `webflowKit()`. Options and env vars are documented in the [webflow-kit README](https://www.npmjs.com/package/@nominalcrew/webflow-kit).

## JavaScript architecture

### Core

```text
src/js/core/
```

Global infrastructure and dependencies. No project-specific components.

### Modules

```text
src/js/modules/
```

Project components and interactions (accordion, marquee, slider, …). Each module exposes an init function and is registered in `src/js/modules/index.js`.

```js
export function initAccordion() {
  // ...
}
```

### Page transitions

Barba uses `sync: true` (outgoing and incoming containers overlap during the GSAP transition). Override animations in `src/js/project/transition.js`. Lifecycle hooks live in `src/js/project/lifecycle.js` (`once`, `beforeEnter`, `afterEnter`).

In Webflow, use Barba attributes on the wrapper and container, and `data-barba-update` on persistent nav links when needed.

### Webflow forms

Webflow binds form handlers on full page load, so forms stop working once Barba swaps the container. `core/refresh.js` rebinds them after every visit, along with Cloudflare Turnstile widgets whose tokens go stale.

In Webflow:

1. **Site Settings → Apps & Integrations → Form integrations**: turn on "Bots are being blocked" and "Spam is being filtered".
2. **A form on every page.** Cloudflare only injects the Turnstile runtime when it finds a `data-turnstile-sitekey` in the DOM. If a page has no form, `window.turnstile` is undefined when the visitor navigates to a page that does have one. Add a hidden Webflow Form Block to the global footer to cover this. Not needed if the footer already contains a newsletter form.

IX2 is intentionally not reinitialised: animation is GSAP, and restarting IX2 would replay Webflow interactions on every navigation.

## CSS architecture

Keep custom CSS small. Most visual styling stays in Webflow.

```text
src/css/
├── main.css
├── core/
├── modules/
└── webflow/
```

Use custom CSS only when Webflow cannot reasonably handle the behavior.

## Rules

- Use ES modules.
- Do not add global variables.
- Keep `main.js` as an orchestrator.
- Keep reusable infrastructure inside `core/`.
- Keep project interactions inside `modules/`.
- Respect `prefers-reduced-motion`.
- Do not duplicate Webflow styling in CSS.
- Avoid unnecessary dependencies.
