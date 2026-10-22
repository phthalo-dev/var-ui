import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { overlayPresenceStyles } from '../shared/overlayMotion';
import { layerZIndex } from './layerVars';
import { positioner } from './positionerVars';

/**
 * Standalone popover panel chrome (distinct from menu/select popover slots).
 *
 * ```ts
 * const p = popover();
 * <div className={p.root.className}>…</div>
 * ```
 */
export const popover = typestyles.recipe({
  name: 'popover',
  layer: 'components',
  slots: ['root', 'title', 'content', 'arrow'],
  vars: {
    background: {
      ...atProperty.color,
      value: t.color.background.surface.var,
    },
    border: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
    titleForeground: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          ...overlayPresenceStyles({ scale: true }),
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: vars.border.var,
          borderRadius: t.radius.md.var,
          backgroundColor: vars.background.var,
          boxShadow: t.shadow.md.var,
          ...layerZIndex(t.zIndex.dropdown.var),
          minWidth: '12rem',
          maxHeight: positioner.vars.availableHeight.var,
          outline: 'none',
        },
        title: {
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.semibold.var,
          color: vars.titleForeground.var,
          margin: 0,
          padding: `${t.space[3].var} ${t.space[3].var} ${t.space[2].var}`,
        },
        content: {
          padding: `${t.space[2].var} ${t.space[3].var} ${t.space[3].var}`,
          outline: 'none',
        },
        arrow: {
          width: 8,
          height: 8,
          backgroundColor: vars.background.var,
          transform: 'rotate(45deg)',
          '&[data-placement="bottom"]': {
            transform: 'translateY(50%) rotate(45deg)',
          },
          '&[data-placement="top"]': {
            transform: 'translateY(-50%) rotate(45deg)',
          },
          '&[data-placement="left"]': {
            transform: 'translateX(-50%) rotate(45deg)',
          },
          '&[data-placement="right"]': {
            transform: 'translateX(50%) rotate(45deg)',
          },
        },
      },
    };
  },
});
