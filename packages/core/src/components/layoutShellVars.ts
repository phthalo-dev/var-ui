import { atProperty, type ComponentVarRefTree } from 'typestyles';
import { designTokens as t } from '../tokens';

export type LayoutPadding = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8;

const shellPadding = t.space[4].var;

/**
 * Nested shell var definitions for the `layout` recipe family. Paths flatten to
 * `padding-outer-x`, `padding-inner-y`, `content-width`, etc. — registered on
 * `layout` root via `layout.vars`; zone recipes read them through
 * `getLayoutShellVars()`.
 */
export const layoutShellVarDefinitions = {
  padding: {
    outer: {
      x: { ...atProperty.length, value: shellPadding },
      y: { ...atProperty.length, value: shellPadding },
    },
    inner: {
      x: { ...atProperty.length, value: shellPadding },
      y: { ...atProperty.length, value: shellPadding },
    },
  },
  content: {
    width: { ...atProperty.union(atProperty.length, { syntax: 'none' }), value: 'none' },
  },
} as const;

type LayoutShellVars = ComponentVarRefTree<typeof layoutShellVarDefinitions>;

let shellVars: LayoutShellVars | undefined;

/** Stores the refs from `layout.vars` for zone recipes defined later in the module. */
export function setLayoutShellVars(vars: LayoutShellVars): void {
  shellVars = vars;
}

/** Shell var refs for `layout*` zone recipes. Requires `layout()` to be defined first. */
export function getLayoutShellVars(): LayoutShellVars {
  if (!shellVars) {
    throw new Error(
      '[var-ui] Layout shell vars are not initialized — import `layout` from @var-ui/core',
    );
  }
  return shellVars;
}

const paddingToken = (step: LayoutPadding) => t.space[step].var;

/** `[shellVar.name]: value` map for a uniform padding step on all shell edges. */
export function layoutShellPaddingAssignments(step: LayoutPadding): Record<string, string> {
  const shell = getLayoutShellVars();
  const value = paddingToken(step);
  return {
    [shell.padding.outer.x.name]: value,
    [shell.padding.outer.y.name]: value,
    [shell.padding.inner.x.name]: value,
    [shell.padding.inner.y.name]: value,
  };
}

/** `[shellVar.name]: value` map for `Layout` `contentWidth`. */
export function layoutContentWidthAssignment(width: number): Record<string, string> {
  const shell = getLayoutShellVars();
  return { [shell.content.width.name]: `${width}px` };
}
