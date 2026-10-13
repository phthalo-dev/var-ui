import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

export const steps = typestyles.recipe(
  'steps',
  (c) => {
    const v = c.vars({
      stepForeground: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      indicatorBackground: {
        value: t.color.tone.accent.background.var,
        syntax: '<color>',
      },
      indicatorForeground: {
        value: t.color.tone.accent.foregroundOnBackground.var,
        syntax: '<color>',
      },
    });
    return {
      slots: ['root'],
      /** Use with `<ol class={steps.root}><li>…</li></ol>` (see `Steps.astro`). */
      root: {
        listStyle: 'none',
        padding: 0,
        margin: `${t.space[4].var} 0`,
        counterReset: 'docs-step',
        '& > li': {
          position: 'relative',
          listStyle: 'none',
          paddingLeft: `calc(${t.space[5].var} + ${t.space[3].var})`,
          marginBottom: t.space[5].var,
          counterIncrement: 'docs-step',
          fontSize: t.fontSize.md.var,
          color: v.stepForeground.var,
          lineHeight: 1.6,
          '&:last-child': {
            marginBottom: 0,
          },
          '&::before': {
            content: 'counter(docs-step)',
            position: 'absolute',
            left: 0,
            top: 0,
            width: t.space[5].var,
            height: t.space[5].var,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: t.fontSize.sm.var,
            fontWeight: t.fontWeight.semibold.var,
            color: v.indicatorForeground.var,
            backgroundColor: v.indicatorBackground.var,
            borderRadius: t.radius.full.var,
            lineHeight: 1,
          },
          '& :first-child': {
            marginTop: 0,
          },
          '& :last-child': {
            marginBottom: 0,
          },
        },
      },
    };
  },
  { layer: 'utilities' },
);
