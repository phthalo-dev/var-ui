import { useState } from 'react';
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { MultiSelector, type MultiSelectorOption } from './MultiSelector';
import { stubNativePopover } from '../test/nativeOverlayStubs';

stubNativePopover();

// jsdom doesn't implement `CSS.escape`, which react-aria's selection utils call
// when moving focus within the listbox after a click. Polyfill it for this file.
if (typeof globalThis.CSS === 'undefined') {
  // @ts-expect-error -- partial CSS polyfill, only `escape` is needed for these tests.
  globalThis.CSS = {};
}
if (typeof globalThis.CSS.escape !== 'function') {
  globalThis.CSS.escape = (value: string) => value.replace(/([^\w-])/g, '\\$1');
}

const OPTIONS: MultiSelectorOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'plum', label: 'Plum' },
  { value: 'pear', label: 'Pear' },
];

function ControlledMultiSelector({ label }: { label?: string }) {
  const [value, setValue] = useState<string[]>([]);
  return (
    <>
      <MultiSelector label={label} options={OPTIONS} value={value} onValueChange={setValue} />
      <output data-testid="value">{value.join(',')}</output>
    </>
  );
}

describe('MultiSelector', () => {
  it('renders the label and placeholder when no value is selected', () => {
    render(
      <IconProvider icons={{}}>
        <MultiSelector label="Fruit" options={OPTIONS} value={[]} onValueChange={() => {}} />
      </IconProvider>,
    );
    expect(screen.getByText('Fruit')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Select…/ })).toBeTruthy();
  });

  it('shows the selected labels joined together in the trigger text', () => {
    render(
      <IconProvider icons={{}}>
        <MultiSelector
          label="Fruit"
          options={OPTIONS}
          value={['apple', 'pear']}
          onValueChange={() => {}}
        />
      </IconProvider>,
    );
    expect(screen.getByRole('button', { name: /Apple, Pear/ })).toBeTruthy();
  });

  it('shows all options with correct checked state when opened', async () => {
    render(
      <IconProvider icons={{}}>
        <MultiSelector label="Fruit" options={OPTIONS} value={['plum']} onValueChange={() => {}} />
      </IconProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: /Plum/ }));

    const apple = await screen.findByRole('option', { name: 'Apple' });
    const plum = screen.getByRole('option', { name: 'Plum' });
    const pear = screen.getByRole('option', { name: 'Pear' });

    expect(apple.getAttribute('aria-selected')).toBe('false');
    expect(plum.getAttribute('aria-selected')).toBe('true');
    expect(pear.getAttribute('aria-selected')).toBe('false');
  });

  it('calls onValueChange with the updated value array when selecting and deselecting', async () => {
    render(<ControlledMultiSelector label="Fruit" />);

    await userEvent.click(screen.getByRole('button', { name: /Select…/ }));
    const apple = await screen.findByRole('option', { name: 'Apple' });
    await userEvent.click(apple);
    expect(screen.getByTestId('value').textContent).toBe('apple');

    const pear = screen.getByRole('option', { name: 'Pear' });
    await userEvent.click(pear);
    expect(screen.getByTestId('value').textContent).toBe('apple,pear');

    await userEvent.click(screen.getByRole('option', { name: 'Apple' }));
    expect(screen.getByTestId('value').textContent).toBe('pear');
  });
});

describe('MultiSelector form wiring', () => {
  it('links the trigger to description and error and marks it invalid', () => {
    render(
      <IconProvider icons={{}}>
        <MultiSelector
          label="Fruit"
          description="Pick some"
          errorMessage="Required"
          options={OPTIONS}
          value={[]}
          onValueChange={() => {}}
        />
      </IconProvider>,
    );
    const trigger = screen.getByRole('button');
    expect(trigger.getAttribute('aria-describedby')).toBe(
      `${screen.getByText('Pick some').id} ${screen.getByText('Required').id}`,
    );
  });

  it('emits one hidden input per selected value under name', () => {
    const { container } = render(
      <IconProvider icons={{}}>
        <form>
          <MultiSelector
            name="fruit"
            options={OPTIONS}
            value={['apple', 'pear']}
            onValueChange={() => {}}
          />
        </form>
      </IconProvider>,
    );
    expect(new FormData(container.querySelector('form')!).getAll('fruit')).toEqual([
      'apple',
      'pear',
    ]);
  });
});
