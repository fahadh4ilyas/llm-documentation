# ~/llm-docs

LLM Documentation in Bahasa Indonesia — a single-page app built with HTML, vanilla JavaScript, and Tailwind CSS. Deployed via GitHub Pages at [fahadh.dev/LLM-Documentation](https://fahadh.dev/LLM-Documentation).

## Structure

- **SPA** with clean-path routing (`/persiapan-komputer/1-instalasi-nvidia-driver-cuda-toolkit`) + hash fallback
- **11 content pages** — Typora-exported HTML, CodeMirror cleaned at runtime
- **Sidebar** — navigation tree with sections and sub-pages
- **Bottom nav** — previous/center/next sequential navigation
- **Mobile** — swipe gestures, overlay sidebar, auto-close on link click

## Sections

| Section | Pages |
|---|---|
| Pendahuluan | 1 |
| Spesifikasi Komputer | 1 |
| Persiapan Komputer | 4 (index + 3 sub-pages) |
| Proses Load LLM | 1 |
| Proses Inference LLM | 3 (index + 2 sub-pages) |

## How Clean-Path Routing Works

The site uses path-based URLs (`/LLM-Documentation/pendahuluan`) instead of hash fragments for SEO. Since GitHub Pages is a static host:

1. **Direct visit hits 404** → `docs/404.html` redirects to `/#/path` via JavaScript
2. **Router loads page** from hash, then converts URL to clean path via `history.replaceState`
3. **Internal navigation** uses `pushState` — no page reload, no server request

## Features

- **Contact FAB** — floating button with modal form, Turnstile CAPTCHA, honeypot spam protection
- **Dark/light theme** — full overrides for sidebar, content, code blocks, tables
- **Responsive** — collapsible desktop sidebar, mobile overlay with swipe gestures

## Architecture

| File | Purpose |
|---|---|
| `js/app.js` | Router (hash + pathname), sidebar, bottom nav, content loader, mobile toggle |
| `js/data.js` | Navigation tree (NAVS, SIDENAVS, BOTTOMLINKS), PAGE_MAP, PAGE_META |
| `js/theme.js` | Dark/light toggle, Turnstile re-render on theme change |

## SEO

- `PAGE_META` in `data.js` provides per-page `<title>`, `<meta name="description">`, and `<meta name="keywords">`
- Clean-path URLs are indexable by Google (no hash fragments)

## CSS

Tailwind is pre-built into `docs/css/tailwind.min.css` (scanning all HTML/JS content). Custom styles live in `docs/css/theme.css` (content styling, sidebar, light theme, mobile). To rebuild:

```bash
npx tailwindcss -i tailwind.css -o docs/css/tailwind.min.css --minify
```

## Running Locally

```bash
npx live-server docs/
```

## Deployment

GitHub Pages from `docs/` on `master` branch. Served at `fahadh.dev/LLM-Documentation/` via the main site's custom domain.

---

> **Disclaimer:** Built with assistance from [DeepSeek](https://deepseek.com).
