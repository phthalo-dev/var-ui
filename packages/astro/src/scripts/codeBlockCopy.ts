import { svg as checkSvg } from '@var-ui/icons/glyphs/check';
import { svg as copySvg } from '@var-ui/icons/glyphs/copy';

const INIT_ATTR = 'data-var-ui-code-copy-initialized';
const RESET_MS = 1200;

const COPY_ICON = copySvg;
const CHECK_ICON = checkSvg;

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function getIconEl(btn: HTMLButtonElement): HTMLElement | null {
  return btn.querySelector('[data-codeblock-copy-icon]');
}

function getTextEl(btn: HTMLButtonElement): HTMLElement | null {
  return btn.querySelector('[data-codeblock-copy-text]');
}

function getFeedback(btn: HTMLButtonElement): HTMLElement | null {
  return btn.parentElement?.querySelector('[data-codeblock-feedback]') ?? null;
}

function swapClasses(el: HTMLElement, add: string | null, remove: string[]): void {
  for (const className of remove) {
    if (className) el.classList.remove(className);
  }
  if (add) el.classList.add(add);
}

function setCopySuccess(btn: HTMLButtonElement, copiedLabel: string): void {
  btn.setAttribute('data-copied', '');
  btn.removeAttribute('data-error');
  btn.setAttribute('aria-label', copiedLabel);

  swapClasses(btn, btn.getAttribute('data-class-copied'), [
    btn.getAttribute('data-class-idle') ?? '',
    btn.getAttribute('data-class-error') ?? '',
  ]);

  const iconEl = getIconEl(btn);
  if (iconEl) iconEl.innerHTML = CHECK_ICON;

  const textEl = getTextEl(btn);
  if (textEl) textEl.textContent = 'Copied';

  const feedback = getFeedback(btn);
  if (feedback) {
    // Button label already reads "Copied"; skip inline feedback when labels match.
    if (copiedLabel === 'Copied') {
      feedback.textContent = '';
      swapClasses(feedback, null, [
        feedback.getAttribute('data-class-success') ?? '',
        feedback.getAttribute('data-class-error') ?? '',
      ]);
    } else {
      feedback.textContent = copiedLabel;
      swapClasses(feedback, feedback.getAttribute('data-class-success'), [
        feedback.getAttribute('data-class-error') ?? '',
      ]);
    }
  }
}

function setCopyError(btn: HTMLButtonElement, copyErrorLabel: string): void {
  btn.removeAttribute('data-copied');
  btn.setAttribute('data-error', '');
  btn.setAttribute('aria-label', copyErrorLabel);

  swapClasses(btn, btn.getAttribute('data-class-error'), [
    btn.getAttribute('data-class-idle') ?? '',
    btn.getAttribute('data-class-copied') ?? '',
  ]);

  const iconEl = getIconEl(btn);
  if (iconEl) iconEl.innerHTML = COPY_ICON;

  const textEl = getTextEl(btn);
  if (textEl) textEl.textContent = 'Error';

  const feedback = getFeedback(btn);
  if (feedback) {
    feedback.textContent = copyErrorLabel;
    swapClasses(feedback, feedback.getAttribute('data-class-error'), [
      feedback.getAttribute('data-class-success') ?? '',
    ]);
  }
}

function resetCopyButton(btn: HTMLButtonElement): void {
  btn.removeAttribute('data-copied');
  btn.removeAttribute('data-error');

  const copyLabel = btn.getAttribute('data-copy-label') ?? 'Copy code';
  btn.setAttribute('aria-label', copyLabel);

  swapClasses(btn, btn.getAttribute('data-class-idle'), [
    btn.getAttribute('data-class-copied') ?? '',
    btn.getAttribute('data-class-error') ?? '',
  ]);

  const iconEl = getIconEl(btn);
  if (iconEl) iconEl.innerHTML = COPY_ICON;

  const textEl = getTextEl(btn);
  if (textEl) textEl.textContent = 'Copy';

  const feedback = getFeedback(btn);
  if (feedback) {
    feedback.textContent = '';
    swapClasses(feedback, null, [
      feedback.getAttribute('data-class-success') ?? '',
      feedback.getAttribute('data-class-error') ?? '',
    ]);
  }
}

export function initCodeBlockCopy(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-var-ui-code-copy]').forEach((btn) => {
    if (btn.hasAttribute(INIT_ATTR)) return;
    btn.setAttribute(INIT_ATTR, '');

    btn.addEventListener('click', async () => {
      const code = btn.getAttribute('data-code') ?? '';
      const copiedLabel = btn.getAttribute('data-copied-label') ?? 'Copied';
      const copyErrorLabel = btn.getAttribute('data-copy-error-label') ?? 'Copy failed';

      const ok = await copyText(code);
      if (ok) {
        setCopySuccess(btn, copiedLabel);
      } else {
        setCopyError(btn, copyErrorLabel);
      }

      window.setTimeout(() => resetCopyButton(btn), RESET_MS);
    });

    if (!btn.getAttribute('aria-label')) {
      btn.setAttribute('aria-label', btn.getAttribute('data-copy-label') ?? 'Copy code');
    }
  });
}
