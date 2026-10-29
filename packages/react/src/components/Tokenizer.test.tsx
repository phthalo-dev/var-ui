import { useState } from 'react';
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { Tokenizer, type TokenizerOption } from './Tokenizer';

const OPTIONS: TokenizerOption[] = [
  { id: 'apple', label: 'Apple' },
  { id: 'apricot', label: 'Apricot' },
  { id: 'plum', label: 'Plum' },
  { id: 'pear', label: 'Pear' },
];

function ControlledTokenizer({
  label,
  initialValue = [],
}: {
  label?: string;
  initialValue?: TokenizerOption[];
}) {
  const [value, setValue] = useState<TokenizerOption[]>(initialValue);
  return (
    <>
      <Tokenizer label={label} options={OPTIONS} value={value} onChange={setValue} />
      <output data-testid="value">{value.map((option) => option.id).join(',')}</output>
    </>
  );
}

describe('Tokenizer', () => {
  it('renders the label and existing tokens', () => {
    render(
      <IconProvider icons={{}}>
        <Tokenizer
          label="Fruit"
          options={OPTIONS}
          value={[OPTIONS[0], OPTIONS[2]]}
          onChange={() => {}}
        />
      </IconProvider>,
    );

    expect(screen.getByText('Fruit')).toBeTruthy();
    expect(screen.getByText('Apple')).toBeTruthy();
    expect(screen.getByText('Plum')).toBeTruthy();
    expect(screen.queryByText('Pear')).toBeNull();
  });

  it('filters remaining options as the user types, excluding already-selected ones', async () => {
    render(
      <IconProvider icons={{}}>
        <Tokenizer label="Fruit" options={OPTIONS} value={[OPTIONS[0]]} onChange={() => {}} />
      </IconProvider>,
    );

    const input = screen.getByRole('combobox', { name: 'Fruit' });
    await userEvent.type(input, 'ap');

    const listOptions = await screen.findAllByRole('option');
    expect(listOptions.map((option) => option.textContent)).toEqual(['Apricot']);
  });

  it('adds a token and calls onChange when an option is selected', async () => {
    render(
      <IconProvider icons={{}}>
        <ControlledTokenizer label="Fruit" />
      </IconProvider>,
    );

    const input = screen.getByRole('combobox', { name: 'Fruit' });
    await userEvent.type(input, 'Plum');

    const option = await screen.findByRole('option', { name: 'Plum' });
    await userEvent.click(option);

    expect(screen.getByTestId('value').textContent).toBe('plum');
    expect(screen.getByText('Plum')).toBeTruthy();
    expect((input as HTMLInputElement).value).toBe('');
  });

  it('removes a token when its remove button is clicked', async () => {
    render(
      <IconProvider icons={{}}>
        <ControlledTokenizer label="Fruit" initialValue={[OPTIONS[0], OPTIONS[2]]} />
      </IconProvider>,
    );

    expect(screen.getByTestId('value').textContent).toBe('apple,plum');

    await userEvent.click(screen.getByRole('button', { name: /Remove Apple/ }));

    expect(screen.getByTestId('value').textContent).toBe('plum');
    expect(screen.queryByText('Apple')).toBeNull();
  });
});

describe('Tokenizer form wiring', () => {
  it('describes the input by description and error', () => {
    render(
      <IconProvider icons={{}}>
        <Tokenizer
          label="Fruit"
          description="Pick some"
          errorMessage="Required"
          options={OPTIONS}
          value={[]}
          onChange={() => {}}
        />
      </IconProvider>,
    );
    const input = screen.getByRole('combobox');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toContain(screen.getByText('Pick some').id);
    expect(input.getAttribute('aria-describedby')).toContain(screen.getByText('Required').id);
  });

  it('emits one hidden input per token under name', () => {
    const { container } = render(
      <IconProvider icons={{}}>
        <form>
          <Tokenizer
            name="fruit"
            options={OPTIONS}
            value={OPTIONS.slice(0, 2)}
            onChange={() => {}}
          />
        </form>
      </IconProvider>,
    );
    expect(new FormData(container.querySelector('form')!).getAll('fruit')).toEqual([
      'apple',
      'apricot',
    ]);
  });
});
