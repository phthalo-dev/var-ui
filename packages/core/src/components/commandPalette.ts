import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { border, borderSide } from '../internal/border';
import { forced } from '../internal/forcedColors';
import { atDarkMode, atForcedColors } from '../theme/conditions';
import { designTokens as t } from '../tokens';
import { atCoarsePointer } from '../internal/pointer';
import { focusRing } from '../internal/focusRing';
import { nativeBackdrop, nativeDialogReset, nativeEnterExit } from '../shared/overlayMotion';

/**
 * Command / search palette overlay (⌘K-style).
 *
 * Built on native `<dialog>` with `showModal()`. `root` is the `<dialog>` element itself: it carries
 * the surface, the enter/exit animation and `::backdrop`.
 *
 * Multi-part UI: use the **slots** API (`commandPalette().dialog`) rather than flat
 * `component({ key: true })`, which is meant for optional style toggles on one surface.
 */
export const commandPalette = typestyles.recipe({
  name: 'command-palette',
  layer: 'components',
  slots: [
    'root',
    'frame',
    'inputRow',
    'inputIcon',
    'input',
    'results',
    'group',
    'groupHeading',
    'result',
    'resultLink',
    'resultLinkActive',
    'resultIcon',
    'resultBody',
    'resultShortcut',
    'resultTitle',
    'resultMeta',
    'mark',
    'empty',
    'emptyIcon',
    'emptyTitle',
    'emptyHint',
    'cancel',
    'footer',
    'footerHint',
  ],
  vars: {
    backdropBackground: {
      ...atProperty.color,
      value: t.color.overlay.backdrop.var,
    },
    dialogBackground: {
      ...atProperty.color,
      value: t.color.background.surface.var,
    },
    dialogBorder: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
    inputRowBorder: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
    inputIconColor: {
      ...atProperty.color,
      value: t.color.text.placeholder.var,
    },
    inputForeground: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
    inputPlaceholder: {
      ...atProperty.color,
      value: t.color.text.placeholder.var,
    },
    resultForeground: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
    resultSelectedBackground: {
      ...atProperty.color,
      value: t.color.navItem.selectedBackground.var,
    },
    // The active row keeps body ink (the tinted fill marks it), so the accent match run in its
    // title still reads; an accent title would swallow it.
    resultSelectedForeground: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
    resultMetaColor: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
    // One match treatment for titles and subtitles: accent ink, no chip.
    markBackground: {
      ...atProperty.color,
      value: 'transparent',
    },
    markForeground: {
      ...atProperty.color,
      value: t.color.tone.accent.foreground.var,
    },
    groupHeadingColor: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
    emptyColor: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          [vars.backdropBackground.name]: t.color.overlay.backdrop.var,
          [vars.dialogBackground.name]: t.color.background.surface.var,
          [vars.dialogBorder.name]: t.color.border.default.var,
          [vars.inputRowBorder.name]: t.color.border.default.var,
          [vars.inputIconColor.name]: t.color.text.placeholder.var,
          [vars.inputForeground.name]: t.color.text.primary.var,
          [vars.inputPlaceholder.name]: t.color.text.placeholder.var,
          [vars.resultForeground.name]: t.color.text.primary.var,
          [vars.resultSelectedBackground.name]: t.color.navItem.selectedBackground.var,
          [vars.resultSelectedForeground.name]: t.color.text.primary.var,
          [vars.resultMetaColor.name]: t.color.text.secondary.var,
          [vars.markBackground.name]: 'transparent',
          [vars.markForeground.name]: t.color.tone.accent.foreground.var,
          [vars.groupHeadingColor.name]: t.color.text.secondary.var,
          [vars.emptyColor.name]: t.color.text.secondary.var,
          // The native `<dialog>` is the surface itself (no padding, so a click whose target is the
          // dialog is always a backdrop click). Positioned near the top; `margin-inline: auto`
          // centers it, the UA `display: none` hides it while closed.
          ...nativeDialogReset,
          ...nativeEnterExit({
            scale: true,
            backdrop: true,
            whenOpen: { display: 'flex' },
          }),
          '&::backdrop': {
            ...nativeBackdrop(vars.backdropBackground.var)['&::backdrop'],
            '@supports (backdrop-filter: blur(0.0625rem))': {
              backdropFilter: 'blur(0.625rem)',
            },
          },
          marginBlock: 'max(12vh, 4.5rem) auto',
          marginInline: 'auto',
          width: `min(${t.size.panel.xxl.var}, calc(100% - 2 * ${t.space.md.var}))`,
          maxWidth: 'none',
          maxHeight: 'min(72vh, 40rem)',
          flexDirection: 'column',
          fontFamily: t.fontFamily.body.var,
          backgroundColor: vars.dialogBackground.var,
          borderRadius: t.radius.lg.var,
          ...border(vars.dialogBorder.var),
          boxShadow: t.shadow.xl.var,
          // Visible so a portaled popup (a child of this dialog) is not clipped. `frame` clips
          // the surface to the radius.
          overflow: 'visible',
          ...atDarkMode({
            boxShadow: 'none',
          }),
        },
        frame: {
          display: 'flex',
          flexDirection: 'column',
          flex: '1 1 auto',
          minHeight: 0,
          maxHeight: '100%',
          overflow: 'hidden',
          borderRadius: 'inherit',
        },
        inputRow: {
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: t.space.xs.var,
          padding: `${t.space.sm.var} ${t.space.md.var}`,
          ...borderSide('block-end', vars.inputRowBorder.var),
          // The field (after the icon) takes the room; a trailing Cancel keeps its own width.
          '& > :nth-child(2)': {
            display: 'flex',
            flex: '1 1 auto',
            minWidth: 0,
          },
        },
        inputIcon: {
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          color: vars.inputIconColor.var,
          lineHeight: 0,
        },
        input: {
          flex: 1,
          minWidth: 0,
          border: 'none',
          margin: 0,
          padding: 0,
          backgroundColor: 'transparent',
          fontSize: t.fontSize.lg.var,
          fontFamily: t.fontFamily.body.var,
          color: vars.inputForeground.var,
          outline: 'none',
          '&::placeholder': { color: vars.inputPlaceholder.var },
          // Esc clears and closes; the UA clear button only adds noise.
          '&::-webkit-search-cancel-button': { display: 'none' },
        },
        results: {
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          margin: 0,
          padding: t.space.xs.var,
          listStyle: 'none',
        },
        group: {
          margin: 0,
          padding: 0,
        },
        groupHeading: {
          margin: 0,
          padding: `${t.space.xs.var} ${t.space.md.var} ${t.space.xxs.var}`,
          fontSize: t.fontSize.xs.var,
          fontWeight: t.fontWeight.semibold.var,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: vars.groupHeadingColor.var,
        },
        result: {
          margin: 0,
        },
        // ~44px rows: icon tile, title over a muted one-line subtitle, optional shortcut.
        resultLink: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space.sm.var,
          boxSizing: 'border-box',
          minHeight: '2.75rem',
          paddingBlock: t.space.xxs.var,
          paddingInline: t.space.sm.var,
          textDecoration: 'none',
          color: vars.resultForeground.var,
          transition: t.transition.surfaceFast.var,
          borderRadius: t.radius.navItem.var,
          // No separate hover paint: moving the pointer over a row makes it the active row, so
          // only one row is ever highlighted (keyboard and pointer share it).
        },
        resultLinkActive: {
          backgroundColor: vars.resultSelectedBackground.var,
          color: vars.resultSelectedForeground.var,
          ...atForcedColors(forced.selected),
        },
        // Result type tile (page, component, theme…): a quiet square that tints with the row.
        resultIcon: {
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1.75rem',
          height: '1.75rem',
          borderRadius: t.radius.sm.var,
          ...border(vars.inputRowBorder.var),
          boxSizing: 'border-box',
          color: vars.resultMetaColor.var,
          lineHeight: 0,
          '& svg': {
            width: t.size.icon.sm.var,
            height: t.size.icon.sm.var,
          },
        },
        resultBody: {
          flex: '1 1 auto',
          minWidth: 0,
        },
        resultShortcut: {
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.space.xxs.var,
          marginInlineStart: 'auto',
        },
        resultTitle: {
          display: 'block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.medium.var,
          lineHeight: 1.3,
        },
        // Subtitle: one muted 12px line under the title.
        resultMeta: {
          display: 'block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: t.fontSize.xs.var,
          fontWeight: t.fontWeight.normal.var,
          // A step below the group headings and hints, so the title leads.
          color: t.color.text.tertiary.var,
          lineHeight: 1.3,
        },
        // Matched text, in titles and subtitles alike: accent ink only. The weight is the
        // line's own (a bump read as bold in the 400-weight subtitle but barely showed in the
        // 500-weight title) and there is no padding, so the text never shifts.
        mark: {
          fontFamily: 'inherit',
          fontWeight: 'inherit',
          backgroundColor: vars.markBackground.var,
          color: vars.markForeground.var,
          borderRadius: '0.125rem',
          padding: 0,
          ...atForcedColors({ color: 'Highlight', backgroundColor: 'transparent' }),
        },
        // Keyboard hints under the results (↑↓ navigate, ↵ open, esc close).
        footer: {
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: `${t.space.xxs.var} ${t.space.md.var}`,
          paddingBlock: t.space.xs.var,
          paddingInline: t.space.md.var,
          ...borderSide('block-start', vars.inputRowBorder.var),
          fontSize: t.fontSize.xs.var,
          color: vars.resultMetaColor.var,
          // Nothing to navigate (`data-empty` on the frame), or no keyboard: the hints go.
          '[data-empty] &': { display: 'none' },
          ...atCoarsePointer({ display: 'none' }),
        },
        footerHint: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.space.xxs.var,
          whiteSpace: 'nowrap',
        },
        empty: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: t.space.xxs.var,
          margin: 0,
          padding: `${t.space.xl.var} ${t.space.md.var}`,
          fontSize: t.fontSize.sm.var,
          color: vars.emptyColor.var,
          lineHeight: 1.5,
          textAlign: 'center',
        },
        emptyIcon: {
          display: 'inline-flex',
          marginBlockEnd: t.space.xxs.var,
          color: vars.inputIconColor.var,
          lineHeight: 0,
          '& svg': { width: t.size.icon.lg.var, height: t.size.icon.lg.var },
        },
        /** `No results for "query"`: echoing the query makes a typo obvious. */
        emptyTitle: {
          margin: 0,
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.medium.var,
          color: vars.resultForeground.var,
          overflowWrap: 'anywhere',
        },
        emptyHint: {
          margin: 0,
          fontSize: t.fontSize.sm.var,
          color: vars.emptyColor.var,
        },
        /** Closes the palette. Shown only on touch-first devices, which have no Escape key. */
        cancel: {
          display: 'none',
          flexShrink: 0,
          alignItems: 'center',
          minHeight: t.size.control.md.var,
          margin: 0,
          marginInlineEnd: `calc(-1 * ${t.space.xs.var})`,
          paddingBlock: 0,
          paddingInline: t.space.xs.var,
          border: 'none',
          borderRadius: t.radius.sm.var,
          backgroundColor: 'transparent',
          font: 'inherit',
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.medium.var,
          color: t.color.tone.accent.foreground.var,
          cursor: 'pointer',
          '&:focus-visible': focusRing,
          ...atCoarsePointer({ display: 'inline-flex' }),
        },
      },
    };
  },
});

/** Visual props derived from the schema. */
export type CommandPaletteVariantProps = RecipeVariants<typeof commandPalette>;
