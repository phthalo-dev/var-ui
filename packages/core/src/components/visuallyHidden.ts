import { typestyles } from '../runtime';

/** Screen-reader-only text; visually hidden but still read by assistive tech. */
export const visuallyHidden = typestyles.recipe({
  name: 'visually-hidden',
  layer: 'utilities',
  styles: () => ({
    base: {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: 0,
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)',
      whiteSpace: 'nowrap',
      border: 0,
    },
  }),
});
