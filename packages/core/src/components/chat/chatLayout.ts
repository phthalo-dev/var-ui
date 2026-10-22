import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../../runtime';
import { designTokens as t } from '../../tokens';

/**
 * Structural shell for a full chat interface: a scrollable message area
 * above a sticky composer dock. No JS measurement — density/spacing only.
 *
 * ```tsx
 * <div className={chatLayout().root.className}>…</div>
 * ```
 */
export const chatLayout = typestyles.recipe({
  name: 'chat-layout',
  layer: 'components',
  slots: ['root', 'messageArea', 'dock'],
  vars: {
    background: { ...atProperty.color, value: t.color.background.surface.var },
    border: { ...atProperty.color, value: t.color.border.default.var },
  },
  styles: ({ vars }) => {
    return {
      base: {
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
          backgroundColor: vars.background.var,
          borderTopWidth: t.borderWidth.default.var,
          borderTopStyle: 'solid',
          borderTopColor: vars.border.var,
        },
      },
    };
  },
});

/** Visual props derived from the schema. */
export type ChatLayoutVariantProps = RecipeVariants<typeof chatLayout>;
