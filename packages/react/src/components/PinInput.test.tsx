import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PinInput } from './PinInput';

describe('PinInput', () => {
  it('describes every cell by the description and error', () => {
    render(
      <PinInput label="Code" length={3} description="Sent by SMS" errorMessage="Wrong code" />,
    );
    const cells = screen.getAllByRole('textbox');
    expect(cells).toHaveLength(3);
    for (const cell of cells) {
      expect(cell.getAttribute('aria-invalid')).toBe('true');
      expect(cell.getAttribute('aria-describedby')).toBe(
        `${screen.getByText('Sent by SMS').id} ${screen.getByText('Wrong code').id}`,
      );
    }
    expect(screen.getByText('Wrong code').id).not.toBe('');
  });

  it('is not described when there is no description or error', () => {
    render(<PinInput label="Code" length={2} />);
    expect(screen.getAllByRole('textbox')[0].getAttribute('aria-describedby')).toBeNull();
  });

  it('submits the joined value under name', async () => {
    const { container } = render(
      <form>
        <PinInput label="Code" length={3} name="pin" />
      </form>,
    );
    await userEvent.type(screen.getAllByRole('textbox')[0], '123');
    expect(new FormData(container.querySelector('form')!).get('pin')).toBe('123');
  });
});
