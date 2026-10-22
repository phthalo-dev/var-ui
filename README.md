# var-ui

A design system monorepo powered by [Vite+](https://viteplus.dev/) and [Oxc](https://oxc.rs/) (Oxlint + Oxfmt).

## Prerequisites

Install the Vite+ CLI globally:

```bash
curl -fsSL https://vite.plus | bash
```

Restart your terminal, then verify with `vp help`.

Set up git hooks (one-time per clone):

```bash
vp config --hooks --no-agent
```

## Commands

Use `vp` for day-to-day workflow. Root `pnpm <script>` is an equivalent alias when a script exists below. Run `vp run` to list every available task.

| What you want              | `vp`                           | `pnpm` (alias)             |
| -------------------------- | ------------------------------ | -------------------------- |
| Install dependencies       | `vp install`                   | —                          |
| Format, lint, type-check   | `vp check`                     | `pnpm check`               |
| Auto-fix format and lint   | `vp check --fix`               | —                          |
| Run tests                  | `vp test run`                  | `pnpm test`                |
| Update test snapshots      | `vp test run -u`               | `pnpm test:update`         |
| Run core package tests     | `vp test run packages/core`    | `pnpm test:core`           |
| Update core snapshots      | `vp test run packages/core -u` | `pnpm test:core:update`    |
| Build publishable packages | `vp run build`                 | `pnpm build`               |
| Bundle budget checks       | `vp run test:bundle-budgets`   | `pnpm test:bundle-budgets` |
| Example Vite app           | `vp run dev`                   | `pnpm dev`                 |
| Docs site                  | `vp run docs:dev`              | `pnpm docs:dev`            |
| Full validation            | `vp run ready`                 | `pnpm ready`               |
| CI pipeline                | `vp run verify`                | `pnpm verify`              |
| List all tasks             | `vp run`                       | —                          |

Configuration lives in the root `vite.config.ts` — lint (Oxlint), formatting (Oxfmt), staged-file checks, Vitest projects, and task caching are all defined there. Per-package `vite.config.ts` files hold `vp pack` settings.

## Packages

| Package                     | Description                                    |
| --------------------------- | ---------------------------------------------- |
| `@var-ui/core`              | Framework-agnostic tokens and component styles |
| `@var-ui/react`             | React bindings (React Aria Components)         |
| `@var-ui/astro`             | Astro components (no React)                    |
| `@var-ui/docs`              | Astro documentation kit (`packages/docs`)      |
| `@var-ui/docs-components`   | Optional docs catalog plugin                   |
| `@var-ui/cli`               | Agent CLI: component docs, search, `init`      |
| `@var-ui/example-vite-app`  | Example consumer app (`examples/vite-app`)     |
| `@var-ui/example-astro-app` | Example Astro consumer (`examples/astro-app`)  |
| `@var-ui/docs-site`         | Documentation site (`docs/`)                   |

## Publishing

Versioning uses [Changesets](https://github.com/changesets/changesets). Add a changeset with `vp exec changeset` before merging user-facing changes. Stay on **0.x** until we intentionally ship a stable 1.0: use patch or minor changesets only (breaking 0.x changes are minor, never major). Internal `@var-ui/*` peers use `>=0.1.0 <1.0.0` so a minor bump does not look out of range. The release workflow publishes `@var-ui/core`, `@var-ui/react`, `@var-ui/icons`, `@var-ui/astro`, `@var-ui/docs`, `@var-ui/docs-components`, and `@var-ui/cli` to npm when changesets are merged on `main`. `@var-ui/astro`, `@var-ui/docs`, and `@var-ui/docs-components` ship source `.astro`/`.ts` files (no `vp pack` build step). `@var-ui/cli` is packed with `vp pack`.

## Agent integration

Consumers run `npx @var-ui/cli init` to write the Var UI block into their `AGENTS.md`. This repo’s [AGENTS.md](./AGENTS.md) remains Vite+ workflow notes for coding agents.
