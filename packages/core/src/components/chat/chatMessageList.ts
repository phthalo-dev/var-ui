import { typestyles } from '../../runtime';
import { designTokens as t } from '../../tokens';
import { density } from '../../shared/variantAxes';
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
export const chatMessageList = typestyles.recipe({
  name: 'chat-message-list',
  layer: 'components',
  slots: ['root', 'inner', 'emptyState', 'loading'],
  variants: { density },
  styles: () => ({
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
      loading: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: t.space.md.var,
      },
    },
    variants: {
      density: {
        compact: { inner: { gap: t.space.xs.var, padding: t.space.xs.var } },
        balanced: { inner: { gap: t.space.md.var, padding: t.space.md.var } },
        spacious: { inner: { gap: t.space.xl.var, padding: t.space.xl.var } },
      },
    },
  }),
});

/** Visual props derived from the schema. */
export type ChatMessageListVariantProps = RecipeVariants<typeof chatMessageList>;
