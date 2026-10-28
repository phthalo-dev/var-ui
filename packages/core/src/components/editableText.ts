import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from './focusRing';

/**
 * Display-to-edit text chrome. The `input` slot is rendered inside the display element, so
 * it inherits that element's typography and takes up the same box.
 *
 * ```ts
 * const et = editableText();
 * <div className={et.root}><h1><input className={et.input} /></h1></div>
 * ```
 */
export const editableText = typestyles.recipe({
  name: 'editable-text',
  layer: 'components',
  slots: ['root', 'input'],
  styles: () => ({
    base: {
      root: {
        display: 'block',
        borderRadius: t.radius.sm.var,
        '&:focus-visible': focusRing,
      },
      input: {
        display: 'block',
        boxSizing: 'border-box',
        width: '100%',
        margin: 0,
        padding: 0,
        border: 'none',
        borderRadius: t.radius.sm.var,
        background: 'transparent',
        color: 'inherit',
        font: 'inherit',
        letterSpacing: 'inherit',
        textAlign: 'inherit',
        textTransform: 'inherit',
        '&:focus': focusRing,
      },
    },
  }),
});
