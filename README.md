# React Demo

React 19 + TypeScript 5 + Tailwind CSS 4 starter template with strict type-checking,
pre-commit quality gates, and automated deployment to GitHub Pages.

---

## Quick Start

```sh
git clone <repo-url>
cd reactDemo
npm install
cp .env.example .env.local
# Edit .env.local with your values
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Available Scripts

| Command             | Description                                  |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Start Vite dev server with HMR               |
| `npm run build`     | Type-check then produce optimised `dist/`    |
| `npm run preview`   | Preview the production build locally         |
| `npm run lint`      | Run ESLint across all TypeScript files       |
| `npm run format`    | Format all files with Prettier               |
| `npm run test`      | Run Vitest in single-run mode                |
| `npm run test:ui`   | Open Vitest UI in the browser                |
| `npm run typecheck` | Run `tsc --noEmit` (full project type check) |

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

| Variable            | Required | Description                                                            |
| ------------------- | -------- | ---------------------------------------------------------------------- |
| `VITE_API_BASE_URL` | Yes      | Backend API base URL (no trailing slash), e.g. `http://localhost:8000` |
| `VITE_APP_TITLE`    | Yes      | Application title shown in the tab and homepage                        |

> `.env.local` is listed in `.gitignore` and will never be committed.

---

## Deployment (GitHub Pages)

Pushing to `main` automatically triggers the CI/CD pipeline:

1. **Type check** — `tsc --noEmit`
2. **Test** — `vitest run`
3. **Build** — `vite build` with `BASE_URL=/<repo-name>/`
4. **Deploy** — static files pushed to the `gh-pages` branch via `peaceiris/actions-gh-pages`

The live site is served from `https://<username>.github.io/<repo-name>/`.

> **Note:** The `gh-pages` branch is managed entirely by CI. Do not push to it manually.

### Enable GitHub Pages

In your repository settings: **Pages → Source → Deploy from a branch → `gh-pages` / `/ (root)`**.

---

## Pre-Commit Hook

Husky automatically installs a `.husky/pre-commit` hook via `npm run prepare`.
Every `git commit` triggers the following pipeline:

1. **lint-staged** — runs ESLint (--fix) and Prettier (--write) on staged `.ts`/`.tsx` files
2. **tsc --noEmit** — full-project type check; commit is aborted on any type error
3. **vitest run** — full test suite; commit is aborted if any test fails

To initialise the hook manually:

```sh
npm run prepare
```

---

## Project Structure

```
src/
├── components/ui/   # Reusable UI components (Button, ...)
├── pages/           # Page-level components mapped to routes
├── services/        # API fetch wrapper
├── types/           # Shared TypeScript interfaces
├── hooks/           # Custom React hooks
├── utils/           # Pure utility functions
├── test/            # Vitest setup and test utilities
├── App.tsx          # Root router (HashRouter)
├── main.tsx         # React entry point
└── index.css        # Tailwind CSS 4 import
```
