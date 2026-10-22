import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Layout wrapper for grouped filter chips.
 */
export const chipGroup = typestyles.recipe({
  name: 'chip-group',
  layer: 'components',
  slots: ['root'],
  styles: () => ({
    base: {
      root: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: t.space[2].var,
      },
    },
  }),
});
