import { typestyles } from '../runtime';

/** Screen-reader-only text; visually hidden but still read by assistive tech. */
export const visuallyHidden = typestyles.recipe({
  name: 'visually-hidden',
  layer: 'utilities',
  styles: () => ({
    base: {
      position: 'absolute',
      width: '0.0625rem',
      height: '0.0625rem',
      padding: 0,
      margin: '-0.0625rem',
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)',
      whiteSpace: 'nowrap',
      border: 0,
    },
  }),
});
