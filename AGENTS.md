<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

# TypeStyles first

First-party UI chrome uses TypeStyles recipes (`typestyles.recipe`) and design tokens — not new `*.css` files or ad-hoc `@media` queries. Apply classes with `mergeProps` / `combine` from `typestyles` (re-exported by `@var-ui/react` and `@var-ui/astro`). Register site recipes in the TypeStyles extract entry. See `.cursor/rules/typestyles-first.mdc`.

## Browser tests

Files named `*.browser.test.ts(x)` in `packages/react` run in headless Chromium (Playwright, vitest browser mode) as the `browser` project; everything else is the `jsdom` project. Both run in one `vp test run` (and in `vp run ci` and the pre-push hook). Use them for platform behaviour jsdom cannot do (top layer, `:modal`, `popover`, focus, animations). Helpers: `src/test/browser.ts`; setup: `src/test/setup.browser.ts`. Filter with `vp test run --project browser|jsdom`.

One-time setup per machine: `pnpm exec playwright install chromium` (the test run fails with that hint if the browser is missing). CI installs and caches it in the Verify job.

## Running CI locally in Docker

`scripts/ci-docker.sh` runs the Verify job in an Ubuntu 24.04 container built from `docker/ci/Dockerfile` (Node from `.nvmrc`, pnpm from `packageManager`, Playwright Chromium with OS deps at the lockfile version). It rsyncs the working tree into a named volume, keeps `node_modules`, `dist` and the pnpm store in named volumes (the host's macOS `node_modules` are never used or written), runs `pnpm install --frozen-lockfile`, then `vp run ci` with `CI=true`. Use it to reproduce Linux-only failures, such as the 15px classic scrollbars and `scrollbar-gutter` that macOS overlay scrollbars hide, which break absolute-pixel geometry assertions in browser tests.

```sh
scripts/ci-docker.sh                       # the whole CI job
scripts/ci-docker.sh --browser Menu        # only the browser project (optional file filters), --repeat 2 to run twice
scripts/ci-docker.sh --shell               # interactive shell;  scripts/ci-docker.sh -- <command>  runs any command
scripts/ci-docker.sh --no-install | --fresh   # skip install | drop the cached volumes first
```

Failure screenshots from `--browser` land in `.vitest-linux/` (gitignored). Assert relative geometry (popup rect vs anchor rect vs `viewport()`), not absolute pixels.

## CI/CD

All three repos (`typestyles`, `var-ui`, `homeslate`) use the same pipeline. Everything lives in `.github/workflows/ci.yml`.

- **Verify** is the status check to require on `main`. It runs `vp run ci`, the same command the pre-push hook runs, so run it before pushing. `@var-ui/core`, `react`, `icons` and `cli` are built (`dist`); the Astro packages ship source.
- **Release** runs on `main` after `Verify`. It reuses the `dist` that `Verify` built, mints a token from the GitHub App (so the version PR and tags trigger CI), and runs the changesets action.
- **Deploy docs / Preview docs** build the docs site with the Netlify CLI (`netlify deploy --build`) and deploy it: production after `Verify` on `main`, a `deploy-preview-<PR>` alias with a sticky comment on same-repo PRs. They only run when docs or the packages they use changed (the `Changes` job). Netlify's own git builds are turned off (`ignore = "exit 0"` in `netlify.toml`).

### Releasing

1. Add a changeset (`pnpm changeset`) to any PR that changes a published package.
2. After merge, Release opens a `chore: version packages` PR. `Verify` runs on it. Merge it to publish.
3. Publishing uses **npm trusted publishing (OIDC)** with provenance. There is no `NPM_TOKEN`. Each package's trusted publisher is `phthalo-dev/var-ui` with workflow **`ci.yml`**, so do not rename that file or move the release job.
4. A **new package** needs one manual first publish, then: `npm trust github <pkg> --repo phthalo-dev/var-ui --file ci.yml --allow-publish --allow-stage-publish -y`.

### Things that bite

- Git hooks live in `.vite-hooks/` (a main-branch guard and `vp staged` on commit, `vp run ci` on push). They exit early when `CI` is set; the release job commits and pushes tags, and must not re-run them.
- Generated `CHANGELOG.md` files are excluded from formatting; changesets does not format them.
- Do not set `registry-url` on `setup-vp`: it writes a placeholder auth token that blocks OIDC. The release job also installs `npm@^11.5.1` (trusted publishing needs it; npm 12 rejects flags pnpm forwards).
- Secrets: `APP_CLIENT_ID` and `APP_PRIVATE_KEY` (GitHub App) are org secrets, with `NETLIFY_AUTH_TOKEN`; `NETLIFY_SITE_ID` is a repo secret.
- Node comes from `.nvmrc`; pnpm from `packageManager`. Do not repeat versions in workflow YAML.
