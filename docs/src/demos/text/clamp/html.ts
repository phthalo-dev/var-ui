import { recipeVars, styleVars } from '@var-ui/core/components/styleVars';
import { textBlock } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

const textVars = recipeVars(textBlock);

const clamp20 = styleVars([[textVars.lineClamp, 20]]);
const clamp20Style = clamp20
  ? Object.entries(clamp20)
      .map(([name, value]) => `${name}: ${value}`)
      .join('; ')
  : undefined;

const PROBLEM_STATEMENT =
  'The migration stalls whenever a shard reports a partial heartbeat, because the reconciliation job treats every retry as a fresh conflict and rewrites the target row.';

export function render(): string {
  return [
    serializeHtmlTag(
      'p',
      mergeProps(textBlock({ eyebrow: true, size: 'xs', tone: 'secondary' })),
      'Agent output',
    ),
    serializeHtmlTag(
      'p',
      mergeProps(textBlock({ whiteSpace: 'pre-wrap' })),
      'Step 1: index rebuilt\nStep 2: pending review',
    ),
    serializeHtmlTag(
      'p',
      mergeProps(textBlock({ lineClamp: '2', tone: 'secondary' })),
      PROBLEM_STATEMENT,
    ),
    serializeHtmlTag(
      'p',
      { ...mergeProps(textBlock({ lineClamp: 'n' })), style: clamp20Style },
      PROBLEM_STATEMENT,
    ),
  ].join('\n');
}
