# Var UI docs site migration to Astro

## Purpose

This SPEC defines the single migration plan for moving the Var UI docs site from the current placeholder `docs/` package into an Astro-based docs experience with multi-framework islands.

It supersedes the split planning between `ws_8b214768` and `ws_48e9c609` and is the authoritative planning artifact for this workstream.

## Scope

The docs site must:

- support a framework switcher for React, Angular, Vue, and Solid
- toggle the displayed code snippets to the selected framework
- render component examples in the selected framework using Astro islands
- preserve a single canonical docs information model that can drive both navigation and demos

## Merged backlog

The merged backlog is the union of both prior workstreams, with duplicates collapsed into one canonical list:

1. Choose Astro as the docs-site framework for var-ui.com and document the implications for the site architecture.
2. Replace the current placeholder `docs/` package with a real docs app implementation.
3. Define the framework-switching data model and how docs pages persist or derive the active framework.
4. Implement a framework switcher UI that updates snippets and examples together.
5. Provide framework adapters for React, Angular, Vue, and Solid.
6. Render each component example through Astro islands so demos are isolated by component/demo boundary.
7. Generate or author code snippets per framework from one source of truth.
8. Update routing and page structure for the docs site.
9. Add migration milestones covering foundation, adapters, snippets, island wiring, page migration, and release.
10. Define testing and QA coverage across all supported frameworks.
11. Add CI/CD checks and docs artifacts needed to keep the docs site healthy.
12. State acceptance criteria, success metrics, and risks with mitigations.
13. Produce one PR plan targeting `main` for the merged migration work.

## Architecture and data model

### Framework selection state

The docs app should treat the active framework as first-class page state. The SPEC should define one source of truth for framework selection, such as:

- URL segment or query parameter for shareable links
- persisted preference for return visits
- default framework when no preference is set

The framework selection model must be stable across navigation and easy to serialize so demos and snippets always remain in sync.

### Docs content model

Each docs page should carry enough structured metadata to render:

- component identity
- available demos/examples on the page
- framework-specific snippet payloads
- any props or demo variants needed to hydrate the island

Astro pages should consume this data model and pass only the minimum required props to the client islands.

## Framework adapters

### React adapter

The React adapter should define how React demos are mounted inside the Astro docs shell, how props flow into the demo component, and how snippet metadata is resolved for React output.

### Angular adapter

The Angular adapter should define the component wrapper or bootstrap contract needed to render Angular examples as islands, including any constraints around inputs, outputs, or template syntax.

### Vue adapter

The Vue adapter should define how Vue examples are loaded and hydrated inside the docs site, including any component registration or slot conventions needed for demos.

### Solid adapter

The Solid adapter should define the island mount contract for Solid examples and how props/state are passed into Solid demos without coupling them to other frameworks.

Each adapter must expose the same logical contract to the docs shell so the framework switcher can swap render targets without changing page-level behavior.

## Code snippet generation strategy

The SPEC should describe a single snippet-generation strategy with these requirements:

- one canonical example source per component/demo
- framework-specific snippet rendering derived from that source
- consistent formatting for imports, component names, and prop examples
- no divergence between the visible example and the snippet shown for the selected framework

The switcher must map one demo to four snippet outputs: React, Angular, Vue, and Solid. If snippets are generated, the generation pipeline must be deterministic and easy to review in PRs.

## Astro islands implementation plan

The docs site should use Astro islands at the component/demo level rather than making the whole site client-rendered.

The implementation plan should cover:

- one island per component/demo boundary
- hydration only where interaction is required
- isolation of framework-specific runtime code within the relevant island
- props/data passed from Astro page frontmatter into each island
- a repeatable pattern for adding new demos without rewriting the page architecture

The SPEC should note whether a page can host multiple islands and how the switcher coordinates state across them.

## Routing and structure changes

The docs site structure should evolve from the placeholder `repo/docs/` package into the Astro app location and content layout.

The plan should define:

- the docs app root and build entry points
- top-level route structure for component pages, guides, and landing pages
- shared layout components for nav, switcher, content chrome, and demo cards
- how current placeholder package files transition into the Astro implementation

## Migration milestones

Use a single ordered migration path:

1. Foundation: choose the Astro app skeleton, establish routing, and define the framework-selection model.
2. Adapters: implement React, Angular, Vue, and Solid rendering contracts.
3. Snippets: wire framework-specific snippet generation and display.
4. Islands: migrate representative component demos to per-demo Astro islands.
5. Page migration: move docs content into the new route/layout structure.
6. QA/release: validate docs builds, framework switching, and publish/update documentation artifacts.

## Testing and QA strategy across frameworks

The testing strategy should include validation for:

- docs build success
- framework switcher behavior
- snippet correctness for each supported framework
- rendering correctness of React, Angular, Vue, and Solid demos
- regression coverage for component/example pages after migration

The QA plan should include at least one representative example per framework and a check that the selected framework controls both the snippet and the rendered demo.

## CI/CD and documentation artifacts

The SPEC should call for updates to CI/CD so the docs site is validated alongside existing package checks.

It should include:

- docs build/test jobs in `.github/workflows/ci.yml`
- any docs-site lint or validation steps required by Astro
- generated or authored artifacts for docs authoring, if needed
- release or preview artifacts needed to review docs changes safely

## Acceptance criteria and success metrics

A complete migration is successful when:

- the docs site runs from Astro
- the framework switcher reliably changes both snippets and examples
- React, Angular, Vue, and Solid demos render correctly in their selected framework
- every component/example page uses the shared docs data model
- CI validates the docs site without manual steps
- the migration is documented well enough for future docs contributors to add demos without recreating the architecture

Success metrics should include build stability, zero mismatch between selected framework and displayed code, and predictable demo behavior across all supported frameworks.

## Risks and mitigations

### Multi-framework drift

Risk: snippet output or demo behavior diverges between frameworks.

Mitigation: keep one canonical example source and generate or review framework outputs from it.

### Hydration and performance complexity

Risk: too many client islands or large framework bundles slow the docs site.

Mitigation: keep islands scoped to the smallest useful demo boundary and hydrate only when necessary.

### Migration sequencing

Risk: moving pages before the adapters/snippets are ready creates gaps.

Mitigation: migrate foundation and adapters first, then snippets, then page content.

### Review complexity

Risk: a large multi-framework PR becomes difficult to validate.

Mitigation: keep the spec explicit about milestones, representative examples, and CI checks so implementation can be staged.

## PR plan

- Target branch: `main`
- PR shape: one merged PR for the SPEC and any directly related roadmap/backlog alignment needed for the migration
- Reviewers: docs/site owner plus maintainers for the core and framework packages
- Scope: limited to the migration SPEC and the planning artifacts it supersedes

## Next steps and duplicate-stream handling

- `ws_8b214768` remains the active owner for this merged migration plan.
- `ws_48e9c609` should be paused as a duplicate stream until this SPEC is reviewed.
- After review, retire or close the duplicate stream once its backlog is confirmed represented here.
- If implementation work begins, start from the Astro docs skeleton in `repo/docs/` rather than creating a new docs location.

## Notes on superseded planning

This SPEC intentionally resolves the earlier uncertainty in `ROADMAP.md` and `specs/theme-gallery.md` by committing the docs site plan to Astro for this workstream.

It also treats the existing `repo/docs/` package as the placeholder to expand, not a separate destination to replace later.
