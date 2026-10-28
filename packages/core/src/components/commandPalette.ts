import { atProperty, variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { atDarkMode, atReducedMotion } from '../theme/conditions';
import { designTokens as t } from '../tokens';
import { layerZIndex } from './layerVars';

/**
 * Command / search palette overlay (⌘K-style).
 *
 * Built on native `<dialog>` with `showModal()`. Style the shell via `root`
 * (`::backdrop` included) and the surface panel via `dialog`. Toggle panel
 * enter animation with `data-open` on the panel element.
 *
 * Multi-part UI: use the **slots** API (`commandPalette().dialog`) rather than flat
 * `component({ key: true })`, which is meant for optional style toggles on one surface.
 */
export const commandPalette = typestyles.recipe({
  name: 'command-palette',
  layer: 'components',
  slots: [
    'root',
    'dialog',
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
  ],
  variants: {
    open: variant.boolean({ default: false }),
  },
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
      value: t.color.navItem.foreground.var,
    },
    resultHoverBackground: {
      ...atProperty.color,
      value: t.color.navItem.hoverBackground.var,
    },
    resultSelectedBackground: {
      ...atProperty.color,
      value: t.color.navItem.selectedBackground.var,
    },
    resultSelectedForeground: {
      ...atProperty.color,
      value: t.color.navItem.selectedForeground.var,
    },
    resultMetaColor: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
    markBackground: {
      ...atProperty.color,
      value: t.color.tone.accent.subtleBackground.var,
    },
    markForeground: {
      ...atProperty.color,
      value: t.color.text.primary.var,
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
          [vars.resultForeground.name]: t.color.navItem.foreground.var,
          [vars.resultHoverBackground.name]: t.color.navItem.hoverBackground.var,
          [vars.resultSelectedBackground.name]: t.color.navItem.selectedBackground.var,
          [vars.resultSelectedForeground.name]: t.color.navItem.selectedForeground.var,
          [vars.resultMetaColor.name]: t.color.text.secondary.var,
          [vars.markBackground.name]: t.color.tone.accent.subtleBackground.var,
          [vars.markForeground.name]: t.color.text.primary.var,
          [vars.groupHeadingColor.name]: t.color.text.secondary.var,
          [vars.emptyColor.name]: t.color.text.secondary.var,
          // Closed <dialog> is display:none in the UA stylesheet; root layout must not
          // override that or the element stays in the hit-test tree and blocks clicks.
          display: 'none',
          pointerEvents: 'none',
          '&[open]': {
            display: 'flex',
            pointerEvents: 'auto',
            border: 'none',
            margin: 0,
            padding: `max(12vh, 72px) ${t.space[4].var} ${t.space[5].var}`,
            maxWidth: 'none',
            maxHeight: 'none',
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            color: 'inherit',
            ...layerZIndex(t.zIndex.overlay.var),
            justifyContent: 'center',
            alignItems: 'flex-start',
            overflow: 'visible',
            '&::backdrop': {
              backgroundColor: vars.backdropBackground.var,
              transition: t.transition.backdrop.var,
              '@supports (backdrop-filter: blur(1px))': {
                backdropFilter: 'blur(10px)',
              },
            },
          },
        },
        dialog: {
          position: 'relative',
          zIndex: t.zIndex.raised.var,
          width: 'min(560px, 100%)',
          maxHeight: 'min(72vh, 640px)',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: t.fontFamily.body.var,
          backgroundColor: vars.dialogBackground.var,
          borderRadius: t.radius.lg.var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: vars.dialogBorder.var,
          boxShadow: t.shadow.xl.var,
          overflow: 'hidden',
          opacity: 0,
          transition: t.transition.panelEnter.var,
          '&[data-open]': {
            opacity: 1,
          },
          '&[data-starting-style], &[data-ending-style]': {
            opacity: 0,
          },
          ...atReducedMotion({
            transition: 'none',
          }),
          ...atDarkMode({
            boxShadow: 'none',
          }),
        },
        inputRow: {
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: t.space[2].var,
          padding: `${t.space[3].var} ${t.space[4].var}`,
          borderBottomWidth: t.borderWidth.default.var,
          borderBottomStyle: 'solid',
          borderBottomColor: vars.inputRowBorder.var,
          '& > :last-child': {
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
        },
        results: {
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          margin: 0,
          padding: t.space[2].var,
          listStyle: 'none',
        },
        group: {
          margin: 0,
          padding: 0,
        },
        groupHeading: {
          padding: `${t.space[2].var} ${t.space[4].var} ${t.space[1].var}`,
          fontSize: t.fontSize.xs.var,
          fontWeight: t.fontWeight.semibold.var,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: vars.groupHeadingColor.var,
        },
        result: {
          margin: 0,
        },
        resultLink: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[3].var,
          padding: `${t.space[2].var} ${t.space[4].var}`,
          textDecoration: 'none',
          color: vars.resultForeground.var,
          transition: t.transition.surfaceFast.var,
          borderRadius: t.radius.navItem.var,
          '&:hover': {
            backgroundColor: vars.resultHoverBackground.var,
          },
        },
        resultLinkActive: {
          backgroundColor: vars.resultSelectedBackground.var,
          color: vars.resultSelectedForeground.var,
        },
        resultIcon: {
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          color: vars.resultMetaColor.var,
          lineHeight: 0,
        },
        resultBody: {
          flex: '1 1 auto',
          minWidth: 0,
        },
        resultShortcut: {
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.space[1].var,
          marginInlineStart: 'auto',
        },
        resultTitle: {
          display: 'block',
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.semibold.var,
          lineHeight: 1.35,
          marginBottom: t.space[1].var,
        },
        resultMeta: {
          display: 'block',
          fontSize: t.fontSize.sm.var,
          color: vars.resultMetaColor.var,
          lineHeight: 1.35,
        },
        mark: {
          fontFamily: 'inherit',
          backgroundColor: vars.markBackground.var,
          color: vars.markForeground.var,
          borderRadius: t.radius.sm.var,
          padding: `0 ${t.space[1].var}`,
        },
        empty: {
          padding: `${t.space[4].var} ${t.space[4].var}`,
          fontSize: t.fontSize.sm.var,
          color: vars.emptyColor.var,
          lineHeight: 1.5,
        },
      },
      variants: {
        open: {
          false: {},
          true: {
            dialog: {
              opacity: 1,
            },
          },
        },
      },
    };
  },
});

/** Visual props derived from the schema. */
export type CommandPaletteVariantProps = RecipeVariants<typeof commandPalette>;
