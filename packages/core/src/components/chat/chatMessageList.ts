import { typestyles } from '../../runtime';
import { designTokens as t } from '../../tokens';
import { density } from '../variantAxes';
import { type RecipeVariants } from 'typestyles';

/**
 * Presentational scroll container for chat messages. `density` controls
 * inner gap/padding; scroll/auto-scroll behavior is owned by `ChatLayout`
 * (or wire `useChatStreamScroll` yourself when used standalone).
 *
 * ```tsx
 * <div className={chatMessageList({ density: 'balanced' }).root}>…</div>
 * ```
 */
export const chatMessageList = typestyles.recipe(
  'chat-message-list',
  {
    slots: ['root', 'inner', 'emptyState'],
    variants: { density },
  },
  () => ({
    base: {
      root: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
      },
      inner: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
      },
      emptyState: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        minHeight: 0,
      },
    },
    variants: {
      density: {
        compact: { inner: { gap: t.space[2].var, padding: t.space[2].var } },
        balanced: { inner: { gap: t.space[4].var, padding: t.space[4].var } },
        spacious: { inner: { gap: t.space[6].var, padding: t.space[6].var } },
      },
    },
  }),
  { layer: 'components' },
);

/** Visual props derived from the schema. */
export type ChatMessageListVariantProps = RecipeVariants<typeof chatMessageList>;
