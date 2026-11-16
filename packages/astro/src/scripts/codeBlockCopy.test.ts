import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { copyText, initCodeBlockCopy } from './codeBlockCopy';

describe('copyText', () => {
  it('writes to clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    // @ts-expect-error test stub
    globalThis.navigator = { clipboard: { writeText } };
    await expect(copyText('hello')).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith('hello');
  });
});

describe('initCodeBlockCopy', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  function mountCopyButton(options?: { copiedLabel?: string; copyErrorLabel?: string }) {
    const copiedLabel = options?.copiedLabel ?? 'Copied';
    const copyErrorLabel = options?.copyErrorLabel ?? 'Copy failed';

    document.body.innerHTML = `
      <div data-codeblock-actions>
        <button
          type="button"
          data-var-ui-code-copy
          data-code="hello"
          data-copy-label="Copy code"
          data-copied-label="${copiedLabel}"
          data-copy-error-label="${copyErrorLabel}"
          aria-label="Copy code"
        >
          <span data-codeblock-copy-icon>
            <svg data-icon="copy"><rect x="9" y="9"></rect></svg>
          </span>
          <span data-codeblock-copy-text>Copy</span>
        </button>
        <span data-codeblock-feedback role="status"></span>
      </div>
    `;
  }

  it('updates button text, icon, and feedback on success with custom label', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    // @ts-expect-error test stub
    globalThis.navigator = { clipboard: { writeText } };

    mountCopyButton({ copiedLabel: 'Saved to clipboard' });
    initCodeBlockCopy();

    const btn = document.querySelector<HTMLButtonElement>('[data-var-ui-code-copy]')!;
    btn.click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(btn.getAttribute('aria-label')).toBe('Saved to clipboard');
    expect(btn.getAttribute('data-copied')).toBe('');
    expect(btn.querySelector('[data-codeblock-copy-text]')?.textContent).toBe('Copied');
    expect(btn.querySelector('[data-codeblock-copy-icon] svg path')?.getAttribute('d')).toBe(
      'M4.5 12.5l5 5L19.5 7',
    );

    const feedback = document.querySelector('[data-codeblock-feedback]')!;
    expect(feedback.textContent).toBe('Saved to clipboard');
    expect(feedback.getAttribute('data-tone')).toBe('success');
  });

  it('does not duplicate default copied label in inline feedback', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    // @ts-expect-error test stub
    globalThis.navigator = { clipboard: { writeText } };

    mountCopyButton();
    initCodeBlockCopy();

    const btn = document.querySelector<HTMLButtonElement>('[data-var-ui-code-copy]')!;
    btn.click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(btn.querySelector('[data-codeblock-copy-text]')?.textContent).toBe('Copied');
    expect(document.querySelector('[data-codeblock-feedback]')?.textContent).toBe('');
  });

  it('updates button text and feedback on error', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    // @ts-expect-error test stub
    globalThis.navigator = { clipboard: { writeText } };

    mountCopyButton({ copyErrorLabel: 'Could not copy' });
    initCodeBlockCopy();

    const btn = document.querySelector<HTMLButtonElement>('[data-var-ui-code-copy]')!;
    btn.click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(btn.getAttribute('aria-label')).toBe('Could not copy');
    expect(btn.getAttribute('data-error')).toBe('');
    expect(btn.querySelector('[data-codeblock-copy-text]')?.textContent).toBe('Error');

    const feedback = document.querySelector('[data-codeblock-feedback]')!;
    expect(feedback.textContent).toBe('Could not copy');
    expect(feedback.getAttribute('data-tone')).toBe('error');
  });

  it('resets copy state after timeout', async () => {
    vi.useFakeTimers();
    try {
      const writeText = vi.fn().mockResolvedValue(undefined);
      // @ts-expect-error test stub
      globalThis.navigator = { clipboard: { writeText } };

      mountCopyButton();
      initCodeBlockCopy();

      const btn = document.querySelector<HTMLButtonElement>('[data-var-ui-code-copy]')!;
      btn.click();
      vi.runAllTicks();

      vi.advanceTimersByTime(1200);

      expect(btn.getAttribute('data-copied')).toBeNull();
      expect(btn.getAttribute('aria-label')).toBe('Copy code');
      expect(btn.querySelector('[data-codeblock-copy-text]')?.textContent).toBe('Copy');
      expect(document.querySelector('[data-codeblock-feedback]')?.textContent).toBe('');
    } finally {
      vi.useRealTimers();
    }
  });
});
