import { designTokens as t } from '../tokens';

type CssColor = string;

/** Logical sides only: physical `borderLeft`/`borderTop` do not flip in RTL. */
export type BorderSide = 'block-start' | 'block-end' | 'inline-start' | 'inline-end';

const sideProps = {
  'block-start': {
    width: 'borderBlockStartWidth',
    style: 'borderBlockStartStyle',
    color: 'borderBlockStartColor',
  },
  'block-end': {
    width: 'borderBlockEndWidth',
    style: 'borderBlockEndStyle',
    color: 'borderBlockEndColor',
  },
  'inline-start': {
    width: 'borderInlineStartWidth',
    style: 'borderInlineStartStyle',
    color: 'borderInlineStartColor',
  },
  'inline-end': {
    width: 'borderInlineEndWidth',
    style: 'borderInlineEndStyle',
    color: 'borderInlineEndColor',
  },
} as const;

type SideKeys<S extends BorderSide> = Extract<
  (typeof sideProps)[S][keyof (typeof sideProps)[S]],
  string
>;

/**
 * Solid border on all sides, as longhands so later states can still override just
 * `borderColor`. Defaults to the default border width and color tokens.
 */
export function border(
  color: CssColor = t.color.border.default.var,
  width: string = t.borderWidth.default.var,
) {
  return {
    borderWidth: width,
    borderStyle: 'solid',
    borderColor: color,
  } as const;
}

/** Solid border on one logical side (`borderBlockEndWidth` / `Style` / `Color`). */
export function borderSide<S extends BorderSide>(
  side: S,
  color: CssColor = t.color.border.default.var,
  width: string = t.borderWidth.default.var,
) {
  const keys = sideProps[side];
  return {
    [keys.width]: width,
    [keys.style]: 'solid',
    [keys.color]: color,
  } as { [K in SideKeys<S>]: string };
}
