import { colorModes, createTypeStyles } from 'typestyles';
import { designBreakpoints } from './tokens/defaults/breakpoint';

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
  breakpoints: designBreakpoints,
  layers: {
    order: layerOrder,
    token: 'tokens',
    style: 'components',
    /** Default for `global.rule` / `global.rules` when `{ layer }` is omitted. */
    global: 'tokens',
  },
});

type BreakpointFeature = Exclude<Parameters<typeof baseTypestyles.breakpoint>[1], undefined>;
type BreakpointName = keyof typeof designBreakpoints;
type MediaQueryKey = `@media ${string}`;
type BreakpointFn = (name: BreakpointName, feature?: BreakpointFeature) => MediaQueryKey;
type MediaFn = {
  <B>(name: BreakpointName, block: B): Record<MediaQueryKey, B>;
  <B>(name: BreakpointName, feature: BreakpointFeature, block: B): Record<MediaQueryKey, B>;
};

const maxFeatures = { 'max-width': 'width', 'max-height': 'height' } as const;

/**
 * Rewrite an inclusive `(max-width: X)` / `(max-height: X)` key as an exclusive
 * range query `(width < X)`, so `breakpoint(name, 'max')` and
 * `breakpoint(name, 'min')` partition the viewport instead of both matching at
 * exactly `X` (e.g. 768px for `md`).
 *
 * Workaround for https://github.com/phthalo-dev/typestyles/issues/345 — remove
 * once TypeStyles emits non-overlapping `max` queries itself.
 */
export const toExclusiveMaxQuery = <K extends string>(key: K): K =>
  key.replace(
    /\((max-width|max-height)\s*:\s*([^)]+)\)/g,
    (_, feature: keyof typeof maxFeatures, value: string) =>
      `(${maxFeatures[feature]} < ${value.trim()})`,
  ) as K;

/**
 * `breakpoint(name, feature?)` with exclusive `max` queries. Omitting the feature
 * means `'min'` (mobile-first): the registered values are bare widths, so the
 * TypeStyles default would otherwise emit an invalid `@media (48rem)`.
 */
const breakpoint: BreakpointFn = (name, feature = 'min') =>
  toExclusiveMaxQuery(baseTypestyles.breakpoint(name, feature));

const media = ((name: BreakpointName, featureOrBlock: unknown, maybeBlock?: unknown) =>
  maybeBlock === undefined
    ? { [breakpoint(name)]: featureOrBlock }
    : { [breakpoint(name, featureOrBlock as BreakpointFeature)]: maybeBlock }) as MediaFn;

type VarUiTypeStyles = Omit<typeof baseTypestyles, 'breakpoint' | 'media'> & {
  readonly breakpoint: BreakpointFn;
  readonly media: MediaFn;
};

/** The TypeStyles instance with exclusive `max` breakpoint queries (see {@link toExclusiveMaxQuery}). */
export const typestyles: VarUiTypeStyles = { ...baseTypestyles, breakpoint, media };

/** Internal to @var-ui/core modules; the package root re-exports only `typestyles`. */
export const { style, recipe, tokens, global, override } = typestyles;
export { breakpoint, media };
