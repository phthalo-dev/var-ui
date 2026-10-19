import { variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { atDarkMode, atReducedMotion } from '../theme/conditions';
import { designTokens as t } from '../tokens';

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
export const commandPalette = typestyles.recipe(
  'command-palette',
  {
    slots: [
      'root',
      'dialog',
      'inputRow',
      'inputIcon',
      'input',
      'results',
      'result',
      'resultLink',
      'resultLinkActive',
      'resultTitle',
      'resultMeta',
      'mark',
      'empty',
    ],
    variants: {
      open: variant.boolean({ default: false }),
    },
  },
  (c) => {
    const v = c.vars({
      backdropBackground: {
        value: t.color.overlay.backdrop.var,
        syntax: '<color>',
      },
      dialogBackground: {
        value: t.color.background.surface.var,
        syntax: '<color>',
      },
      dialogBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      inputRowBorder: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      inputIconColor: {
        value: t.color.text.placeholder.var,
        syntax: '<color>',
      },
      inputForeground: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      inputPlaceholder: {
        value: t.color.text.placeholder.var,
        syntax: '<color>',
      },
      resultForeground: {
        value: t.color.navItem.foreground.var,
        syntax: '<color>',
      },
      resultHoverBackground: {
        value: t.color.navItem.hoverBackground.var,
        syntax: '<color>',
      },
      resultSelectedBackground: {
        value: t.color.navItem.selectedBackground.var,
        syntax: '<color>',
      },
      resultSelectedForeground: {
        value: t.color.navItem.selectedForeground.var,
        syntax: '<color>',
      },
      resultMetaColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      markBackground: {
        value: t.color.tone.accent.subtleBackground.var,
        syntax: '<color>',
      },
      markForeground: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      emptyColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
    });
    return {
      base: {
        root: {
          [v.backdropBackground.name]: t.color.overlay.backdrop.var,
          [v.dialogBackground.name]: t.color.background.surface.var,
          [v.dialogBorder.name]: t.color.border.default.var,
          [v.inputRowBorder.name]: t.color.border.default.var,
          [v.inputIconColor.name]: t.color.text.placeholder.var,
          [v.inputForeground.name]: t.color.text.primary.var,
          [v.inputPlaceholder.name]: t.color.text.placeholder.var,
          [v.resultForeground.name]: t.color.navItem.foreground.var,
          [v.resultHoverBackground.name]: t.color.navItem.hoverBackground.var,
          [v.resultSelectedBackground.name]: t.color.navItem.selectedBackground.var,
          [v.resultSelectedForeground.name]: t.color.navItem.selectedForeground.var,
          [v.resultMetaColor.name]: t.color.text.secondary.var,
          [v.markBackground.name]: t.color.tone.accent.subtleBackground.var,
          [v.markForeground.name]: t.color.text.primary.var,
          [v.emptyColor.name]: t.color.text.secondary.var,
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
            zIndex: t.zIndex.overlay.var,
            justifyContent: 'center',
            alignItems: 'flex-start',
            overflow: 'visible',
            '&::backdrop': {
              backgroundColor: v.backdropBackground.var,
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
          backgroundColor: v.dialogBackground.var,
          borderRadius: t.radius.lg.var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: v.dialogBorder.var,
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
          borderBottomColor: v.inputRowBorder.var,
        },
        inputIcon: {
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          color: v.inputIconColor.var,
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
          color: v.inputForeground.var,
          outline: 'none',
          '&::placeholder': { color: v.inputPlaceholder.var },
        },
        results: {
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          margin: 0,
          padding: t.space[2].var,
          listStyle: 'none',
        },
        result: {
          margin: 0,
        },
        resultLink: {
          display: 'block',
          padding: `${t.space[2].var} ${t.space[4].var}`,
          textDecoration: 'none',
          color: v.resultForeground.var,
          transition: t.transition.surfaceFast.var,
          borderRadius: t.radius.navItem.var,
          '&:hover': {
            backgroundColor: v.resultHoverBackground.var,
          },
        },
        resultLinkActive: {
          backgroundColor: v.resultSelectedBackground.var,
          color: v.resultSelectedForeground.var,
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
          color: v.resultMetaColor.var,
          lineHeight: 1.35,
        },
        mark: {
          fontFamily: 'inherit',
          backgroundColor: v.markBackground.var,
          color: v.markForeground.var,
          borderRadius: t.radius.sm.var,
          padding: `0 ${t.space[1].var}`,
        },
        empty: {
          padding: `${t.space[4].var} ${t.space[4].var}`,
          fontSize: t.fontSize.sm.var,
          color: v.emptyColor.var,
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
  { layer: 'components' },
);

/** Visual props derived from the schema. */
export type CommandPaletteVariantProps = RecipeVariants<typeof commandPalette>;
