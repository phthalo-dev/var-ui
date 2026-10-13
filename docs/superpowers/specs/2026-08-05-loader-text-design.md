# LoaderText — streaming / agent narration

**Date:** 2026-08-05  
**Status:** Proposal  
**Inspired by:** [Reshaped LoaderText v4.1](https://www.reshaped.so/docs/changelog)  
**Related:** `spinner`, `chatSystemMessage`, `chatToolCalls`, `skeleton`

## Summary

Add a **`loaderText` recipe + `LoaderText` React component** for single-line in-progress narration: shimmer while active, optional leading icon, cross-fade to completed text. Optimized for agent/tool-call step lists and streaming chat status lines.

Distinct from `Spinner` (non-text loading) and `Skeleton` (placeholder blocks).

## Problem

Agent and streaming UIs need to communicate _what_ is happening, not just _that_ something is loading:

```
◌ Searching the codebase…
✓ Found 12 files
◌ Summarizing results…
```

Today var-ui offers:

- `Spinner` — no label semantics
- `Skeleton` — block placeholder, not status narration
- `chatSystemMessage` — static centered pill, no in-progress/completed lifecycle

Reshaped's `LoaderText` fills this gap with shimmer + `completed` state transition.

## Goals

| Goal                   | Detail                                                              |
| ---------------------- | ------------------------------------------------------------------- |
| **Lifecycle**          | `loading` → `completed` with label cross-fade                       |
| **Typography-aligned** | Reuse `textBlock` size/weight tokens                                |
| **A11y**               | `role="status"`, `aria-live="polite"`, respect reduced motion       |
| **Composable**         | Works standalone and inside `ChatToolCalls` step lists              |
| **Icon slot**          | Optional leading icon (spinner icon while loading, check when done) |

## Non-goals (v1)

- Multi-line paragraph streaming (use prose/markdown elsewhere)
- Typewriter text animation
- Progress percentage
- Replacing `chatSystemMessage` for static system events

## Proposed API

### Recipe (`packages/core/src/components/loaderText.ts`)

Slots: `root`, `icon`, `label`, `labelCompleted` (or single `label` with data-state)

```ts
export const loaderText = typestyles.recipe('loader-text', (c) => {
  const v = c.vars({
    shimmerColor: { value: t.color.background.elevated.var, syntax: '<color>' },
    textColor: { value: t.color.text.secondary.var, syntax: '<color>' },
  });
  return {
    slots: ['root', 'icon', 'label'],
    base: {
      root: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space[2].var,
        color: v.textColor.var,
        fontSize: t.fontSize.sm.var,
      },
      label: {
        position: 'relative',
        /* shimmer via background-clip on data-loading */
      },
    },
    variants: {
      size: {
        sm: { root: { fontSize: t.fontSize.xs.var } },
        md: {},
        lg: { root: { fontSize: t.fontSize.md.var } },
      },
      state: {
        loading: {
          label: {
            /* shimmer animation */
          },
        },
        completed: {
          label: {
            /* no shimmer */
          },
        },
      },
    },
    defaultVariants: { size: 'md', state: 'loading' },
  };
});
```

### Shimmer (reduced-motion safe)

```css
@keyframes loader-text-shimmer {
  from {
    background-position: 200% center;
  }
  to {
    background-position: -200% center;
  }
}

[data-state='loading'] .label {
  background: linear-gradient(90deg, currentColor 0%, var(--shimmer) 50%, currentColor 100%);
  background-size: 200% auto;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: loader-text-shimmer 1.5s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  [data-state='loading'] .label {
    animation: none;
    opacity: 0.7;
  }
}
```

### React component

```tsx
export type LoaderTextProps = {
  /** In-progress label. */
  children: ReactNode;
  /** Shown after completed cross-fade. Defaults to children. */
  completedText?: ReactNode;
  /** @default false */
  completed?: boolean;
  /** Leading icon; defaults to none. */
  icon?: ReactNode;
  /** Icon when completed (e.g. check). */
  completedIcon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function LoaderText({
  children,
  completedText,
  completed = false,
  icon,
  completedIcon,
  size = 'md',
  className,
}: LoaderTextProps);
```

**Transition behavior:**

- When `completed` flips `true`, stop shimmer, cross-fade `children` → `completedText ?? children` over ~200ms.
- Use CSS `opacity` transition; swap text at end or stack with absolute positioning — prefer single `label` node text swap + opacity for simplicity.

### Chat integration

```tsx
// ChatToolCalls step row
<LoaderText completed={step.status === 'done'} completedIcon={<Icon name="check" />}>
  {step.label}
</LoaderText>
```

Optional `ChatStepStatus` thin wrapper in `packages/react/src/components/chat/` that maps tool-call state to `LoaderText` props.

## Architecture

```
loaderText recipe (shimmer + state variants)
  ├── LoaderText React component (aria-live)
  └── ChatToolCalls / agent demos consume LoaderText
```

## Accessibility

| Concern                | Approach                                            |
| ---------------------- | --------------------------------------------------- |
| Live updates           | `role="status"` + `aria-live="polite"` on root      |
| Completed announcement | Update text content; screen readers read new label  |
| Motion                 | Shimmer off under `prefers-reduced-motion`          |
| Color                  | Don't rely on shimmer alone — icon reinforces state |

## Implementation plan

| Step | Work                                                               |
| ---- | ------------------------------------------------------------------ |
| 1    | `loaderText` recipe with loading/completed states + reduced motion |
| 2    | `LoaderText` React component with cross-fade                       |
| 3    | Wire into `ChatToolCalls` demo                                     |
| 4    | Docs page under Feedback or Chat category                          |
| 5    | Unit tests: state transitions, aria attributes                     |

## Open questions

1. **Extend `chatSystemMessage`?** — Keep separate; system messages are centered pills, loader text is inline left-aligned narration.
2. **Default completed icon** — none vs checkmark when `completed`?
3. **Astro** — static HTML can use recipe with `data-state` attribute; cross-fade is React-only (acceptable).

## Success criteria

- Agent step list demo: three steps resolve sequentially with shimmer → check transitions.
- No layout shift when transitioning loading → completed (fixed min-height or consistent line-height).
- Shimmer disabled when user prefers reduced motion.
