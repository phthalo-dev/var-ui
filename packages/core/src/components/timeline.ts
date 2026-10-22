import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { mapTone, toneChannelAssignments, toneWithDefault } from '../shared/semanticTone';
import { controlSize } from '../shared/variantAxes';

/**
 * Vertical activity timeline with bullets and connecting lines.
 */
export const timeline = typestyles.recipe({
  name: 'timeline',
  layer: 'components',
  slots: ['root', 'item', 'bullet', 'body', 'title', 'description', 'timestamp'],
  variants: {
    size: controlSize,
    tone: toneWithDefault('accent'),
  },
  vars: {
    line: { ...atProperty.color, value: t.color.border.default.var },
    bulletBorder: { ...atProperty.color, value: t.color.border.default.var },
    bulletBackground: { ...atProperty.color, value: t.color.background.surface.var },
    bulletForeground: { ...atProperty.color, value: t.color.text.secondary.var },
    titleColor: { ...atProperty.color, value: t.color.text.primary.var },
    descriptionColor: { ...atProperty.color, value: t.color.text.secondary.var },
    timestampColor: { ...atProperty.color, value: t.color.text.secondary.var },
    semantic: { ...atProperty.color, value: t.color.tone.accent.foreground.var },
    solidBg: { ...atProperty.color, value: t.color.tone.accent.background.var },
    solidFg: { ...atProperty.color, value: t.color.tone.accent.foregroundOnBackground.var },
    bulletSize: { ...atProperty.length, value: t.space[3].var },
    lineWidth: { ...atProperty.length, value: t.borderWidth.default.var },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          listStyle: 'none',
          margin: 0,
          padding: 0,
        },
        item: {
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: `${vars.bulletSize.var} minmax(0, 1fr)`,
          columnGap: t.space[3].var,
          paddingBottom: t.space[4].var,
          '&:last-child': {
            paddingBottom: 0,
          },
          '&:not(:last-child)::before': {
            content: '""',
            position: 'absolute',
            top: `calc(${vars.bulletSize.var} + ${t.space[1].var})`,
            bottom: 0,
            left: `calc((${vars.bulletSize.var} - ${vars.lineWidth.var}) / 2)`,
            width: vars.lineWidth.var,
            backgroundColor: vars.line.var,
          },
        },
        bullet: {
          position: 'relative',
          zIndex: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: vars.bulletSize.var,
          height: vars.bulletSize.var,
          borderRadius: t.radius.full.var,
          borderWidth: vars.lineWidth.var,
          borderStyle: 'solid',
          borderColor: vars.bulletBorder.var,
          backgroundColor: vars.bulletBackground.var,
          color: vars.bulletForeground.var,
          flexShrink: 0,
          '&[data-active]': {
            [vars.bulletBorder.name]: vars.solidBg.var,
            [vars.bulletBackground.name]: vars.solidBg.var,
            [vars.bulletForeground.name]: vars.solidFg.var,
          },
          '&[data-pending]': {
            [vars.bulletBorder.name]: vars.bulletBorder.var,
            [vars.bulletBackground.name]: vars.bulletBackground.var,
            [vars.bulletForeground.name]: vars.bulletForeground.var,
          },
        },
        body: {
          display: 'flex',
          flexDirection: 'column',
          gap: t.space[1].var,
          minWidth: 0,
          paddingTop: '2px',
        },
        title: {
          margin: 0,
          fontSize: t.fontSize.sm.var,
          fontWeight: t.fontWeight.semibold.var,
          color: vars.titleColor.var,
          lineHeight: 1.4,
        },
        description: {
          margin: 0,
          fontSize: t.fontSize.sm.var,
          color: vars.descriptionColor.var,
          lineHeight: 1.5,
        },
        timestamp: {
          margin: 0,
          fontSize: t.fontSize.xs.var,
          color: vars.timestampColor.var,
          lineHeight: 1.4,
        },
      },
      variants: {
        size: {
          sm: {
            item: {
              [vars.bulletSize.name]: t.space[2].var,
            },
          },
          md: {},
          lg: {
            item: {
              [vars.bulletSize.name]: t.space[4].var,
            },
          },
        },
        tone: mapTone((key) => ({ bullet: toneChannelAssignments(vars, key) })),
      },
    };
  },
});

export type TimelineVariantProps = RecipeVariants<typeof timeline>;
