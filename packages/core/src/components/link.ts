import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from './focusRing';

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
      ...focusRing,
      borderRadius: t.radius.sm.var,
    },
  },
  { layer: 'components' },
);
