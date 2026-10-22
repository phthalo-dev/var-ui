import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/** Accent + focus ring follow semantic color tokens directly — single-class recipe, no slot callback. */
export const link = typestyles.style(
  'link',
  {
    color: t.color.link.default.var,
    fontSize: t.fontSize.md.var,
    textDecoration: 'none',
    fontWeight: t.fontWeight.medium.var,
    '&:hover': {
      textDecoration: 'underline',
    },
    '&:focus-visible': {
      outline: `2px solid ${t.color.border.focus.var}`,
      outlineOffset: '2px',
      borderRadius: t.radius.sm.var,
    },
  },
  { layer: 'components' },
);
