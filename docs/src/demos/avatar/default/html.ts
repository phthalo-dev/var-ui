import { avatar, statusDot } from '@var-ui/core';
import { combine, mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

export function render(): string {
  const a = avatar({ size: 'md' });
  const initials = serializeHtmlTag(
    'span',
    { ...mergeProps(a.initials), role: 'img', 'aria-label': 'Ada Lovelace' },
    'AL',
  );
  const status = serializeHtmlTag('span', combine(statusDot({ tone: 'success' }), a.status), '');
  return serializeHtmlTag('span', mergeProps(a.root), `${initials}${status}`);
}
