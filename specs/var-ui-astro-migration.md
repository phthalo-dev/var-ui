# Var UI Docs Site Migration to Astro

> Note: a temporary root-level `specs/var-ui-astro-migration.md` copy was mentioned in review notes, but the canonical work product for this repository is the file under `repo/specs/var-ui-astro-migration.md`.

Implements `ROADMAP.md` V5's docs-site direction work while consolidating the overlapping planning from `ws_48e9c609` and `ws_8b214768` into a single backlog and a single delivery track.

**Status: planned.** This is the merged migration SPEC for the future var-ui docs site, not an implementation record.

---

## Why this exists

The current `docs/` package is only a placeholder, so the migration needs to define the docs architecture from scratch instead of adapting an existing site. The goal is a public docs experience built on Astro that can host multi-framework islands and let readers switch between React, Angular, Vue, and Solid examples without leaving the page.

This SPEC also intentionally merges the duplicate stream planning into one execution path:

- one backlog,
- one milestone sequence,
- one branch,
- one PR to `main`,
- one push to `origin`.

---

## Scope

This migration covers the docs-site foundation and content architecture, including:

- framework switching for React / Angular / Vue / Solid,
- Astro islands integration strategy,
- per-framework adapters,
- code snippet generation,
- routing and docs structure changes,
- migration milestones,
- testing and QA,
- CI/CD considerations,
- acceptance criteria,
- risks and mitigations.

It does **not** define product changes to component behavior or token generation; the work here is about how the docs site presents var-ui.

---

## Target architecture

### 1) Framework switching model

The docs site should expose a shared framework-selection state that every docs page and example can read.

Requirements:

- Supported values: `react`, `angular`, `vue`, `solid`.
- The selected framework should control both the visible code snippet and the framework-specific interactive demo, where one exists.
- The default selection must be SSR-safe so the initial render matches what Astro sends to the browser.
- The selection should persist across page views so a reader does not have to re-select on every route.
- Framework selection should be consumable by docs content, examples, and any nav-level switcher.

Implementation direction:

- Treat the framework choice as a single source of truth passed through the page shell and read by islands/components.
- Prefer URL-friendly state propagation where practical, with a client-side fallback for persistence if the site needs it.
- Keep the selection model framework-agnostic so all examples receive the same selected value shape.

### 2) Astro islands integration strategy

Astro should own the page shell, routing, content layout, and static doc delivery. Hydrated islands should be limited to the interactive parts that truly need client-side behavior.

Island boundaries should include:

- the framework switcher,
- interactive example previews,
- code-block toggles or tabbed snippet presenters,
- any playground-like controls that update framework-specific output.

Static Astro content should include:

- docs prose,
- route structure,
- headings and navigation,
- page chrome,
- metadata and SEO content,
- non-interactive reference content.

Hydration guidance:

- Do not hydrate whole pages when a small control surface is enough.
- Keep island boundaries narrow so a docs page stays mostly static.
- Share selection state between islands without forcing the full docs shell to hydrate.

### 3) Per-framework adapters

Each framework needs an adapter layer that turns one canonical example definition into framework-specific render output.

Adapter responsibilities:

- map canonical example metadata to the framework's component surface,
- render or describe the demo entrypoint for that framework,
- provide framework-specific snippet text,
- carry any framework-specific import or bootstrap details,
- keep variant names and props aligned across frameworks.

Adapter shape:

- one adapter contract,
- one implementation per framework,
- one canonical example description consumed by all adapters.

This avoids hand-writing four unrelated versions of the same example and reduces drift when the docs team updates a component sample.

### 4) Code snippet generation approach

Snippet generation should come from a single source of truth so React, Angular, Vue, and Solid snippets stay synchronized.

Requirements:

- Snippets must be generated from canonical example data, not copied manually between pages.
- Each framework's snippet should reflect that framework's idioms and imports.
- Snippet output should stay consistent with the rendered example shown alongside it.
- The generator should support shared metadata such as component name, props, slots, events, and imports.

Recommended approach:

- Define a canonical example schema.
- Feed that schema into framework-specific snippet renderers.
- Validate that every supported framework can produce a snippet for each documented example.
- Treat snippet generation as part of the docs content pipeline, not ad hoc page markup.

### 5) Routing and docs structure changes

Astro should host the docs with a content structure that is predictable and easy to extend.

Planned structure changes:

- docs routes should map cleanly to Astro pages or content collections,
- component/reference content should be organized by docs type rather than by framework variant,
- framework choice should be an interaction state, not a route explosion,
- shared docs layouts should provide the shell for side nav, in-page nav, and example blocks,
- example content should be reusable across routes instead of re-authored per page.

The key constraint is that the documentation hierarchy should stay about product meaning and task flow, not about duplicating the same page four times for four frameworks.

---

## Milestones and backlog

This is the single backlog for both planning streams.

### Milestone 1 — Discovery and content model

- confirm docs-site scope and information architecture,
- define canonical example schema,
- define the framework-switch state contract,
- identify the minimum set of docs routes to migrate first.

### Milestone 2 — Astro shell and routing foundation

- create the Astro docs shell,
- wire navigation and shared layouts,
- establish route/content collection conventions,
- add the framework switcher entry point.

### Milestone 3 — Adapter layer and snippet pipeline

- implement per-framework adapters,
- connect snippet generation to the canonical example schema,
- verify all four frameworks can render the same example metadata.

### Milestone 4 — Content migration and docs parity

- migrate existing docs content into the Astro structure,
- attach examples and snippets to their pages,
- align navigation, anchors, and page metadata.

### Milestone 5 — QA, CI/CD, and release readiness

- validate docs rendering in all four frameworks,
- add build/test coverage for snippet generation and route presence,
- confirm preview deployment and release gating,
- finalize acceptance review.

### Backlog ordering rule

If the merged work uncovers duplicate tasks from the two original streams, keep one canonical task and close the duplicate as a planning duplicate rather than parallelizing it.

---

## Testing and QA

The migration needs validation at three levels:

1. **Content checks** — markdown/doc presence, route completeness, and example coverage.
2. **Rendering checks** — the Astro docs shell renders, routes resolve, and framework switching updates snippets/examples correctly.
3. **Cross-framework QA** — React, Angular, Vue, and Solid all show equivalent documentation output for the same canonical example.

Recommended verification matrix:

- framework switcher defaults correctly on first load,
- changing the framework updates both snippets and rendered example output,
- each supported framework has a valid adapter,
- docs routes build without broken links,
- static pages remain static where possible, with islands confined to interactive controls,
- preview builds and production builds both succeed.

Manual QA should include a spot-check of a representative component page in every framework.

---

## CI/CD considerations

The docs migration should be treated as a site-delivery change, not a library-only change.

CI/CD should account for:

- install/build steps for the docs app,
- any framework-specific dependencies needed by the example adapters,
- build matrix coverage if different example renderers require it,
- preview deployment for reviewable docs changes,
- release gating so broken snippets or routes cannot land unnoticed.

Because this repo's standard workflow favors Vite+/task-based checks, the final verification set should include the repo-standard markdown/file-presence validation plus whatever docs-site build or preview command is available when the implementation lands.

---

## Acceptance criteria

The migration is acceptable when all of the following are true:

- `docs/` is a real Astro-based docs site, not a placeholder package.
- A framework switcher exposes React, Angular, Vue, and Solid.
- The selected framework changes both snippet output and the associated rendered example where applicable.
- Astro owns the page shell and routing, while islands are used only for the interactive pieces.
- Snippet generation comes from one canonical example model.
- The docs structure supports content reuse without duplicating every page four times.
- The migration has an agreed milestone path from discovery through release readiness.
- QA covers all supported frameworks.
- CI/CD validates docs builds and route/snippet integrity.
- The work lands as one PR to `main` and is pushed to `origin`.

---

## Risks and mitigations

### Risk: adapter drift between frameworks

If adapters are hand-maintained without a canonical source, React, Angular, Vue, and Solid examples can drift apart.

**Mitigation:** use a shared example schema and generate framework outputs from it.

### Risk: hydration overhead

Hydrating the full docs page would undermine Astro's benefit and complicate performance.

**Mitigation:** keep hydration islands narrow and restrict them to the switcher and interactive example surfaces.

### Risk: Angular integration complexity

Angular examples may require bootstrap or module details that differ from the other frameworks.

**Mitigation:** define the adapter contract to include framework-specific bootstrap metadata instead of forcing a one-size-fits-all snippet.

### Risk: content migration regressions

Moving docs content into a new structure can break routes, anchors, or navigation.

**Mitigation:** migrate routes incrementally and verify old-to-new parity during each milestone.

### Risk: snippet-source divergence

If snippets are authored manually, they will eventually disagree with rendered demos.

**Mitigation:** generate snippets from canonical example definitions and test each framework output.

---

## Delivery and git plan

This merged migration should be delivered as one branch and one PR to `main`.

Intended git flow:

1. start from `main`,
2. add or update `specs/var-ui-astro-migration.md`,
3. commit the SPEC with a focused message,
4. push the branch to `origin`,
5. open one PR targeting `main`.

The repo should not split the migration into separate competing SPEC outputs for the two original workstreams.

---

## Verification checklist

After writing this SPEC, verify:

- the file exists at `repo/specs/var-ui-astro-migration.md`,
- the document covers framework switching, Astro islands, adapters, snippet generation, routing/docs structure, milestones, testing/QA, CI/CD, acceptance criteria, risks, and the single-PR plan,
- markdown formatting is sane and the document is readable end to end,
- `git status` shows only the intended SPEC file.

If repo tooling is available for a markdown/spec-only change, run the repo-standard validation commands; otherwise use file-presence and content review as the authoritative checks.
