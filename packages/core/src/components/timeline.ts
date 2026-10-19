import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { mapTone, toneChannelAssignments, toneWithDefault, type Tone } from './semanticTone';
import { controlSize } from './variantAxes';

/**
 * Vertical activity timeline with bullets and connecting lines.
 */
export const timeline = typestyles.recipe(
  'timeline',
  {
    slots: ['root', 'item', 'bullet', 'body', 'title', 'description', 'timestamp'],
    variants: {
      size: controlSize,
      tone: toneWithDefault('accent'),
    },
  },
  (c) => {
    const v = c.vars({
      line: { value: t.color.border.default.var, syntax: '<color>' },
      bulletBorder: { value: t.color.border.default.var, syntax: '<color>' },
      bulletBackground: { value: t.color.background.surface.var, syntax: '<color>' },
      bulletForeground: { value: t.color.text.secondary.var, syntax: '<color>' },
      titleColor: { value: t.color.text.primary.var, syntax: '<color>' },
      descriptionColor: { value: t.color.text.secondary.var, syntax: '<color>' },
      timestampColor: { value: t.color.text.secondary.var, syntax: '<color>' },
      semantic: { value: t.color.tone.accent.foreground.var, syntax: '<color>' },
      solidBg: { value: t.color.tone.accent.background.var, syntax: '<color>' },
      solidFg: { value: t.color.tone.accent.foregroundOnBackground.var, syntax: '<color>' },
      bulletSize: { value: t.space[3].var, syntax: '<length>' },
      lineWidth: { value: t.borderWidth.default.var, syntax: '<length>' },
    });
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
          gridTemplateColumns: `${v.bulletSize.var} minmax(0, 1fr)`,
          columnGap: t.space[3].var,
          paddingBottom: t.space[4].var,
          '&:last-child': {
            paddingBottom: 0,
          },
          '&:not(:last-child)::before': {
            content: '""',
            position: 'absolute',
            top: `calc(${v.bulletSize.var} + ${t.space[1].var})`,
            bottom: 0,
            left: `calc((${v.bulletSize.var} - ${v.lineWidth.var}) / 2)`,
            width: v.lineWidth.var,
            backgroundColor: v.line.var,
          },
        },
        bullet: {
          position: 'relative',
          zIndex: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: v.bulletSize.var,
          height: v.bulletSize.var,
          borderRadius: t.radius.full.var,
          borderWidth: v.lineWidth.var,
          borderStyle: 'solid',
          borderColor: v.bulletBorder.var,
          backgroundColor: v.bulletBackground.var,
          color: v.bulletForeground.var,
          flexShrink: 0,
          '&[data-active]': {
            [v.bulletBorder.name]: v.solidBg.var,
            [v.bulletBackground.name]: v.solidBg.var,
            [v.bulletForeground.name]: v.solidFg.var,
          },
          '&[data-pending]': {
            [v.bulletBorder.name]: v.bulletBorder.var,
            [v.bulletBackground.name]: v.bulletBackground.var,
            [v.bulletForeground.name]: v.bulletForeground.var,
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
          color: v.titleColor.var,
          lineHeight: 1.4,
        },
        description: {
          margin: 0,
          fontSize: t.fontSize.sm.var,
          color: v.descriptionColor.var,
          lineHeight: 1.5,
        },
        timestamp: {
          margin: 0,
          fontSize: t.fontSize.xs.var,
          color: v.timestampColor.var,
          lineHeight: 1.4,
        },
      },
      variants: {
        size: {
          sm: {
            item: {
              [v.bulletSize.name]: t.space[2].var,
            },
          },
          md: {},
          lg: {
            item: {
              [v.bulletSize.name]: t.space[4].var,
            },
          },
        },
        tone: mapTone((key) => ({ bullet: toneChannelAssignments(v, key) })),
      },
    };
  },
  { layer: 'components' },
);

export type TimelineRecipeProps = NonNullable<Parameters<typeof timeline>[0]>;
export type TimelineSize = NonNullable<TimelineRecipeProps['size']>;
export type TimelineVariantProps = {
  size?: TimelineSize;
  tone?: Tone;
};

export const timelineVariantPropDocs = [
  { name: 'size', type: "'sm' | 'md' | 'lg'", required: false },
  { name: 'tone', type: 'Tone', required: false },
] as const satisfies ReadonlyArray<{
  name: keyof TimelineVariantProps;
  type: string;
  required: false;
}>;
