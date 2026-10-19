import { button, dialog } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

const closeIcon =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg>';

export function render(): string {
  const d = dialog();
  const trigger = serializeHtmlTag(
    'button',
    {
      type: 'button',
      ...mergeProps(button({})),
      disabled: true,
    },
    'Open dialog',
  );
  const heading = serializeHtmlTag(
    'h2',
    { id: 'dialog-demo-title', ...mergeProps(d.heading) },
    'Icon close button',
  );
  const closeBtn = serializeHtmlTag(
    'button',
    { type: 'button', ...mergeProps(d.closeButton), 'aria-label': 'Close', disabled: true },
    closeIcon,
  );
  const header = serializeHtmlTag('div', mergeProps(d.header), `${heading}${closeBtn}`);
  const description = serializeHtmlTag(
    'p',
    mergeProps(d.description),
    'The dismiss control now uses the registry close glyph.',
  );
  const closeAction = serializeHtmlTag(
    'button',
    { type: 'button', ...mergeProps(button({})), disabled: true },
    'Close',
  );
  const content = serializeHtmlTag(
    'div',
    mergeProps(d.content),
    `${header}${description}${closeAction}`,
  );
  const modal = serializeHtmlTag(
    'div',
    {
      ...mergeProps(d.modal),
      role: 'dialog',
      'aria-labelledby': 'dialog-demo-title',
      'aria-modal': 'true',
    },
    content,
  );
  const overlay = serializeHtmlTag(
    'div',
    {
      ...mergeProps(d.overlay),
      style: 'position: relative; inset: auto; min-height: 220px',
    },
    modal,
  );
  return `<div style="display: grid; gap: 1rem">${trigger}${overlay}</div>`;
}
