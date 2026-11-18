import { unstyledButton } from '@var-ui/core';
import { svg as chevronRightSvg } from '@var-ui/icons/glyphs/chevronRight';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  return serializeHtmlTag(
    'button',
    { type: 'button', 'aria-expanded': 'false', ...mergeProps(unstyledButton()) },
    `${chevronRightSvg}Build details`,
  );
}
