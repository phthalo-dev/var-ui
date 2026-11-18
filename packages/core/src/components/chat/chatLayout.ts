import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../../runtime';
import { designTokens as t } from '../../tokens';
import { borderSide } from '../../internal/border';

/**
 * Structural shell for a full chat interface: a scrollable message area above the composer dock.
 * Give the root a bounded height (a flex parent, `maxHeight`) and the messages scroll inside it
 * while the dock stays put. No JS measurement — density/spacing only.
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
    maxHeight: { syntax: '*', initial: 'none', value: 'none' },
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
          maxHeight: vars.maxHeight.var,
        },
        messageArea: {
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
        },
        // Not sticky: inside a clipped or scrolling ancestor a sticky dock floated over the
        // messages. The bounded root already keeps it under the message area.
        dock: {
          position: 'relative',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: t.space.xs.var,
          padding: t.space.sm.var,
          backgroundColor: vars.background.var,
          ...borderSide('block-start', vars.border.var),
        },
      },
    };
  },
});

/** Visual props derived from the schema. */
export type ChatLayoutVariantProps = RecipeVariants<typeof chatLayout>;
