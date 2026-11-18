import { createRef } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UnstyledButton } from './UnstyledButton';

describe('UnstyledButton', () => {
  it('renders a native type="button" with the recipe class merged with className', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <UnstyledButton className="mine" aria-label="Toggle" ref={ref}>
        x
      </UnstyledButton>,
    );
    const button = screen.getByRole('button', { name: 'Toggle' });
    expect(button.getAttribute('type')).toBe('button');
    expect(button.className).toContain('var-ui-unstyled-button');
    expect(button.className).toContain('mine');
    expect(ref.current).toBe(button);
  });

  it('keeps an explicit type and fires onClick unless disabled', async () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <UnstyledButton type="submit" onClick={onClick}>
        Go
      </UnstyledButton>,
    );
    expect(screen.getByRole('button').getAttribute('type')).toBe('submit');
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <UnstyledButton disabled onClick={onClick}>
        Go
      </UnstyledButton>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
