import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { initCodeBlockCopy } from './codeBlockCopy';
import { COPIED_EVENT, COPY_ERROR_EVENT, copyText } from './copy';

const stubClipboard = (writeText: (text: string) => Promise<void>) => {
  // @ts-expect-error test stub
  globalThis.navigator = { clipboard: { writeText } };
};

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('copyText', () => {
  it('writes to clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubClipboard(writeText);
    await expect(copyText('hello')).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith('hello');
  });
});

describe('initCodeBlockCopy', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  function mount(attrs = '') {
    document.body.innerHTML = `
      <div data-codeblock-actions>
        <button type="button" data-var-ui-code-copy data-code="hello" ${attrs}>
          <span data-codeblock-copy-icon><svg data-icon="copy"></svg></span>
        </button>
        <span data-codeblock-feedback role="status"></span>
      </div>
    `;
    initCodeBlockCopy();
    return {
      btn: document.querySelector<HTMLButtonElement>('[data-var-ui-code-copy]')!,
      feedback: document.querySelector('[data-codeblock-feedback]')!,
    };
  }

  it('names the button with the default labels', () => {
    const { btn } = mount();
    expect(btn.getAttribute('aria-label')).toBe('Copy code');
  });

  it('on success: check icon, copiedLabel as name, announced (tone success), copied event', async () => {
    stubClipboard(vi.fn().mockResolvedValue(undefined));
    const { btn, feedback } = mount('data-copied-label="Saved"');
    const onCopied = vi.fn();
    document.body.addEventListener(COPIED_EVENT, (event) =>
      onCopied((event as CustomEvent).detail),
    );

    btn.click();
    await tick();

    expect(btn.hasAttribute('data-copied')).toBe(true);
    expect(btn.getAttribute('aria-label')).toBe('Saved');
    expect(btn.querySelector('[data-codeblock-copy-icon] svg path')?.getAttribute('d')).toBe(
      'M4.5 12.5l5 5L19.5 7',
    );
    expect(feedback.textContent).toBe('Saved');
    expect(feedback.getAttribute('data-tone')).toBe('success');
    expect(onCopied).toHaveBeenCalledWith({ value: 'hello' });
  });

  it('on failure: error icon, errorLabel as name and feedback, error event', async () => {
    stubClipboard(vi.fn().mockRejectedValue(new Error('denied')));
    const { btn, feedback } = mount('data-error-label="Could not copy"');
    const onError = vi.fn();
    document.body.addEventListener(COPY_ERROR_EVENT, (event) =>
      onError((event as CustomEvent).detail),
    );

    btn.click();
    await tick();

    expect(btn.hasAttribute('data-error')).toBe(true);
    expect(btn.hasAttribute('data-copied')).toBe(false);
    expect(btn.getAttribute('aria-label')).toBe('Could not copy');
    expect(btn.querySelector('[data-codeblock-copy-icon] svg')?.innerHTML).not.toBe('');
    expect(feedback.textContent).toBe('Could not copy');
    expect(feedback.getAttribute('data-tone')).toBe('error');
    expect(onError).toHaveBeenCalledWith({ value: 'hello' });
  });

  it('returns to idle after data-timeout (default 2000ms)', async () => {
    vi.useFakeTimers();
    try {
      stubClipboard(vi.fn().mockResolvedValue(undefined));
      const { btn, feedback } = mount();
      btn.click();
      await vi.advanceTimersByTimeAsync(1999);
      expect(btn.hasAttribute('data-copied')).toBe(true);
      await vi.advanceTimersByTimeAsync(1);
      expect(btn.hasAttribute('data-copied')).toBe(false);
      expect(btn.getAttribute('aria-label')).toBe('Copy code');
      expect(feedback.textContent).toBe('');
      expect(feedback.hasAttribute('data-tone')).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it('honours data-timeout', async () => {
    vi.useFakeTimers();
    try {
      stubClipboard(vi.fn().mockResolvedValue(undefined));
      const { btn } = mount('data-timeout="500"');
      btn.click();
      await vi.advanceTimersByTimeAsync(500);
      expect(btn.hasAttribute('data-copied')).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });
});
