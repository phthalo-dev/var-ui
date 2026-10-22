import { typestyles } from '../runtime';

/**
 * Wrapper that does not generate a box. Use it when a React or Astro host
 * needs a DOM node for events without affecting layout.
 */
export const contents = typestyles.recipe({
  name: 'contents',
  layer: 'utilities',
  styles: () => ({
    base: {
      display: 'contents',
    },
  }),
});
