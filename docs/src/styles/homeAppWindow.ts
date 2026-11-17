import { designTokens as t, typestyles } from '@var-ui/core';

const belowMd = typestyles.breakpoint('md', 'max');
const belowXl = typestyles.breakpoint('xl', 'max');

/** Side gutter beside the window that the spec labels live in. */
const gutter = '8rem';

const mix = (color: string, percent: number) =>
  `color-mix(in oklch, ${color} ${percent}%, transparent)`;

/**
 * The hero's product window, annotated like a design spec: token names on leader lines
 * around a small billing screen built from Var UI components.
 */
export const homeAppWindow = typestyles.recipe({
  name: 'home-app-window',
  layer: 'components',
  slots: [
    'stage',
    'window',
    'titlebar',
    'dots',
    'dot',
    'url',
    'body',
    'sidebar',
    'sidebarLabel',
    'main',
    'mainHeader',
    'title',
    'plans',
    'plan',
    'planSelected',
    'planName',
    'price',
    'priceUnit',
    'usage',
    'spec',
    'specTopLeft',
    'specRight',
    'specBottom',
    'specLeft',
    'specLine',
    'specSwatch',
    'specValue',
    'titlebarEnd',
  ],
  styles: () => {
    return {
      base: {
        stage: {
          position: 'relative',
          width: '100%',
          maxWidth: '76rem',
          marginInline: 'auto',
          marginTop: t.space.xxl.var,
          // Gutters hold the spec labels on wide screens; below `xl` the window goes full width.
          paddingInline: gutter,
          boxSizing: 'border-box',
          textAlign: 'start',
          [belowXl]: { paddingInline: 0 },
        },
        window: {
          position: 'relative',
          overflow: 'hidden',
          borderRadius: t.radius.xl.var,
          backgroundColor: t.color.background.surface.var,
          color: t.color.text.primary.var,
          boxShadow: `0 0 0 1px ${mix(t.color.text.primary.var, 10)}, 0 2px 4px ${mix(t.color.overlay.shadow.var, 10)}, 0 24px 64px ${mix(t.color.overlay.shadow.var, 28)}`,
        },
        titlebar: {
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: t.space.sm.var,
          paddingBlock: t.space.xs.var,
          paddingInline: t.space.md.var,
          borderBottom: `1px solid ${t.color.border.default.var}`,
          backgroundColor: t.color.background.subtle.var,
        },
        dots: { display: 'flex', gap: '0.375rem' },
        dot: {
          width: '0.625rem',
          height: '0.625rem',
          borderRadius: t.radius.full.var,
          backgroundColor: t.color.border.strong.var,
        },
        url: {
          paddingBlock: '0.125rem',
          paddingInline: t.space.md.var,
          borderRadius: t.radius.full.var,
          backgroundColor: t.color.background.surface.var,
          border: `1px solid ${t.color.border.default.var}`,
          fontFamily: t.fontFamily.mono.var,
          fontSize: '0.75rem',
          color: t.color.text.secondary.var,
        },
        body: {
          display: 'grid',
          gridTemplateColumns: '13rem minmax(0, 1fr)',
          minHeight: '22rem',
          [belowMd]: { gridTemplateColumns: 'minmax(0, 1fr)' },
        },
        sidebar: {
          display: 'flex',
          flexDirection: 'column',
          gap: t.space.xxs.var,
          padding: t.space.md.var,
          borderInlineEnd: `1px solid ${t.color.border.default.var}`,
          backgroundColor: t.color.background.app.var,
          [belowMd]: { display: 'none' },
        },
        sidebarLabel: {
          paddingInline: t.space.xs.var,
          paddingBottom: t.space.xs.var,
        },
        main: {
          display: 'flex',
          flexDirection: 'column',
          gap: t.space.lg.var,
          padding: t.space.xl.var,
          minWidth: 0,
          [belowMd]: { padding: t.space.md.var, gap: t.space.md.var },
        },
        mainHeader: {
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: t.space.sm.var,
        },
        title: {
          margin: 0,
          fontFamily: t.fontFamily.display.var,
          fontSize: t.fontSize.xxl.var,
          fontWeight: t.fontWeight.semibold.var,
          letterSpacing: '-0.02em',
        },
        plans: {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: t.space.md.var,
        },
        plan: {
          display: 'flex',
          flexDirection: 'column',
          gap: t.space.sm.var,
          padding: t.space.lg.var,
          borderRadius: t.radius.lg.var,
          border: `1px solid ${t.color.border.default.var}`,
          backgroundColor: t.color.background.surface.var,
          [belowMd]: { padding: t.space.md.var },
        },
        planSelected: {
          borderColor: t.color.tone.accent.foreground.var,
          backgroundColor: t.color.tone.accent.subtleBackground.var,
          boxShadow: `0 0 0 1px ${t.color.tone.accent.foreground.var}`,
        },
        planName: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: t.space.xs.var,
          fontWeight: t.fontWeight.semibold.var,
        },
        price: {
          margin: 0,
          fontFamily: t.fontFamily.display.var,
          fontSize: t.fontSize.xxxl.var,
          fontWeight: t.fontWeight.semibold.var,
          letterSpacing: t.letterSpacing.display.var,
          lineHeight: 1,
        },
        priceUnit: {
          fontFamily: t.fontFamily.body.var,
          fontSize: t.fontSize.sm.var,
          fontWeight: t.fontWeight.normal.var,
          letterSpacing: 0,
          color: t.color.text.secondary.var,
        },
        usage: {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: t.space.lg.var,
          [belowMd]: { gridTemplateColumns: 'minmax(0, 1fr)' },
        },

        // Spec annotations: token names on leader lines around the window.
        spec: {
          position: 'absolute',
          zIndex: 1,
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.space.xs.var,
          paddingBlock: '0.1875rem',
          paddingInline: t.space.sm.var,
          borderRadius: t.radius.full.var,
          border: `1px solid ${mix(t.color.tone.accent.foreground.var, 45)}`,
          backgroundColor: t.color.background.surface.var,
          color: t.color.text.primary.var,
          fontFamily: t.fontFamily.mono.var,
          fontSize: '0.75rem',
          whiteSpace: 'nowrap',
          boxShadow: t.shadow.sm.var,
          [belowXl]: { display: 'none' },
        },
        // Chips sit on the window's edges or in the gutters, never over content.
        specTopLeft: { top: '-0.875rem', left: `calc(${gutter} + 1.5rem)` },
        specRight: { top: '-0.875rem', right: `calc(${gutter} + 1.5rem)` },
        specBottom: { bottom: '-0.875rem', left: '50%', transform: 'translateX(-50%)' },
        specLeft: { top: '9rem', right: `calc(100% - ${gutter} + 1rem)` },
        specLine: {
          position: 'absolute',
          top: '50%',
          height: '1px',
          width: '1rem',
          backgroundImage: `linear-gradient(90deg, ${t.color.tone.accent.foreground.var} 50%, transparent 50%)`,
          backgroundSize: '6px 1px',
          '[data-side="right"] > &': { right: '100%' },
          '[data-side="left"] > &': { left: '100%' },
        },
        specSwatch: {
          width: '0.75rem',
          height: '0.75rem',
          borderRadius: t.radius.sm.var,
          flexShrink: 0,
          backgroundColor: t.color.tone.accent.background.var,
        },
        titlebarEnd: { justifySelf: 'end', display: 'inline-flex' },
        specValue: { color: t.color.code.string.var },
      },
    };
  },
});
