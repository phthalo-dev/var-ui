import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { initCopyButton, initCopyButtons } from './copyButton';

describe('initCopyButton', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  function mountCopyButton(options?: {
    value?: string;
    timeout?: number;
    copiedLabel?: string;
    errorLabel?: string;
  }) {
    document.body.innerHTML = `
      <button
        type="button"
        data-var-ui-copy-button
        data-value="${options?.value ?? 'npx @var-ui/cli init'}"
        ${options?.timeout !== undefined ? `data-timeout="${options.timeout}"` : ''}
        data-copy-label="Copy"
        data-copied-label="${options?.copiedLabel ?? 'Copied'}"
        data-error-label="${options?.errorLabel ?? 'Error'}"
        data-class-idle="btn idle"
        data-class-copied="btn copied"
        data-class-error="btn error"
        aria-label="Copy"
      >
        <span data-copy-button-icon>
          <svg data-icon="copy"><path d="copy"></path></svg>
        </span>
        <span data-copy-button-text>Copy</span>
      </button>
    `;
    return document.querySelector<HTMLButtonElement>('[data-var-ui-copy-button]')!;
  }

  function stubClipboard(impl: () => Promise<unknown>) {
    const writeText = vi.fn(impl);
    // @ts-expect-error test stub
    globalThis.navigator = { clipboard: { writeText } };
    return writeText;
  }

  it('writes the value to the clipboard and enters the copied state', async () => {
    const writeText = stubClipboard(() => Promise.resolve());

    const btn = mountCopyButton();
    initCopyButton(btn);
    btn.click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(writeText).toHaveBeenCalledWith('npx @var-ui/cli init');
    expect(btn.getAttribute('data-copied')).toBe('');
    expect(btn.getAttribute('aria-label')).toBe('Copied');
    expect(btn.className).toBe('btn copied');
    expect(btn.querySelector('[data-copy-button-text]')?.textContent).toBe('Copied');
    expect(btn.querySelector('[data-copy-button-icon] svg path')?.getAttribute('d')).toBe(
      'M4.5 12.5l5 5L19.5 7',
    );
  });

  it('enters the error state and uses custom labels on failure', async () => {
    stubClipboard(() => Promise.reject(new Error('denied')));

    const btn = mountCopyButton({ errorLabel: 'Could not copy' });
    initCopyButton(btn);
    btn.click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(btn.getAttribute('data-error')).toBe('');
    expect(btn.getAttribute('aria-label')).toBe('Could not copy');
    expect(btn.className).toBe('btn error');
    expect(btn.querySelector('[data-copy-button-text]')?.textContent).toBe('Could not copy');
    expect(btn.querySelector('[data-copy-button-icon] svg path')?.getAttribute('d')).toBe(
      'M12 7.5v5.5M12 16.5h.01',
    );
  });

  it('resets to idle after the timeout', async () => {
    vi.useFakeTimers();
    try {
      stubClipboard(() => Promise.resolve());

      const btn = mountCopyButton({ timeout: 2000 });
      initCopyButton(btn);
      btn.click();
      await vi.advanceTimersByTimeAsync(0);
      expect(btn.getAttribute('data-copied')).toBe('');

      await vi.advanceTimersByTimeAsync(2000);

      expect(btn.getAttribute('data-copied')).toBeNull();
      expect(btn.getAttribute('aria-label')).toBe('Copy');
      expect(btn.className).toBe('btn idle');
      expect(btn.querySelector('[data-copy-button-text]')?.textContent).toBe('Copy');
      expect(btn.querySelector('[data-copy-button-icon] svg rect')?.getAttribute('x')).toBe('9');
    } finally {
      vi.useRealTimers();
    }
  });

  it('defaults the reset timeout to 2000ms', async () => {
    vi.useFakeTimers();
    try {
      stubClipboard(() => Promise.resolve());

      const btn = mountCopyButton();
      initCopyButton(btn);
      btn.click();
      await vi.advanceTimersByTimeAsync(1999);
      expect(btn.getAttribute('data-copied')).toBe('');

      await vi.advanceTimersByTimeAsync(1);
      expect(btn.getAttribute('data-copied')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('does not double-initialize', async () => {
    const writeText = stubClipboard(() => Promise.resolve());

    const btn = mountCopyButton();
    initCopyButton(btn);
    initCopyButton(btn);
    btn.click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(writeText).toHaveBeenCalledTimes(1);
  });

  it('initCopyButtons initializes every button in the root', async () => {
    const writeText = stubClipboard(() => Promise.resolve());

    document.body.innerHTML = `
      <button type="button" data-var-ui-copy-button data-value="a" aria-label="Copy">
        <span data-copy-button-icon></span><span data-copy-button-text>Copy</span>
      </button>
      <button type="button" data-var-ui-copy-button data-value="b" aria-label="Copy">
        <span data-copy-button-icon></span><span data-copy-button-text>Copy</span>
      </button>
    `;
    initCopyButtons();

    const buttons = document.querySelectorAll<HTMLButtonElement>('[data-var-ui-copy-button]');
    buttons[0].click();
    buttons[1].click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(writeText).toHaveBeenNthCalledWith(1, 'a');
    expect(writeText).toHaveBeenNthCalledWith(2, 'b');
  });
});
