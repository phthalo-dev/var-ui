import { svg as checkSvg } from '@var-ui/icons/glyphs/check';
import { svg as copySvg } from '@var-ui/icons/glyphs/copy';
import { svg as errorSvg } from '@var-ui/icons/glyphs/error';
import { copyText, copyTimeout, dispatchCopyResult } from './copy';

export { copyText } from './copy';

const INIT_ATTR = 'data-var-ui-code-copy-initialized';

type CopyState = 'idle' | 'copied' | 'error';

const ICONS: Record<CopyState, string> = { idle: copySvg, copied: checkSvg, error: errorSvg };

/** The button's name in each state, from `data-copy-label` / `data-copied-label` / `data-error-label`. */
function labels(btn: HTMLButtonElement): Record<CopyState, string> {
  return {
    idle: btn.getAttribute('data-copy-label') ?? 'Copy code',
    copied: btn.getAttribute('data-copied-label') ?? 'Copied',
    error: btn.getAttribute('data-error-label') ?? 'Copy failed',
  };
}

function setState(btn: HTMLButtonElement, state: CopyState): void {
  const label = labels(btn)[state];
  btn.toggleAttribute('data-copied', state === 'copied');
  btn.toggleAttribute('data-error', state === 'error');
  btn.setAttribute('aria-label', label);

  const iconEl = btn.querySelector('[data-codeblock-copy-icon]');
  if (iconEl) iconEl.innerHTML = ICONS[state];

  // Announces the result; the recipe shows it only for errors (success has the check).
  const feedback = btn.parentElement?.querySelector('[data-codeblock-feedback]');
  if (feedback) {
    feedback.textContent = state === 'idle' ? '' : label;
    if (state === 'idle') feedback.removeAttribute('data-tone');
    else feedback.setAttribute('data-tone', state === 'copied' ? 'success' : 'error');
  }
}

/**
 * Wires every `[data-var-ui-code-copy]` button (Astro `CodeBlock`, or the same markup by hand):
 * copies `data-code`, swaps the icon and name for `data-timeout` ms (default 2000), announces
 * the result in the sibling `[data-codeblock-feedback]`, and fires `var-ui:copied` /
 * `var-ui:copy-error` like `CopyButton`.
 */
export function initCodeBlockCopy(root: ParentNode = document): void {
  root.querySelectorAll<HTMLButtonElement>('[data-var-ui-code-copy]').forEach((btn) => {
    if (btn.hasAttribute(INIT_ATTR)) return;
    btn.setAttribute(INIT_ATTR, '');
    if (!btn.getAttribute('aria-label')) btn.setAttribute('aria-label', labels(btn).idle);

    btn.addEventListener('click', async () => {
      const code = btn.getAttribute('data-code') ?? '';
      const ok = await copyText(code);
      setState(btn, ok ? 'copied' : 'error');
      dispatchCopyResult(btn, ok, code);
      window.setTimeout(() => setState(btn, 'idle'), copyTimeout(btn));
    });
  });
}
