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
 * <div className={f.root.className}>
 *   <label className={f.label.className}>Amount</label>
 *   <MyCustomInput />
 *   <p className={f.description.className}>Help text</p>
 * </div>
 * ```
 */
export const field = typestyles.recipe({
  name: 'field',
  layer: 'components',
  slots: ['root', 'label', 'description', 'error'],
  vars: {
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
  },
  styles: ({ vars }) => {
    const chrome = fieldChrome({
      label: vars.labelColor.var,
      description: vars.descriptionColor.var,
      error: vars.errorColor.var,
    });
    return {
      base: {
        ...chrome,
        root: {
          ...chrome.root,
          minWidth: '240px',
        },
      },
    };
  },
});
