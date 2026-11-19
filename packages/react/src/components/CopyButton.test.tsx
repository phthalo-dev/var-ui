import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { CopyButton } from './CopyButton';

describe('CopyButton', () => {
  it('renders the default button and copies on click', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });

    render(
      <IconProvider icons={{}}>
        <CopyButton value="secret" />
      </IconProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(writeText).toHaveBeenCalledWith('secret');

    vi.unstubAllGlobals();
  });

  it('supports a render prop', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });

    render(
      <CopyButton value="x">
        {({ copy }) => (
          <button type="button" onClick={copy}>
            Custom
          </button>
        )}
      </CopyButton>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Custom' }));
    expect(writeText).toHaveBeenCalledWith('x');

    vi.unstubAllGlobals();
  });

  it('calls onCopied with the value after a successful write', async () => {
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
    const onCopied = vi.fn();
    const onCopyError = vi.fn();
    render(
      <IconProvider icons={{}}>
        <CopyButton value="secret" onCopied={onCopied} onCopyError={onCopyError} />
      </IconProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(onCopied).toHaveBeenCalledWith('secret');
    expect(onCopyError).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('calls onCopyError with the error and value when the write fails', async () => {
    const denied = new Error('denied');
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(denied) } });
    const onCopied = vi.fn();
    const onCopyError = vi.fn();
    render(
      <IconProvider icons={{}}>
        <CopyButton value="secret" onCopied={onCopied} onCopyError={onCopyError} />
      </IconProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(onCopyError).toHaveBeenCalledWith(denied, 'secret');
    expect(onCopied).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Copy failed' })).toBeTruthy();
    vi.unstubAllGlobals();
  });
});
