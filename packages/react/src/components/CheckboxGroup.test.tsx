import { useState } from 'react';
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckboxGroup, type CheckboxGroupOption } from './CheckboxGroup';

const options: CheckboxGroupOption[] = [
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
];

function ControlledCheckboxGroup({ label }: { label?: string }) {
  const [value, setValue] = useState<string[]>([]);
  return (
    <>
      <CheckboxGroup label={label} options={options} value={value} onValueChange={setValue} />
      <output data-testid="value">{value.join(',')}</output>
    </>
  );
}

describe('CheckboxGroup', () => {
  it('renders all options with their labels', () => {
    render(<CheckboxGroup options={options} />);
    expect(screen.getByText('Red')).toBeTruthy();
    expect(screen.getByText('Green')).toBeTruthy();
    expect(screen.getByText('Blue')).toBeTruthy();
    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
  });

  it('toggles an option into the value array via onValueChange', async () => {
    render(<ControlledCheckboxGroup />);
    const [redCheckbox, greenCheckbox] = screen.getAllByRole('checkbox');
    await userEvent.click(greenCheckbox);
    expect(screen.getByTestId('value').textContent).toBe('green');
    await userEvent.click(redCheckbox);
    expect(screen.getByTestId('value').textContent).toBe('green,red');
    await userEvent.click(greenCheckbox);
    expect(screen.getByTestId('value').textContent).toBe('red');
  });

  it('renders the group label when provided and omits it otherwise', () => {
    const { rerender } = render(<ControlledCheckboxGroup label="Favorite colors" />);
    expect(screen.getByText('Favorite colors')).toBeTruthy();

    rerender(<ControlledCheckboxGroup />);
    expect(screen.queryByText('Favorite colors')).toBeNull();
  });

  it('applies className to the root element', () => {
    render(<CheckboxGroup label="Colors" options={options} className="custom" />);
    expect(screen.getByRole('group', { name: 'Colors' }).className).toContain('custom');
  });
});
