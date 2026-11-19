import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';

/**
 * A native `<button>` with the browser and element-base chrome removed: no background, border,
 * padding or font of its own, so it takes the look of whatever it wraps (an icon, a row, a
 * label). It keeps what makes it a button: the pointer cursor, the shared focus ring, and a
 * disabled state. Use it for small inline toggles and custom pressable regions; reach for
 * `button` when the control should look like a button.
 *
 * ```ts
 * <button type="button" className={unstyledButton().className}>…</button>
 * ```
 */
export const unstyledButton = typestyles.recipe({
  name: 'unstyled-button',
  layer: 'components',
  styles: () => ({
    base: {
      appearance: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: t.space.xxs.var,
      margin: 0,
      padding: 0,
      border: 0,
      borderRadius: t.radius.sm.var,
      background: 'none',
      boxShadow: 'none',
      font: 'inherit',
      lineHeight: 'inherit',
      letterSpacing: 'inherit',
      color: 'inherit',
      textAlign: 'inherit',
      textDecoration: 'none',
      cursor: 'pointer',
      WebkitTapHighlightColor: 'transparent',
      '&:focus-visible': focusRing,
      '&:disabled, &[aria-disabled="true"]': {
        cursor: 'not-allowed',
        opacity: t.opacity.disabled.var,
      },
    },
  }),
});
