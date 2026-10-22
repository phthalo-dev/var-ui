import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Visually groups adjacent buttons with shared borders and connected corners.
 * Apply `root` to a wrapper; direct child buttons pick up grouped styling.
 */
export const buttonGroup = typestyles.recipe({
  name: 'button-group',
  layer: 'components',
  slots: ['root'],
  styles: () => ({
    base: {
      root: {
        display: 'inline-flex',
        alignItems: 'stretch',
        '& > *': {
          borderRadius: 0,
          position: 'relative',
        },
        '& > * + *': {
          marginInlineStart: '-1px',
        },
        '& > *:first-child': {
          borderStartStartRadius: t.radius.md.var,
          borderEndStartRadius: t.radius.md.var,
        },
        '& > *:last-child': {
          borderStartEndRadius: t.radius.md.var,
          borderEndEndRadius: t.radius.md.var,
        },
        '& > *:hover, & > *:focus-visible': {
          zIndex: 1,
        },
      },
    },
  }),
});
