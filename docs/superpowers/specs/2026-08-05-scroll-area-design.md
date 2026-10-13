# ScrollArea with edge fading

**Date:** 2026-08-05  
**Status:** Proposal  
**Inspired by:** [Reshaped ScrollArea v4.1](https://www.reshaped.so/docs/changelog) (fade masks, CSS scroll-driven animations in Table)  
**Related:** `table`, `chatMessageList`, `sideNav`, `toc`

## Summary

Ship a **`scrollArea` recipe + `ScrollArea` React component** that provides:

1. A styled, accessible scroll container (overflow auto/hidden + `min-height: 0` flex child fixes)
2. Optional **edge fade masks** on scrollable axes
3. A reusable **fade mask primitive** adopted by `Table` horizontal scroll and `ChatMessageList`

## Problem

Scrollable regions today are raw `overflow: auto` divs. Common pain points:

- Flex children don't shrink (`min-height: 0` missing) — sidebars and chat lists break layout
- No visual affordance that content continues off-screen
- `Table` and carousel-like regions would each reinvent fade logic

Reshaped's v4.1 approach uses CSS scroll-driven animations for fade visibility — no scroll event listeners, better performance.

## Goals

| Goal                     | Detail                                                                     |
| ------------------------ | -------------------------------------------------------------------------- |
| **Composable recipe**    | Works in React, Astro, and vanilla HTML                                    |
| **Fade optional**        | `fade={true}` or `fade="horizontal" \| "vertical" \| "both"`               |
| **Performance**          | Prefer CSS scroll-driven animations over `onScroll` where supported        |
| **Graceful degradation** | Browsers without scroll-driven animations: no fade (content still scrolls) |
| **Reuse**                | Export `scrollFadeMask()` mixin for `table` recipe                         |

## Non-goals (v1)

- Custom scrollbar thumb styling (WebKit scrollbar CSS only, if trivial)
- Virtualized lists (react-virtual, etc.)
- Scroll snap orchestration
- Imperative scroll-to APIs (`scrollToIndex`) — callers use `ref` + DOM APIs

## Proposed API

### Recipe (`packages/core/src/components/scrollArea.ts`)

Slots: `root`, `viewport`, `content` (optional — single-slot `root` acceptable for v1)

```ts
export const scrollArea = typestyles.recipe('scroll-area', (c) => {
  const v = c.vars({
    fadeSize: { value: '24px', syntax: '<length>' },
    fadeColor: { value: t.color.background.app.var, syntax: '<color>' },
  });
  return {
    slots: ['root', 'viewport'],
    base: {
      root: {
        position: 'relative',
        minHeight: 0,
        minWidth: 0,
      },
      viewport: {
        overflow: 'auto',
        height: '100%',
        width: '100%',
        // scrollbar styling optional
      },
    },
    variants: {
      fade: {
        none: {},
        horizontal: {
          /* mask on viewport */
        },
        vertical: {
          /* mask on viewport */
        },
        both: {
          /* combined mask */
        },
      },
      orientation: {
        vertical: { viewport: { overflowY: 'auto', overflowX: 'hidden' } },
        horizontal: { viewport: { overflowX: 'auto', overflowY: 'hidden' } },
        both: { viewport: { overflow: 'auto' } },
      },
    },
    defaultVariants: { fade: 'none', orientation: 'vertical' },
  };
});
```

### Fade implementation (CSS scroll-driven animations)

```css
/* Conceptual — applied to viewport when fade=horizontal */
@keyframes scroll-fade-start {
  from {
    --fade-start: 0;
  }
  to {
    --fade-start: 1;
  }
}
@keyframes scroll-fade-end {
  from {
    --fade-end: 1;
  }
  to {
    --fade-end: 0;
  }
}

.viewport[data-fade='horizontal'] {
  mask-image: linear-gradient(
    to right,
    transparent,
    black var(--fade-size),
    black calc(100% - var(--fade-size)),
    transparent
  );
  animation:
    scroll-fade-start linear,
    scroll-fade-end linear;
  animation-timeline: scroll(self inline);
  /* fall back: static mask at 0/100% edges when animation-timeline unsupported */
}
```

Use `@supports (animation-timeline: scroll())` to enable dynamic fades; static edge gradient as fallback.

### React component

```tsx
export type ScrollAreaProps = {
  children: ReactNode;
  /** @default 'vertical' */
  orientation?: 'vertical' | 'horizontal' | 'both';
  /** Edge fade masks. @default false */
  fade?: boolean | 'horizontal' | 'vertical' | 'both';
  className?: string;
  viewportClassName?: string;
  /** Forwarded to viewport element */
  ref?: Ref<HTMLDivElement>;
};

export function ScrollArea({ fade = false, orientation = 'vertical', ... }: ScrollAreaProps);
```

Map `fade={true}` → `both` when `orientation === 'both'`, else match orientation axis.

### Adoption targets

| Consumer          | Change                                                                                                         |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| `Table`           | Wrap scrollable table region in `ScrollArea` or apply shared fade mixin on `table.root` when `overflowX: auto` |
| `ChatMessageList` | Replace raw overflow container with `ScrollArea fade="vertical"`                                               |
| `SideNav`         | Optional fade on collapsed nav scroll regions                                                                  |
| Docs TOC          | Consider vertical fade for long TOCs                                                                           |

## Architecture

```
scrollArea recipe (slots + fade variants)
  ├── ScrollArea React wrapper
  ├── scrollFadeMixin() — shared @keyframes + mask rules
  └── table recipe imports mixin for horizontal scroll chrome
```

## Accessibility

- Viewport is a plain scrollable `div` with `tabIndex={0}` only when content overflows and isn't focusable — mirror Radix/Reshaped: don't steal tab order by default.
- Fade is decorative (`pointer-events: none` on pseudo-elements if split-layer); don't reduce contrast of focus rings.
- Respect `prefers-reduced-motion`: disable scroll-driven fade animations (static or no mask).

## Implementation plan

| Step | Work                                                                         |
| ---- | ---------------------------------------------------------------------------- |
| 1    | Prototype fade CSS in isolation; verify Chrome/Safari/Firefox support matrix |
| 2    | Ship `scrollArea` recipe without fade; dogfood in `ChatMessageList`          |
| 3    | Add fade variants + `@supports` fallback                                     |
| 4    | Integrate horizontal fade into `Table` scroll wrapper                        |
| 5    | Astro demo + docs page                                                       |
| 6    | Visual regression test (Playwright screenshot or story) for fade on/off      |

## Open questions

1. **Two-layer vs mask on viewport** — Reshaped uses overlay gradients; CSS mask is simpler but affects text antialiasing at edges. Validate visually.
2. **Theme token for fade color** — default to `color.background.app` or inherit from parent surface (`data-surface`)?
3. **Radix ScrollArea** — Reshaped rolls custom; we should too (no new dependency) unless a11y audit demands scrollbar region role.

## Success criteria

- Chat message list scrolls correctly inside flex `ChatLayout` without layout blowout.
- Table horizontal scroll shows fade when columns overflow; fade hides at scroll edges.
- No `scroll` event listeners in v1 fade implementation.
