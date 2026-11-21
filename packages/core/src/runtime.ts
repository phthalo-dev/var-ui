import { colorModes, createTypeStyles } from 'typestyles';
import { designBreakpointConditions, designBreakpoints } from './tokens/defaults/breakpoint';

const scopeId = 'var-ui';
const layerOrder = ['reset', 'base', 'tokens', 'components', 'overrides', 'utilities'] as const;

/**
 * Underlying TypeStyles instance (internal: use `typestyles`, whose `breakpoint`/`media` emit
 * non-overlapping queries). Shared scope, attribute mode, and cascade layer stack for
 * classes, tokens, and global CSS. Omit `layers` for flat CSS; enable layers when
 * integrating with global CSS that uses `@layer`.
 */
export const baseTypestyles = createTypeStyles({
  scopeId,
  mode: 'attribute',
  colorModes,
  breakpoints: designBreakpointConditions,
  layers: {
    order: layerOrder,
    token: 'tokens',
    style: 'components',
    /** Default for `global.rule` / `global.rules` when `{ layer }` is omitted. */
    global: 'tokens',
  },
});

/** The TypeStyles instance. `breakpoint(name, 'max')` is already exclusive (`(width < X)`). */
export const typestyles = baseTypestyles;

/** Internal to @var-ui/core modules; the package root re-exports only `typestyles`. */
export const { style, recipe, tokens, global, override, breakpoint, media } = typestyles;
