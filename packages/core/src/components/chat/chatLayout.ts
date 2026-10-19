import { type RecipeVariants } from 'typestyles';
import { typestyles } from '../../runtime';
import { designTokens as t } from '../../tokens';

/**
 * Structural shell for a full chat interface: a scrollable message area
 * above a sticky composer dock. No JS measurement — density/spacing only.
 *
 * ```tsx
 * <div className={chatLayout().root}>…</div>
 * ```
 */
export const chatLayout = typestyles.recipe(
  'chat-layout',
  (c) => {
    const v = c.vars({
      background: { value: t.color.background.surface.var, syntax: '<color>' },
      border: { value: t.color.border.default.var, syntax: '<color>' },
    });
    return {
      slots: ['root', 'messageArea', 'dock'],
      root: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
      },
      messageArea: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
      },
      dock: {
        position: 'sticky',
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[2].var,
        padding: t.space[3].var,
        backgroundColor: v.background.var,
        borderTopWidth: t.borderWidth.default.var,
        borderTopStyle: 'solid',
        borderTopColor: v.border.var,
      },
    };
  },
  { layer: 'components' },
);

/** Visual props derived from the schema. */
export type ChatLayoutVariantProps = RecipeVariants<typeof chatLayout>;
