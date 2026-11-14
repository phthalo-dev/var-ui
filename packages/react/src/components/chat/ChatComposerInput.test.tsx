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

  it('submitOn="mod+enter" submits on ⌘/Ctrl+Enter and lets Enter newline', async () => {
    const onSubmit = vi.fn();
    render(
      <ChatComposerInput
        value="hello"
        onValueChange={vi.fn()}
        onSubmit={onSubmit}
        submitOn="mod+enter"
      />,
    );
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    textarea.focus();
    await userEvent.keyboard('{Enter}');
    expect(onSubmit).not.toHaveBeenCalled();
    await userEvent.keyboard('{Shift>}{Enter}{/Shift}');
    expect(onSubmit).not.toHaveBeenCalled();
    await userEvent.keyboard('{Meta>}{Enter}{/Meta}');
    expect(onSubmit).toHaveBeenCalledWith('hello');
    onSubmit.mockClear();
    await userEvent.keyboard('{Control>}{Enter}{/Control}');
    expect(onSubmit).toHaveBeenCalledWith('hello');
  });

  it('onKeyDown can still veto the submit via preventDefault', async () => {
    const onSubmit = vi.fn();
    render(
      <ChatComposerInput
        value="hello"
        onValueChange={vi.fn()}
        onSubmit={onSubmit}
        onKeyDown={(event) => event.preventDefault()}
      />,
    );
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    textarea.focus();
    await userEvent.keyboard('{Enter}');
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
