import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

export const steps = typestyles.recipe({
  name: 'steps',
  layer: 'utilities',
  slots: ['root'],
  vars: {
    stepForeground: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
    indicatorBackground: {
      ...atProperty.color,
      value: t.color.tone.accent.background.var,
    },
    indicatorForeground: {
      ...atProperty.color,
      value: t.color.tone.accent.foregroundOnBackground.var,
    },
  },
  styles: ({ vars }) => {
    return {
      base: {
        /** Use with `<ol class={steps.root}><li>…</li></ol>` (see `Steps.astro`). */
        root: {
          listStyle: 'none',
          padding: 0,
          margin: `${t.space[4].var} 0`,
          counterReset: 'docs-step',
          '& > li': {
            position: 'relative',
            listStyle: 'none',
            paddingInlineStart: `calc(${t.space[5].var} + ${t.space[3].var})`,
            marginBottom: t.space[5].var,
            counterIncrement: 'docs-step',
            fontSize: t.fontSize.md.var,
            color: vars.stepForeground.var,
            lineHeight: 1.6,
            '&:last-child': {
              marginBottom: 0,
            },
            '&::before': {
              content: 'counter(docs-step)',
              position: 'absolute',
              insetInlineStart: 0,
              top: 0,
              width: t.space[5].var,
              height: t.space[5].var,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: t.fontSize.sm.var,
              fontWeight: t.fontWeight.semibold.var,
              color: vars.indicatorForeground.var,
              backgroundColor: vars.indicatorBackground.var,
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
      },
    };
  },
});
