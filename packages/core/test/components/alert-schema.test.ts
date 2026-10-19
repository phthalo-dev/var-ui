import { describe, expect, expectTypeOf, it } from 'vite-plus/test';
import { getComponentMeta, getRegisteredCss } from 'typestyles';
import { alert, type AlertVariantProps } from '../../src/components/alert';

describe('alert schema recipe', () => {
  it('exposes axis defaults and schema metadata', () => {
    expect(alert.defaults).toEqual({
      tone: 'info',
      appearance: 'subtle',
      contentGap: 'spaced',
    });

    expect(getComponentMeta(alert)?.schema).toEqual({
      slots: ['root', 'icon', 'body', 'title', 'content', 'action', 'actionLink'],
      variants: {
        tone: {
          kind: 'enum',
          options: ['neutral', 'accent', 'success', 'warning', 'danger', 'info'],
          default: 'info',
        },
        appearance: {
          kind: 'enum',
          options: ['subtle', 'solid', 'outline'],
          default: 'subtle',
        },
        contentGap: {
          kind: 'enum',
          options: ['spaced', 'flush'],
          default: 'spaced',
        },
      },
    });
  });

  it('emits attribute selectors for tone, appearance, and content gap', () => {
    const a = alert({ tone: 'danger', appearance: 'solid', contentGap: 'flush' });
    expect(a.root.attrs).toMatchObject({
      'data-tone': 'danger',
      'data-appearance': 'solid',
      'data-content-gap': 'flush',
    });

    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-alert[data-tone="danger"]');
    expect(css).toContain('.var-ui-alert[data-appearance="solid"]');
    expect(css).toContain('.var-ui-alert__content[data-content-gap="flush"]');
  });

  it('types visual props from the schema', () => {
    expectTypeOf<AlertVariantProps['tone']>().toEqualTypeOf<
      'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | undefined
    >();
    expectTypeOf<AlertVariantProps['appearance']>().toEqualTypeOf<
      'subtle' | 'solid' | 'outline' | undefined
    >();
    expectTypeOf<AlertVariantProps['contentGap']>().toEqualTypeOf<'spaced' | 'flush' | undefined>();
    expectTypeOf(alert.defaults.tone).toEqualTypeOf<'info'>();
    expect(alert.vars?.semantic.var).toBe('var(--var-ui-alert-semantic)');

    alert({ tone: 'accent' });
    // @ts-expect-error unknown tone
    alert({ tone: 'tip' });
  });
});
