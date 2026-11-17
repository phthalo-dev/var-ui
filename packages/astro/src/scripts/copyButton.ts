import { svg as checkSvg } from '@var-ui/icons/glyphs/check';
import { svg as copySvg } from '@var-ui/icons/glyphs/copy';
import { svg as errorSvg } from '@var-ui/icons/glyphs/error';
import { copyText } from './codeBlockCopy';

const SELECTOR = '[data-var-ui-copy-button]';
const INITIALIZED_ATTR = 'data-var-ui-copy-button-initialized';
const DEFAULT_TIMEOUT_MS = 2000;

const COPY_ICON = copySvg;
const CHECK_ICON = checkSvg;
const ERROR_ICON = errorSvg;

function getIconEl(btn: HTMLButtonElement): HTMLElement | null {
  return btn.querySelector('[data-copy-button-icon]');
}

function getTextEl(btn: HTMLButtonElement): HTMLElement | null {
  return btn.querySelector('[data-copy-button-text]');
}

function setState(
  btn: HTMLButtonElement,
  state: 'idle' | 'copied' | 'error',
  label: string,
  icon: string,
): void {
  btn.setAttribute('aria-label', label);
  if (state === 'idle') {
    btn.removeAttribute('data-copied');
    btn.removeAttribute('data-error');
  } else {
    btn.setAttribute(state === 'copied' ? 'data-copied' : 'data-error', '');
    btn.removeAttribute(state === 'copied' ? 'data-error' : 'data-copied');
  }

  const className =
    state === 'copied'
      ? (btn.getAttribute('data-class-copied') ?? '')
      : state === 'error'
        ? (btn.getAttribute('data-class-error') ?? '')
        : (btn.getAttribute('data-class-idle') ?? '');
  if (className) btn.className = className;

  const iconEl = getIconEl(btn);
  if (iconEl) iconEl.innerHTML = icon;

  const textEl = getTextEl(btn);
  if (textEl) textEl.textContent = label;
}

export function initCopyButton(btn: HTMLButtonElement): void {
  if (btn.hasAttribute(INITIALIZED_ATTR)) return;
  btn.setAttribute(INITIALIZED_ATTR, '');

  if (!btn.getAttribute('aria-label')) {
    btn.setAttribute('aria-label', btn.getAttribute('data-copy-label') ?? 'Copy');
  }

  btn.addEventListener('click', async () => {
    const value = btn.getAttribute('data-value') ?? '';
    const copyLabel = btn.getAttribute('data-copy-label') ?? 'Copy';
    const copiedLabel = btn.getAttribute('data-copied-label') ?? 'Copied';
    const errorLabel = btn.getAttribute('data-error-label') ?? 'Error';
    const timeout = Number(btn.getAttribute('data-timeout')) || DEFAULT_TIMEOUT_MS;

    const ok = await copyText(value);
    if (ok) {
      setState(btn, 'copied', copiedLabel, CHECK_ICON);
    } else {
      setState(btn, 'error', errorLabel, ERROR_ICON);
    }

    window.setTimeout(() => setState(btn, 'idle', copyLabel, COPY_ICON), timeout);
  });
}

export function initCopyButtons(root: ParentNode = document): void {
  root.querySelectorAll<HTMLButtonElement>(SELECTOR).forEach((btn) => {
    initCopyButton(btn);
  });
}
