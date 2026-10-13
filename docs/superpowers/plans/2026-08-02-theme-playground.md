# Theme Playground v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `/theming/playground` — preset theme picker, live `BentoShowcase` preview, viewport toggle, and TypeScript code export.

**Architecture:** React island with `DesignSystemProvider` color-mode sync (same as `HomepageIsland`). Controls sidebar left, preview right. State drives preset selection and viewport; `generateThemeCode()` mirrors `buttonCode.ts`. Reuses `SHOWCASE_THEMES`, `ThemeShowcaseSwitcher`, `BentoShowcase`, and `ComponentConfigurator` layout patterns.

**Tech Stack:** Astro MDX, React islands (`client:load`), TypeStyles (`typestyles.recipe`), `@var-ui/react`, Vite+ (`vp test`, `vp check`).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-02-theme-playground-design.md` (v1 scope only)
- Run `vp check` and `vp test` after each task
- Preview uses `BentoShowcase` — no new preview templates in v1
- Color mode syncs with site header via `theme-mode` localStorage + `data-mode` `MutationObserver`
- No runtime `createDesignTheme()` in browser — preset `className` only in v1
- No token editing UI in v1 — export is static preset code only
- Follow existing docs patterns: `ButtonConfigurator.astro`, `configurator.ts` styles, `buttonCode.test.ts`

---

## File map

| File                                                             | Responsibility                                        |
| ---------------------------------------------------------------- | ----------------------------------------------------- |
| `docs/src/components/theme-playground/themePlaygroundState.ts`   | State type + defaults                                 |
| `docs/src/components/theme-playground/generateThemeCode.ts`      | State → TypeScript export string                      |
| `docs/src/components/theme-playground/generateThemeCode.test.ts` | Export code tests                                     |
| `docs/src/styles/themePlayground.ts`                             | Layout recipe (controls left, preview right)          |
| `docs/src/styles/index.ts`                                       | Register theme playground styles                      |
| `docs/src/components/theme-playground/ThemePlayground.tsx`       | Main island: layout + state + export button           |
| `docs/src/components/ThemePlayground.astro`                      | Astro wrapper (`client:load`)                         |
| `docs/src/components/theme-playground/ThemePlayground.test.tsx`  | Island integration tests                              |
| `docs/content/theming/playground.mdx`                            | Page content                                          |
| `docs/src/data/navigation.ts`                                    | Sidebar link                                          |
| `docs/src/pages/theming/[slug].astro`                            | Full-width layout for playground slug                 |
| `docs/src/components/homepage/showcaseThemes.ts`                 | Shared `SHOWCASE_THEMES` export (moved from switcher) |

---

### Task 1: Shared showcase theme registry + state types

**Files:**

- Create: `docs/src/components/homepage/showcaseThemes.ts`
- Modify: `docs/src/components/homepage/ThemeShowcaseSwitcher.tsx` — import from `showcaseThemes.ts`
- Modify: `docs/src/components/homepage/BentoShowcase.tsx` — import from `showcaseThemes.ts`
- Create: `docs/src/components/theme-playground/themePlaygroundState.ts`

**Interfaces:**

- Produces: `SHOWCASE_THEMES`, `ShowcaseThemeId` from `showcaseThemes.ts`
- Produces: `ThemePlaygroundState`, `DEFAULT_THEME_PLAYGROUND_STATE` from `themePlaygroundState.ts`

```ts
// themePlaygroundState.ts
import type { ShowcaseThemeId } from '../homepage/showcaseThemes';

export type ThemePlaygroundViewport = 'desktop' | 'mobile';

export type ThemePlaygroundState = {
  presetId: ShowcaseThemeId;
  viewport: ThemePlaygroundViewport;
};

export const DEFAULT_THEME_PLAYGROUND_STATE: ThemePlaygroundState = {
  presetId: 'default',
  viewport: 'desktop',
};
```

- [ ] **Step 1: Move `SHOWCASE_THEMES` to `showcaseThemes.ts`**

Cut `ShowcaseThemeId`, `SHOWCASE_THEMES`, and theme imports from `ThemeShowcaseSwitcher.tsx` into `showcaseThemes.ts`. Re-export types. Update switcher and bento to import from there.

- [ ] **Step 2: Create `themePlaygroundState.ts`**

Add state type and default as shown above.

- [ ] **Step 3: Run tests for homepage (no regressions)**

Run: `vp test docs/src/components/homepage`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add docs/src/components/homepage/showcaseThemes.ts \
  docs/src/components/homepage/ThemeShowcaseSwitcher.tsx \
  docs/src/components/homepage/BentoShowcase.tsx \
  docs/src/components/theme-playground/themePlaygroundState.ts
git commit -m "refactor(docs): share showcase theme registry for playground"
```

---

### Task 2: Theme code generation

**Files:**

- Create: `docs/src/components/theme-playground/generateThemeCode.ts`
- Create: `docs/src/components/theme-playground/generateThemeCode.test.ts`

**Interfaces:**

- Consumes: `ThemePlaygroundState`, `SHOWCASE_THEMES` / `ShowcaseThemeId`
- Produces: `generateThemeCode(state): { code: string; language: string; filename: string }`

- [ ] **Step 1: Write failing tests**

```ts
// generateThemeCode.test.ts
import { describe, expect, it } from 'vite-plus/test';
import { generateThemeCode } from './generateThemeCode';
import { DEFAULT_THEME_PLAYGROUND_STATE } from './themePlaygroundState';

describe('generateThemeCode', () => {
  it('exports default theme class usage', () => {
    const { code, filename, language } = generateThemeCode(DEFAULT_THEME_PLAYGROUND_STATE);
    expect(language).toBe('ts');
    expect(filename).toBe('theme.ts');
    expect(code).toContain('defaultThemeClassName');
    expect(code).toContain('@var-ui/core');
  });

  it('exports createDesignTheme from preset for forest', () => {
    const { code } = generateThemeCode({
      ...DEFAULT_THEME_PLAYGROUND_STATE,
      presetId: 'forest',
    });
    expect(code).toContain('createDesignTheme');
    expect(code).toContain('forestPreset');
    expect(code).toContain("name: 'forest'");
  });

  it('exports ai-glow preset', () => {
    const { code } = generateThemeCode({
      ...DEFAULT_THEME_PLAYGROUND_STATE,
      presetId: 'ai-glow',
    });
    expect(code).toContain('aiGlowPreset');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `vp test docs/src/components/theme-playground/generateThemeCode.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement `generateThemeCode.ts`**

```ts
import type { ThemePlaygroundState } from './themePlaygroundState';
import type { ShowcaseThemeId } from '../homepage/showcaseThemes';

const PRESET_EXPORTS: Record<
  Exclude<ShowcaseThemeId, 'default'>,
  { preset: string; name: string }
> = {
  forest: { preset: 'forestPreset', name: 'forest' },
  rose: { preset: 'rosePreset', name: 'rose' },
  amber: { preset: 'amberPreset', name: 'amber' },
  'ai-glow': { preset: 'aiGlowPreset', name: 'ai-glow' },
  'new-wave': { preset: 'newWavePreset', name: 'new-wave' },
  'windows-95': { preset: 'windows95Preset', name: 'windows-95' },
  'classic-system': { preset: 'classicSystemPreset', name: 'classic-system' },
};

export function generateThemeCode(state: ThemePlaygroundState): {
  code: string;
  language: string;
  filename: string;
} {
  if (state.presetId === 'default') {
    return {
      code: `import { defaultThemeClassName } from '@var-ui/core';

// Default theme is registered when you import '@var-ui/core'.
// Apply to your app root:
export const themeClassName = defaultThemeClassName;`,
      language: 'ts',
      filename: 'theme.ts',
    };
  }

  const entry = PRESET_EXPORTS[state.presetId];
  const importPath = `./themes/${entry.name}`;

  return {
    code: `import { createDesignTheme } from '@var-ui/core';
import { ${entry.preset} } from '${importPath}';

export const ${entry.name.replace(/-/g, '')}Theme = createDesignTheme({
  name: '${entry.name}',
  ...${entry.preset},
});`,
    language: 'ts',
    filename: 'theme.ts',
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `vp test docs/src/components/theme-playground/generateThemeCode.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add docs/src/components/theme-playground/generateThemeCode.ts \
  docs/src/components/theme-playground/generateThemeCode.test.ts
git commit -m "feat(docs): add theme playground code generator"
```

---

### Task 3: Theme playground layout styles

**Files:**

- Create: `docs/src/styles/themePlayground.ts`
- Modify: `docs/src/styles/index.ts`

**Interfaces:**

- Produces: `themePlaygroundStyles()` — slots: `root`, `workspace`, `controls`, `preview`, `previewInner`, `previewFrame`, `previewFrameMobile`, `toolbar`, `code`, `controlGroup`, `controlLabel`

- [ ] **Step 1: Create `themePlayground.ts`**

Mirror `configurator.ts` but flip columns (`15rem 1fr` → controls first):

```ts
import { designTokens as t, styles, typestyles } from '@var-ui/core';

export const themePlaygroundStyles = typestyles.recipe(
  'theme-playground',
  () => ({
    slots: [
      'root',
      'workspace',
      'controls',
      'preview',
      'previewInner',
      'previewFrame',
      'previewFrameMobile',
      'toolbar',
      'code',
      'controlGroup',
      'controlLabel',
    ],
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: t.space[3].var,
    },
    workspace: {
      display: 'grid',
      gridTemplateColumns: '15rem 1fr',
      gap: 0,
      borderRadius: t.radius.lg.var,
      border: `1px solid ${t.color.border.default.var}`,
      backgroundColor: t.color.background.surface.var,
      overflow: 'hidden',
      ...styles.media('md', 'max', {
        gridTemplateColumns: '1fr',
      }),
    },
    controls: {
      display: 'flex',
      flexDirection: 'column',
      gap: t.space[4].var,
      padding: t.space[4].var,
      borderRight: `1px solid ${t.color.border.default.var}`,
      backgroundColor: t.color.background.surface.var,
      ...styles.media('md', 'max', {
        borderRight: 'none',
        borderBottom: `1px solid ${t.color.border.default.var}`,
      }),
    },
    preview: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '24rem',
      backgroundColor: t.color.background.app.var,
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: t.space[2].var,
      padding: t.space[3].var,
      borderBottom: `1px solid ${t.color.border.default.var}`,
    },
    previewInner: {
      flex: 1,
      padding: t.space[4].var,
      overflow: 'auto',
    },
    previewFrame: {
      width: '100%',
    },
    previewFrameMobile: {
      width: '100%',
      maxWidth: '24rem',
      marginInline: 'auto',
    },
    controlGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: t.space[2].var,
    },
    controlLabel: {
      fontSize: t.fontSize.sm.var,
      fontWeight: t.fontWeight.medium.var,
      color: t.color.text.secondary.var,
    },
    code: {
      borderRadius: t.radius.lg.var,
      overflow: 'hidden',
    },
  }),
  { layer: 'components' },
);
```

- [ ] **Step 2: Register in `docs/src/styles/index.ts`**

Add `import './themePlayground';`

- [ ] **Step 3: Run check**

Run: `vp check`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add docs/src/styles/themePlayground.ts docs/src/styles/index.ts
git commit -m "feat(docs): add theme playground layout styles"
```

---

### Task 4: ThemePlayground React island

**Files:**

- Create: `docs/src/components/theme-playground/ThemePlayground.tsx`

**Interfaces:**

- Consumes: `themePlaygroundStyles`, `generateThemeCode`, `DEFAULT_THEME_PLAYGROUND_STATE`, `ThemeShowcaseSwitcher`, `BentoShowcase`, `HighlightedCodeBlock`, `SegmentedControl` from `@var-ui/react`
- Produces: default export `ThemePlayground` component

- [ ] **Step 1: Implement `ThemePlayground.tsx`**

Key structure:

```tsx
'use client';

import { defaultIcons } from '@var-ui/icons';
import {
  Button,
  DesignSystemProvider,
  IconProvider,
  LayerProvider,
  SegmentedControl,
  readStoredColorMode,
  recipeClassName,
  type ColorMode,
} from '@var-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { HighlightedCodeBlock } from '../HighlightedCodeBlock';
import { BentoShowcase } from '../homepage/BentoShowcase';
import { ThemeShowcaseSwitcher } from '../homepage/ThemeShowcaseSwitcher';
import { themePlaygroundStyles } from '@/styles/themePlayground';
import { generateThemeCode } from './generateThemeCode';
import {
  DEFAULT_THEME_PLAYGROUND_STATE,
  type ThemePlaygroundState,
  type ThemePlaygroundViewport,
} from './themePlaygroundState';

const STORAGE_KEY = 'theme-mode';

const VIEWPORT_OPTIONS = [
  { id: 'desktop' as const, label: 'Desktop' },
  { id: 'mobile' as const, label: 'Mobile' },
];

function ControlGroup({ label, children }: { label: string; children: React.ReactNode }) {
  const s = themePlaygroundStyles();
  return (
    <div className={recipeClassName(s.controlGroup)}>
      <span className={recipeClassName(s.controlLabel)}>{label}</span>
      {children}
    </div>
  );
}

export default function ThemePlayground() {
  const [state, setState] = useState<ThemePlaygroundState>(DEFAULT_THEME_PLAYGROUND_STATE);
  const [colorMode, setColorMode] = useState<ColorMode>(
    () => readStoredColorMode(STORAGE_KEY) ?? 'system',
  );
  const s = themePlaygroundStyles();

  const syncColorModeFromStorage = useCallback(() => {
    const stored = readStoredColorMode(STORAGE_KEY);
    if (stored !== undefined) setColorMode(stored);
  }, []);

  useEffect(() => {
    syncColorModeFromStorage();
    const observer = new MutationObserver(() => syncColorModeFromStorage());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-mode'],
    });
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) syncColorModeFromStorage();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', onStorage);
    };
  }, [syncColorModeFromStorage]);

  const codeOutput = useMemo(() => generateThemeCode(state), [state]);

  const handleExport = async () => {
    await navigator.clipboard.writeText(codeOutput.code);
  };

  return (
    <DesignSystemProvider
      colorMode={colorMode}
      defaultColorMode="system"
      onColorModeChange={(next) => {
        setColorMode(next);
        window.localStorage.setItem(STORAGE_KEY, next);
      }}
      storageKey={STORAGE_KEY}
    >
      <IconProvider icons={defaultIcons}>
        <LayerProvider>
          <div className={recipeClassName(s.root)} data-theme-playground>
            <div className={recipeClassName(s.workspace)}>
              <aside className={recipeClassName(s.controls)} aria-label="Theme options">
                <ControlGroup label="Theme preset">
                  <ThemeShowcaseSwitcher
                    selected={state.presetId}
                    onSelect={(presetId) => setState((prev) => ({ ...prev, presetId }))}
                  />
                </ControlGroup>
              </aside>
              <div className={recipeClassName(s.preview)}>
                <div className={recipeClassName(s.toolbar)}>
                  <SegmentedControl
                    aria-label="Preview viewport"
                    options={VIEWPORT_OPTIONS}
                    value={state.viewport}
                    onChange={(viewport: ThemePlaygroundViewport) =>
                      setState((prev) => ({ ...prev, viewport }))
                    }
                  />
                  <Button appearance="outline" size="sm" onPress={handleExport}>
                    Export
                  </Button>
                </div>
                <div className={recipeClassName(s.previewInner)}>
                  <div
                    className={recipeClassName(
                      state.viewport === 'mobile' ? s.previewFrameMobile : s.previewFrame,
                    )}
                  >
                    <BentoShowcase themeId={state.presetId} />
                  </div>
                </div>
              </div>
            </div>
            <div className={recipeClassName(s.code)}>
              <HighlightedCodeBlock
                code={codeOutput.code}
                language={codeOutput.language}
                filename={codeOutput.filename}
              />
            </div>
          </div>
        </LayerProvider>
      </IconProvider>
    </DesignSystemProvider>
  );
}
```

Note: verify `SegmentedControl` `onChange` / `value` API matches docs demos — adjust prop names to match `@var-ui/react` export if needed.

- [ ] **Step 2: Create Astro wrapper**

```astro
---
// docs/src/components/ThemePlayground.astro
import ThemePlaygroundIsland from './theme-playground/ThemePlayground';
---

<ThemePlaygroundIsland client:load />
```

- [ ] **Step 3: Manual smoke test**

Run: `vp run docs:dev` (if not already running)
Navigate to `/theming/playground` after Task 5 wires the page — or temporarily import in an existing page to verify island loads.

- [ ] **Step 4: Commit**

```bash
git add docs/src/components/theme-playground/ThemePlayground.tsx \
  docs/src/components/ThemePlayground.astro
git commit -m "feat(docs): add ThemePlayground island"
```

---

### Task 5: Page wiring (MDX, nav, layout)

**Files:**

- Create: `docs/content/theming/playground.mdx`
- Modify: `docs/src/data/navigation.ts`
- Modify: `docs/src/pages/theming/[slug].astro`

- [ ] **Step 1: Create `playground.mdx`**

```mdx
---
title: Playground
description: Explore var-ui themes with live component preview and exportable theme code.
---

# Theme Playground

Pick a preset theme and preview how var-ui components respond across buttons, forms,
alerts, and layout patterns.

<ThemePlayground />
```

- [ ] **Step 2: Add nav entry**

In `themingSidebarSections`, after Colors:

```ts
{ text: 'Playground', link: '/theming/playground' },
```

- [ ] **Step 3: Update `[slug].astro` for full width**

```ts
const isFullWidth = slug === 'colors' || slug === 'playground';
```

Add `ThemePlayground` to MDX components (like `ColorSwatches`):

```astro
import ThemePlayground from '../../components/ThemePlayground.astro';
// ...
<Content components={{ ColorSwatches, ThemePlayground }} />
```

Add CSS class for playground full width (mirror colors):

```css
.docs-article--playground {
  max-width: 90rem;
}
```

```astro
<article class:list={['docs-article', isFullWidth && `docs-article--${slug}`]}>
```

- [ ] **Step 4: Smoke test in browser**

Navigate to `http://localhost:<port>/theming/playground`
Verify: preset switcher updates bento, viewport toggle constrains width, code block updates, Export copies to clipboard.

- [ ] **Step 5: Commit**

```bash
git add docs/content/theming/playground.mdx \
  docs/src/data/navigation.ts \
  docs/src/pages/theming/[slug].astro
git commit -m "feat(docs): add theme playground page"
```

---

### Task 6: Integration tests

**Files:**

- Create: `docs/src/components/theme-playground/ThemePlayground.test.tsx`

- [ ] **Step 1: Write tests**

```tsx
import { describe, expect, it, beforeEach } from 'vite-plus/test';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemePlayground from './ThemePlayground';

describe('ThemePlayground', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-mode');
  });

  it('renders bento showcase with default theme class', () => {
    render(<ThemePlayground />);
    const showcase = screen.getByTestId('bento-showcase');
    expect(showcase.className).toContain('theme-var-ui-default');
  });

  it('updates preview theme class when preset changes', async () => {
    const user = userEvent.setup();
    render(<ThemePlayground />);
    await user.click(screen.getByRole('radio', { name: /forest/i }));
    const showcase = screen.getByTestId('bento-showcase');
    await waitFor(() => {
      expect(showcase.className).toContain('theme-var-ui-forest');
    });
  });

  it('inherits color-scheme from docs site', async () => {
    localStorage.setItem('theme-mode', 'dark');
    document.documentElement.setAttribute('data-mode', 'dark');
    render(<ThemePlayground />);
    const showcase = screen.getByTestId('bento-showcase');
    expect(showcase.style.colorScheme).toBe('inherit');
  });
});
```

- [ ] **Step 2: Run tests**

Run: `vp test docs/src/components/theme-playground`
Expected: PASS

- [ ] **Step 3: Run full check**

Run: `vp check && vp test`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add docs/src/components/theme-playground/ThemePlayground.test.tsx
git commit -m "test(docs): add theme playground integration tests"
```

---

## Self-review checklist

| Spec requirement                  | Task                           |
| --------------------------------- | ------------------------------ |
| `/theming/playground` route       | Task 5                         |
| Full-width layout                 | Task 5                         |
| 8 showcase themes selectable      | Task 4 (ThemeShowcaseSwitcher) |
| BentoShowcase preview             | Task 4                         |
| Desktop/mobile viewport           | Task 4                         |
| Export copies TypeScript          | Task 2 + Task 4                |
| Color mode sync with header       | Task 4                         |
| Nav sidebar entry                 | Task 5                         |
| Tests pass                        | Task 6                         |
| themePlayground styles registered | Task 3                         |

No placeholder steps. SegmentedControl API verified at implementation time against `packages/react` export.
