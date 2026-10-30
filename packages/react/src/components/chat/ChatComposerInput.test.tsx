import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatComposerInput } from './ChatComposerInput';

describe('ChatComposerInput', () => {
  it('renders the controlled value and calls onValueChange on typing', async () => {
    const onValueChange = vi.fn();
    render(
      <ChatComposerInput
        value=""
        onValueChange={onValueChange}
        onSubmit={vi.fn()}
        placeholder="Type a message…"
      />,
    );
    const textarea = screen.getByPlaceholderText('Type a message…');
    await userEvent.type(textarea, 'h');
    expect(onValueChange).toHaveBeenCalledWith('h');
  });

  it('submits trimmed value on Enter and does not insert a newline', async () => {
    const onSubmit = vi.fn();
    render(<ChatComposerInput value="hello" onValueChange={vi.fn()} onSubmit={onSubmit} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    textarea.focus();
    await userEvent.keyboard('{Enter}');
    expect(onSubmit).toHaveBeenCalledWith('hello');
  });

  it('does not submit on Shift+Enter', async () => {
    const onSubmit = vi.fn();
    render(<ChatComposerInput value="hello" onValueChange={vi.fn()} onSubmit={onSubmit} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    textarea.focus();
    await userEvent.keyboard('{Shift>}{Enter}{/Shift}');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not submit an empty/whitespace-only value', async () => {
    const onSubmit = vi.fn();
    render(<ChatComposerInput value="   " onValueChange={vi.fn()} onSubmit={onSubmit} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    textarea.focus();
    await userEvent.keyboard('{Enter}');
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
