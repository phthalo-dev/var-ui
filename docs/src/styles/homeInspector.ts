import { atProperty, keyframes } from 'typestyles';
import { designTokens as t, typestyles } from '@var-ui/core';

const belowMd = typestyles.breakpoint('md', 'max');

const mix = (color: string, percent: number) =>
  `color-mix(in oklch, ${color} ${percent}%, transparent)`;

/** DevTools-style inspector over a live Var UI button (homepage "why" section). */
export const homeInspector = typestyles.recipe({
  name: 'home-inspector',
  layer: 'components',
  slots: [
    'root',
    'stage',
    'target',
    'outline',
    'tag',
    'controls',
    'panel',
    'panelHeader',
    'panelBody',
    'column',
    'markup',
    'rule',
    'selector',
    'decl',
    'prop',
    'val',
    'resolved',
    'swatch',
    'atomic',
  ],
  vars: {
    /** Right-edge fade width while the styles panel has more to scroll (scroll-driven). */
    scrollFade: { ...atProperty.length, value: '0px', slots: ['panelBody'] },
  },
  styles: ({ vars }) => {
    const fade = keyframes.create('home-inspector-scroll-fade', {
      from: { [vars.scrollFade.name]: '2.5rem' },
      '90%': { [vars.scrollFade.name]: '2.5rem' },
      to: { [vars.scrollFade.name]: '0px' },
    });
    return {
      base: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          gap: t.space.md.var,
          minWidth: 0,
        },
        // Short canvas: controls on one side, the inspected button on the other.
        stage: {
          position: 'relative',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: t.space.xl.var,
          paddingBlock: t.space.xxl.var,
          paddingInline: t.space.xl.var,
          [belowMd]: { justifyContent: 'center', paddingInline: t.space.md.var },
          borderRadius: t.radius.lg.var,
          border: `1px solid ${t.color.border.default.var}`,
          backgroundColor: t.color.background.app.var,
          backgroundImage: `radial-gradient(${mix(t.color.text.primary.var, 12)} 1px, transparent 1.5px)`,
          backgroundSize: '1rem 1rem',
        },
        target: {
          position: 'relative',
          display: 'inline-flex',
          marginInline: 'auto',
          marginTop: t.space.lg.var,
        },
        outline: {
          position: 'absolute',
          inset: '-0.375rem',
          borderRadius: `calc(${t.radius.md.var} + 0.375rem)`,
          outline: `1.5px dashed ${t.color.tone.info.foreground.var}`,
          backgroundColor: mix(t.color.tone.info.foreground.var, 8),
          pointerEvents: 'none',
        },
        tag: {
          position: 'absolute',
          bottom: 'calc(100% + 0.75rem)',
          left: '50%',
          transform: 'translateX(-50%)',
          paddingBlock: '0.125rem',
          paddingInline: t.space.xs.var,
          borderRadius: t.radius.sm.var,
          backgroundColor: t.color.text.primary.var,
          color: t.color.background.surface.var,
          fontFamily: t.fontFamily.mono.var,
          fontSize: t.fontSize.xs.var,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        },
        controls: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: t.space.sm.var,
          [belowMd]: { alignItems: 'center' },
        },
        panel: {
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          borderRadius: t.radius.lg.var,
          border: `1px solid ${t.color.border.default.var}`,
          backgroundColor: t.color.background.code.var,
          overflow: 'hidden',
        },
        panelHeader: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space.md.var,
          paddingBlock: t.space.xs.var,
          paddingInline: t.space.md.var,
          borderBottom: `1px solid ${t.color.border.default.var}`,
          fontSize: t.fontSize.sm.var,
          color: t.color.text.secondary.var,
          '& > :first-child': {
            color: t.color.text.primary.var,
            fontWeight: t.fontWeight.semibold.var,
          },
        },
        // Two columns on wide screens (markup + computed | matched rules); one scrolling
        // column on phones. Declarations never wrap mid-identifier; the body scrolls instead.
        panelBody: {
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)',
          gap: t.space.xl.var,
          padding: t.space.lg.var,
          fontFamily: t.fontFamily.mono.var,
          fontSize: '0.8125rem',
          lineHeight: 1.6,
          overflowX: 'auto',
          '@supports (animation-timeline: scroll())': {
            maskImage: `linear-gradient(to right, black calc(100% - ${vars.scrollFade.var}), transparent)`,
            animationName: fade,
            animationDuration: '1ms',
            animationTimingFunction: 'linear',
            animationFillMode: 'both',
            animationTimeline: 'scroll(self inline)',
          },
          [belowMd]: {
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: t.space.md.var,
            maxHeight: '13rem',
            overflowY: 'auto',
            padding: t.space.md.var,
          },
        },
        column: {
          display: 'flex',
          flexDirection: 'column',
          gap: t.space.md.var,
          minWidth: 0,
        },
        markup: {
          color: t.color.code.base.var,
          whiteSpace: 'pre',
          paddingBottom: t.space.sm.var,
          borderBottom: `1px dashed ${t.color.border.default.var}`,
        },
        rule: { minWidth: 'max-content' },
        selector: { color: t.color.code.title.var },
        // Wrapped declarations hang-indent under their property.
        decl: { paddingInlineStart: '2ch', whiteSpace: 'nowrap' },
        prop: { color: t.color.code.attr.var },
        val: { color: t.color.code.string.var },
        resolved: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.space.xxs.var,
          marginInlineStart: '1ch',
          color: t.color.text.secondary.var,
        },
        swatch: {
          display: 'inline-block',
          width: '0.75rem',
          height: '0.75rem',
          borderRadius: t.radius.sm.var,
          boxShadow: `inset 0 0 0 1px ${mix(t.color.text.primary.var, 20)}`,
        },
        atomic: {
          marginTop: 'auto',
          paddingBlock: t.space.sm.var,
          paddingInline: t.space.md.var,
          borderTop: `1px solid ${t.color.border.default.var}`,
          fontFamily: t.fontFamily.mono.var,
          fontSize: t.fontSize.xs.var,
          color: t.color.text.secondary.var,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          '& s': { textDecorationColor: t.color.tone.danger.foreground.var },
        },
      },
    };
  },
});
