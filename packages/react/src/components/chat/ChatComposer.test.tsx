import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { ChatComposer } from './ChatComposer';
import { ChatComposerInput } from './ChatComposerInput';

describe('ChatComposer', () => {
  it('renders children and the actions slot', () => {
    render(
      <ChatComposer actions={<button type="button">Send</button>}>
        <ChatComposerInput value="" onValueChange={() => {}} onSubmit={() => {}} />
      </ChatComposer>,
    );
    expect(screen.getByRole('textbox')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Send' })).toBeTruthy();
  });

  it('omits the actions wrapper when no actions are passed', () => {
    const { container } = render(
      <ChatComposer>
        <span>input</span>
      </ChatComposer>,
    );
    expect(container.querySelectorAll('div').length).toBeGreaterThan(0);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
