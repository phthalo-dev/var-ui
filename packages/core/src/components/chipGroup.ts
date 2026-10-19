import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Layout wrapper for grouped filter chips.
 */
export const chipGroup = typestyles.recipe(
  'chip-group',
  () => ({
    slots: ['root'],
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: t.space[2].var,
    },
  }),
  { layer: 'components' },
);
