/** VarUI-vocabulary tests for the collections / dates / color group (value, onValueChange, flags, options). */
import { useState } from 'react';
import { CalendarDate, Time } from '@internationalized/date';
import { describe, expect, it, vi } from 'vite-plus/test';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { Calendar } from './Calendar';
import { Combobox } from './Combobox';
import { DateInput } from './DateInput';
import { DateRangeInput } from './DateRangeInput';
import { DateTimeInput } from './DateTimeInput';
import { MultiSelector } from './MultiSelector';
import { TimeInput } from './TimeInput';
import { Tokenizer } from './Tokenizer';
import { Typeahead } from './Typeahead';
import { stubNativePopover } from '../test/nativeOverlayStubs';

stubNativePopover();

if (typeof globalThis.CSS === 'undefined') {
  // @ts-expect-error -- partial CSS polyfill, only `escape` is needed for these tests.
  globalThis.CSS = {};
}
if (typeof globalThis.CSS.escape !== 'function') {
  globalThis.CSS.escape = (value: string) => value.replace(/([^\w-])/g, '\\$1');
}

const wrap = (ui: React.ReactElement) => render(<IconProvider icons={{}}>{ui}</IconProvider>);

const OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'plum', label: 'Plum' },
  { value: 'pear', label: 'Pear', disabled: true },
];

describe('Combobox', () => {
  const tree = (
    props: React.ComponentProps<typeof Combobox.Root> extends infer P ? Partial<P> : never,
  ) => (
    <Combobox.Root aria-label="Fruit" {...props}>
      <Combobox.Input />
      <Combobox.Popover>
        <Combobox.ListBox items={OPTIONS}>
          {(o) => (
            <Combobox.Item value={o.value} disabled={o.disabled}>
              {o.label}
            </Combobox.Item>
          )}
        </Combobox.ListBox>
      </Combobox.Popover>
    </Combobox.Root>
  );

  it('reports the picked option value through onValueChange (uncontrolled)', async () => {
    const onValueChange = vi.fn();
    wrap(tree({ onValueChange }));
    await userEvent.type(screen.getByRole('combobox'), 'Plu');
    await userEvent.click(await screen.findByRole('option', { name: 'Plum' }));
    expect(onValueChange).toHaveBeenCalledWith('plum');
  });

  it('shows a defaultValue and follows a controlled value', () => {
    const { rerender } = wrap(tree({ defaultValue: 'apple' }));
    expect((screen.getByRole('combobox') as HTMLInputElement).value).toBe('Apple');
    rerender(
      <IconProvider icons={{}}>{tree({ value: 'plum', onValueChange: () => {} })}</IconProvider>,
    );
    expect((screen.getByRole('combobox') as HTMLInputElement).value).toBe('Plum');
  });

  it('disables an option via disabled', async () => {
    wrap(tree({}));
    await userEvent.type(screen.getByRole('combobox'), 'Pea');
    const pear = await screen.findByRole('option', { name: 'Pear' });
    expect(pear.getAttribute('aria-disabled')).toBe('true');
  });

  it('maps disabled / readOnly / required / invalid to the input', () => {
    wrap(tree({ disabled: true, required: true, invalid: true }));
    const input = screen.getByRole('combobox') as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(input.required).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('maps readOnly to the input', () => {
    wrap(tree({ readOnly: true }));
    expect((screen.getByRole('combobox') as HTMLInputElement).readOnly).toBe(true);
  });
});

describe('Typeahead', () => {
  it('uses {value,label,disabled} options and string value / onValueChange', async () => {
    const onValueChange = vi.fn();
    wrap(<Typeahead label="Fruit" options={OPTIONS} onValueChange={onValueChange} />);
    await userEvent.type(screen.getByRole('combobox'), 'p');
    expect(
      (await screen.findByRole('option', { name: 'Pear' })).getAttribute('aria-disabled'),
    ).toBe('true');
    await userEvent.click(screen.getByRole('option', { name: 'Plum' }));
    expect(onValueChange).toHaveBeenCalledWith('plum');
  });

  it('flags reach the DOM and native onChange fires with the typed text', async () => {
    const onChange = vi.fn();
    wrap(<Typeahead label="Fruit" options={OPTIONS} required invalid onChange={onChange} />);
    const input = screen.getByRole('combobox') as HTMLInputElement;
    expect(input.required).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    await userEvent.type(input, 'a');
    expect(onChange).toHaveBeenCalled();
    expect((onChange.mock.calls[0]?.[0] as { target: HTMLInputElement }).target.value).toBe('a');
  });

  it('disabled disables the input', () => {
    wrap(<Typeahead label="Fruit" options={OPTIONS} disabled />);
    expect((screen.getByRole('combobox') as HTMLInputElement).disabled).toBe(true);
  });

  it('takes a controlled value', () => {
    wrap(<Typeahead label="Fruit" options={OPTIONS} value="apple" onValueChange={() => {}} />);
    expect((screen.getByRole('combobox') as HTMLInputElement).value).toBe('Apple');
  });
});

describe('MultiSelector', () => {
  it('emits string[] through onValueChange and honours disabled options', async () => {
    const onValueChange = vi.fn();
    function Harness() {
      const [value, setValue] = useState<string[]>([]);
      return (
        <MultiSelector
          label="Fruit"
          options={OPTIONS}
          value={value}
          onValueChange={(next) => {
            onValueChange(next);
            setValue(next);
          }}
        />
      );
    }
    wrap(<Harness />);
    await userEvent.click(screen.getByRole('button'));
    expect(
      (await screen.findByRole('option', { name: 'Pear' })).getAttribute('aria-disabled'),
    ).toBe('true');
    await userEvent.click(screen.getByRole('option', { name: 'Apple' }));
    await userEvent.click(screen.getByRole('option', { name: 'Plum' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['apple', 'plum']);
  });

  it('disabled disables the trigger and the hidden inputs', () => {
    const { container } = wrap(
      <MultiSelector
        options={OPTIONS}
        value={['apple']}
        onValueChange={() => {}}
        name="f"
        disabled
      />,
    );
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true);
    expect((container.querySelector('input[type=hidden]') as HTMLInputElement).disabled).toBe(true);
  });
});

describe('Tokenizer', () => {
  it('value is string[]; onValueChange gets the next string[]', async () => {
    const onValueChange = vi.fn();
    wrap(
      <Tokenizer label="Fruit" options={OPTIONS} value={['apple']} onValueChange={onValueChange} />,
    );
    expect(screen.getByText('Apple')).toBeTruthy();
    await userEvent.type(screen.getByRole('combobox', { name: 'Fruit' }), 'Plu');
    await userEvent.click(await screen.findByRole('option', { name: 'Plum' }));
    expect(onValueChange).toHaveBeenCalledWith(['apple', 'plum']);
    await userEvent.click(screen.getByRole('button', { name: /Remove Apple/ }));
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });

  it('native onChange reaches the search input; disabled disables it', async () => {
    const onChange = vi.fn();
    const { rerender } = wrap(
      <Tokenizer
        label="Fruit"
        options={OPTIONS}
        value={[]}
        onValueChange={() => {}}
        onChange={onChange}
      />,
    );
    await userEvent.type(screen.getByRole('combobox'), 'a');
    expect(onChange).toHaveBeenCalled();
    rerender(
      <IconProvider icons={{}}>
        <Tokenizer label="Fruit" options={OPTIONS} value={[]} onValueChange={() => {}} disabled />
      </IconProvider>,
    );
    expect((screen.getByRole('combobox') as HTMLInputElement).disabled).toBe(true);
  });
});

describe('Calendar', () => {
  const focused = new CalendarDate(2026, 7, 15);

  it('onValueChange gets the DateValue; defaultValue is selected (uncontrolled)', async () => {
    const onValueChange = vi.fn();
    wrap(
      <Calendar
        aria-label="Date"
        defaultValue={new CalendarDate(2026, 7, 10)}
        onValueChange={onValueChange}
      />,
    );
    expect(screen.getByText('10').closest('[role="button"]')?.getAttribute('aria-label')).toContain(
      'selected',
    );
    await userEvent.click(screen.getByText('20'));
    expect((onValueChange.mock.calls[0]?.[0] as CalendarDate).day).toBe(20);
  });

  it('unavailable and disabled block selection', async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Calendar
        aria-label="Date"
        defaultFocusedValue={focused}
        unavailable={(d) => d.day === 20}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByText('20'));
    expect(onValueChange).not.toHaveBeenCalled();
    rerender(
      <Calendar
        aria-label="Date"
        defaultFocusedValue={focused}
        disabled
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByText('21'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('min / max disable dates outside the range', async () => {
    const onValueChange = vi.fn();
    render(
      <Calendar
        aria-label="Date"
        defaultFocusedValue={focused}
        min={new CalendarDate(2026, 7, 10)}
        max={new CalendarDate(2026, 7, 20)}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByText('5'));
    expect(onValueChange).not.toHaveBeenCalled();
    await userEvent.click(screen.getByText('12'));
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it('readOnly blocks selection', async () => {
    const onValueChange = vi.fn();
    render(
      <Calendar
        aria-label="Date"
        defaultFocusedValue={focused}
        readOnly
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByText('21'));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe('date and time fields', () => {
  it('DateInput: defaultValue shows, disabled/readOnly/required/invalid reach the segments', () => {
    wrap(
      <DateInput
        label="Date"
        defaultValue={new CalendarDate(2026, 7, 15)}
        disabled
        required
        invalid
        errorMessage="Bad"
      />,
    );
    expect(screen.getByText('2026')).toBeTruthy();
    const month = screen.getByRole('spinbutton', { name: /month/i });
    expect(month.getAttribute('aria-disabled')).toBe('true');
    expect(month.getAttribute('aria-invalid')).toBe('true');
  });

  it('DateInput: readOnly segments are read-only', () => {
    wrap(<DateInput label="Date" defaultValue={new CalendarDate(2026, 7, 15)} readOnly />);
    expect(screen.getByRole('spinbutton', { name: /month/i }).getAttribute('aria-readonly')).toBe(
      'true',
    );
  });

  it('DateInput: typing a full date calls onValueChange', async () => {
    const onValueChange = vi.fn();
    wrap(<DateInput label="Date" onValueChange={onValueChange} />);
    screen.getByRole('spinbutton', { name: /month/i }).focus();
    await userEvent.keyboard('7152026');
    const last = onValueChange.mock.calls[onValueChange.mock.calls.length - 1]?.[0] as CalendarDate;
    expect(last.toString()).toBe('2026-07-15');
  });

  it('DateInput: open / onOpenChange control the calendar popover', async () => {
    const onOpenChange = vi.fn();
    wrap(<DateInput label="Date" onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(await screen.findByRole('grid')).toBeTruthy();
  });

  it('DateInput: open={true} renders the popover', async () => {
    wrap(<DateInput label="Date" open onOpenChange={() => {}} />);
    expect(await screen.findByRole('grid')).toBeTruthy();
  });

  it('DateTimeInput: disabled disables the segments', () => {
    wrap(<DateTimeInput label="When" disabled />);
    expect(screen.getByRole('spinbutton', { name: /hour/i }).getAttribute('aria-disabled')).toBe(
      'true',
    );
  });

  it('DateRangeInput: defaultValue shows and invalid is set', () => {
    wrap(
      <DateRangeInput
        label="Trip"
        defaultValue={{ start: new CalendarDate(2026, 7, 15), end: new CalendarDate(2026, 7, 20) }}
        invalid
      />,
    );
    expect(screen.getAllByRole('spinbutton', { name: /day/i }).map((e) => e.textContent)).toEqual([
      '15',
      '20',
    ]);
    expect(
      screen.getAllByRole('spinbutton', { name: /month/i })[0]?.getAttribute('aria-invalid'),
    ).toBe('true');
  });

  it('TimeInput: onValueChange, defaultValue, disabled and required', async () => {
    const onValueChange = vi.fn();
    const { rerender } = wrap(
      <TimeInput label="Start" defaultValue={new Time(9, 30)} onValueChange={onValueChange} />,
    );
    expect(screen.getByRole('spinbutton', { name: /minute/i }).textContent).toBe('30');
    screen.getByRole('spinbutton', { name: /hour/i }).focus();
    fireEvent.keyDown(screen.getByRole('spinbutton', { name: /hour/i }), { key: 'ArrowUp' });
    expect((onValueChange.mock.calls[onValueChange.mock.calls.length - 1]?.[0] as Time).hour).toBe(
      10,
    );
    rerender(
      <IconProvider icons={{}}>
        <TimeInput label="Start" disabled required />
      </IconProvider>,
    );
    expect(screen.getByRole('spinbutton', { name: /hour/i }).getAttribute('aria-disabled')).toBe(
      'true',
    );
  });
});
