import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { overlayPresenceStyles } from './overlayPresence';

/**
 * Standalone popover panel chrome (distinct from menu/select popover slots).
 *
 * ```ts
 * const p = popover();
 * <div className={p.root}>…</div>
 * ```
 */
export const popover = typestyles.recipe(
  'popover',
  (c) => {
    const v = c.vars({
      background: {
        value: t.color.background.surface.var,
        syntax: '<color>',
      },
      border: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      titleForeground: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
    });
    return {
      slots: ['root', 'title', 'content', 'arrow'],
      root: {
        ...overlayPresenceStyles({ scale: true }),
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: v.border.var,
        borderRadius: t.radius.md.var,
        backgroundColor: v.background.var,
        boxShadow: t.shadow.md.var,
        minWidth: '12rem',
        maxHeight: 'var(--var-ui-available-height, none)',
        outline: 'none',
      },
      title: {
        fontSize: t.fontSize.md.var,
        fontWeight: t.fontWeight.semibold.var,
        color: v.titleForeground.var,
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
        backgroundColor: v.background.var,
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
    };
  },
  { layer: 'components' },
);
