import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../../icons';
import { ChatSendButton } from './ChatSendButton';

describe('ChatSendButton', () => {
  it('calls onClick when not streaming', async () => {
    const onClick = vi.fn();
    render(
      <IconProvider icons={{}}>
        <ChatSendButton onClick={onClick} />
      </IconProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Send message' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onStop and swaps the label while streaming', async () => {
    const onStop = vi.fn();
    render(
      <IconProvider icons={{}}>
        <ChatSendButton streaming onStop={onStop} />
      </IconProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Stop generating' }));
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it('disables the button when disabled and not streaming', () => {
    render(
      <IconProvider icons={{}}>
        <ChatSendButton disabled />
      </IconProvider>,
    );
    expect(screen.getByRole('button', { name: 'Send message' }).hasAttribute('disabled')).toBe(
      true,
    );
  });

  it('ignores disabled while streaming (stop stays pressable)', async () => {
    const onStop = vi.fn();
    render(
      <IconProvider icons={{}}>
        <ChatSendButton streaming disabled onStop={onStop} />
      </IconProvider>,
    );
    expect(screen.getByRole('button', { name: 'Stop generating' }).hasAttribute('disabled')).toBe(
      false,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Stop generating' }));
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it('loading shows a spinner, disables presses, and keeps streaming stop pressable', async () => {
    const onClick = vi.fn();
    const onStop = vi.fn();
    render(
      <IconProvider icons={{}}>
        <ChatSendButton loading onClick={onClick} />
        <ChatSendButton streaming loading onStop={onStop} />
      </IconProvider>,
    );
    const sending = screen.getByRole('button', { name: 'Send message' });
    expect(sending.hasAttribute('disabled')).toBe(true);
    expect(sending.querySelector('[role="status"]')).toBeTruthy();
    await userEvent.click(sending);
    expect(onClick).not.toHaveBeenCalled();
    // streaming wins over loading: stop stays pressable
    await userEvent.click(screen.getByRole('button', { name: 'Stop generating' }));
    expect(onStop).toHaveBeenCalledTimes(1);
  });
});
