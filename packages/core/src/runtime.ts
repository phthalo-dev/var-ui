import { colorModes, createTypeStyles } from 'typestyles';
import { designBreakpoints } from './tokens/defaults/breakpoint';

const scopeId = 'var-ui';
const layerOrder = ['reset', 'base', 'tokens', 'components', 'overrides', 'utilities'] as const;

/**
 * Shared TypeStyles instance: scope, attribute mode, and cascade layer stack for
 * classes, tokens, and global CSS. Omit `layers` for flat CSS; enable layers when
 * integrating with global CSS that uses `@layer`.
 */
export const typestyles = createTypeStyles({
  scopeId,
  mode: 'attribute',
  colorModes,
  breakpoints: designBreakpoints,
  layers: {
    order: layerOrder,
    token: 'tokens',
    style: 'components',
    /** Default for `global.rule` / `global.rules` when `{ layer }` is omitted. */
    global: 'tokens',
  },
});

/** Internal to @var-ui/core modules; the package root re-exports only `typestyles`. */
export const { style, recipe, tokens, global, override, breakpoint, media } = typestyles;
