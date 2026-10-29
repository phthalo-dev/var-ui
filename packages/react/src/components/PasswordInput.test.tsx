import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { PasswordInput } from './PasswordInput';

describe('PasswordInput', () => {
  it('toggles password visibility', async () => {
    render(
      <IconProvider icons={{}}>
        <PasswordInput label="Password" defaultValue="secret" />
      </IconProvider>,
    );

    const input = screen.getByLabelText('Password') as HTMLInputElement;
    expect(input.type).toBe('password');

    await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(input.type).toBe('text');

    await userEvent.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(input.type).toBe('password');
  });

  it('applies a custom className to the root element', () => {
    render(
      <IconProvider icons={{}}>
        <PasswordInput label="Password" className="custom" />
      </IconProvider>,
    );
    const root = screen.getByLabelText('Password').closest('.custom');
    expect(root).not.toBeNull();
    expect(root?.className).toContain('var-ui-');
  });
});
