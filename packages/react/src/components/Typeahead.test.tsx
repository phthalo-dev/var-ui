import { useState } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { Typeahead, type TypeaheadOption } from './Typeahead';

const OPTIONS: TypeaheadOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'plum', label: 'Plum' },
];

function ControlledTypeahead() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <>
      <Typeahead label="Fruit" options={OPTIONS} value={selected} onValueChange={setSelected} />
      <output data-testid="value">{selected ?? ''}</output>
    </>
  );
}

describe('Typeahead', () => {
  it('renders the field label', () => {
    render(
      <IconProvider icons={{}}>
        <Typeahead label="Fruit" options={OPTIONS} />
      </IconProvider>,
    );
    expect(screen.getByText('Fruit')).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'Fruit' })).toBeTruthy();
  });

  it('filters the option list as the user types', async () => {
    render(
      <IconProvider icons={{}}>
        <Typeahead label="Fruit" options={OPTIONS} />
      </IconProvider>,
    );

    const input = screen.getByRole('combobox', { name: 'Fruit' });
    await userEvent.type(input, 'ap');

    const listOptions = await screen.findAllByRole('option');
    expect(listOptions.map((option) => option.textContent)).toEqual(['Apple', 'Apricot']);
  });

  it('calls onValueChange when an option is selected', async () => {
    render(
      <IconProvider icons={{}}>
        <ControlledTypeahead />
      </IconProvider>,
    );

    const input = screen.getByRole('combobox', { name: 'Fruit' });
    await userEvent.type(input, 'Plum');

    const option = await screen.findByRole('option', { name: 'Plum' });
    await userEvent.click(option);

    expect(screen.getByTestId('value').textContent).toBe('plum');
    expect((input as HTMLInputElement).value).toBe('Plum');
  });

  it('clears the selection and input text via the clear button', async () => {
    const onValueChange = vi.fn();
    render(
      <IconProvider icons={{}}>
        <Typeahead label="Fruit" options={OPTIONS} onValueChange={onValueChange} />
      </IconProvider>,
    );

    const input = screen.getByRole('combobox', { name: 'Fruit' });
    await userEvent.type(input, 'Plum');
    const option = await screen.findByRole('option', { name: 'Plum' });
    await userEvent.click(option);
    expect((input as HTMLInputElement).value).toBe('Plum');

    const clearButton = screen.getByRole('button', { name: 'Clear' });
    await userEvent.click(clearButton);

    expect((input as HTMLInputElement).value).toBe('');
    expect(onValueChange).toHaveBeenCalledWith(null);
  });
});
