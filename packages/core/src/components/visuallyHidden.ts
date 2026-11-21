import { srOnly } from '../internal/srOnly';
import { typestyles } from '../runtime';

/** Screen-reader-only text; visually hidden but still read by assistive tech. */
export const visuallyHidden = typestyles.recipe({
  name: 'visually-hidden',
  layer: 'utilities',
  styles: () => ({
    base: srOnly,
  }),
});
