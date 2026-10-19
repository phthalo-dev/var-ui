import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { fieldChrome } from './fieldChrome';

/**
 * Standalone field chrome for custom inputs that aren't one of the built-in
 * field recipes — label, help text, and validation message around any control.
 *
 * ```tsx
 * const f = field();
 * <div className={f.root}>
 *   <label className={f.label}>Amount</label>
 *   <MyCustomInput />
 *   <p className={f.description}>Help text</p>
 * </div>
 * ```
 */
export const field = typestyles.recipe(
  'field',
  (c) => {
    const v = c.vars({
      labelColor: {
        ...atProperty.color,
        value: t.color.text.primary.var,
      },
      descriptionColor: {
        ...atProperty.color,
        value: t.color.text.secondary.var,
      },
      errorColor: {
        ...atProperty.color,
        value: t.color.tone.danger.foreground.var,
      },
    });
    const chrome = fieldChrome({
      label: v.labelColor.var,
      description: v.descriptionColor.var,
      error: v.errorColor.var,
    });
    return {
      slots: ['root', 'label', 'description', 'error'],
      ...chrome,
      root: {
        ...chrome.root,
        minWidth: '240px',
      },
    };
  },
  { layer: 'components' },
);
