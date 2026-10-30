import { variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../../runtime';
import { designTokens as t } from '../../tokens';
import { semanticTone } from '../../shared/semanticTone';

const toolCallsStatus = variant.enum(['pending', 'running', 'complete', 'error'], {
  default: 'complete',
});
const toolCallsExpanded = variant.boolean({ default: false });

/**
 * Tool/function call display. One call renders inline; the React wrapper
 * collapses 2+ calls into an expandable group using the `expanded` variant
 * here for the chevron rotation only (the show/hide of the list itself is
 * plain conditional rendering in React — no CSS transition in v1).
 *
 * ```tsx
 * <div className={chatToolCalls({ status: 'running' }).root}>…</div>
 * ```
 */
export const chatToolCalls = typestyles.recipe({
  name: 'chat-tool-calls',
  layer: 'components',
  slots: [
    'root',
    'header',
    'statusIcon',
    'name',
    'target',
    'duration',
    'chevron',
    'list',
    'detail',
  ],
  variants: {
    status: toolCallsStatus,
    expanded: toolCallsExpanded,
  },
  styles: () => ({
    base: {
      root: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[1].var,
        marginTop: t.space[2].var,
      },
      header: {
        display: 'flex',
        alignItems: 'center',
        gap: t.space[1].var,
        minHeight: '24px',
        cursor: 'pointer',
        userSelect: 'none',
        background: 'none',
        border: 'none',
        padding: 0,
        font: 'inherit',
        color: 'inherit',
      },
      statusIcon: {
        display: 'inline-flex',
        flexShrink: 0,
      },
      name: {
        fontSize: t.fontSize.sm.var,
        fontFamily: t.fontFamily.mono.var,
        fontWeight: t.fontWeight.medium.var,
        color: t.color.text.secondary.var,
      },
      target: {
        fontSize: t.fontSize.sm.var,
        color: t.color.text.secondary.var,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      duration: {
        fontSize: t.fontSize.sm.var,
        color: t.color.text.secondary.var,
        flexShrink: 0,
      },
      chevron: {
        display: 'inline-flex',
        marginInlineStart: 'auto',
        transition: t.transition.transform.var,
      },
      list: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[1].var,
        paddingInlineStart: t.space[4].var,
      },
      detail: {
        paddingInlineStart: t.space[4].var,
        paddingBottom: t.space[2].var,
      },
    },
    variants: {
      status: {
        pending: { statusIcon: { color: t.color.text.secondary.var } },
        running: { statusIcon: { color: semanticTone.accent.foreground } },
        complete: { statusIcon: { color: semanticTone.success.foreground } },
        error: { statusIcon: { color: semanticTone.danger.foreground } },
      },
      expanded: {
        true: { chevron: { transform: 'rotate(180deg)' } },
        false: {},
      },
    },
  }),
});

/** Visual props derived from the schema. */
export type ChatToolCallsVariantProps = RecipeVariants<typeof chatToolCalls>;
