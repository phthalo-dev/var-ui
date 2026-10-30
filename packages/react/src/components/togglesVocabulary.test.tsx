/** VarUI-vocabulary tests for the toggles/choice group (PR 2). */
import { useState } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { CheckboxGroup } from './CheckboxGroup';
import { Chip, ChipGroup, Pill } from './Chip';
import { RadioGroup } from './RadioGroup';
import { SegmentedControl, ToggleButton } from './SegmentedControl';

const byValue = (v: string) => document.querySelector(`input[value="${v}"]`) as HTMLInputElement;

const wrap = (ui: React.ReactElement) => render(<IconProvider icons={{}}>{ui}</IconProvider>);

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma', disabled: true },
];

describe('RadioGroup', () => {
  it('reports the value, native change (capture) and honors disabled options', async () => {
    const onValueChange = vi.fn();
    const seen: unknown[] = [];
    const onChange = vi.fn((e: { currentTarget: unknown; target: Element }) =>
      seen.push(e.currentTarget),
    );
    render(
      <RadioGroup
        label="Pick"
        options={options}
        onValueChange={onValueChange}
        onChange={onChange}
      />,
    );
    expect((screen.getByLabelText('Gamma') as HTMLInputElement).disabled).toBe(true);
    await userEvent.setup().click(screen.getByLabelText('Beta'));
    expect(onValueChange).toHaveBeenCalledWith('b');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target.tagName).toBe('INPUT');
    expect(seen[0]).toBe(screen.getByRole('radiogroup', { name: 'Pick' }));
  });

  it('supports controlled and uncontrolled values', () => {
    const { rerender } = render(<RadioGroup label="Pick" options={options} defaultValue="a" />);
    expect((screen.getByLabelText('Alpha') as HTMLInputElement).checked).toBe(true);
    rerender(<RadioGroup label="Pick" options={options} value="b" onValueChange={() => {}} />);
    expect((screen.getByLabelText('Beta') as HTMLInputElement).checked).toBe(true);
  });

  it('maps disabled / required / invalid to the DOM', () => {
    const { rerender } = render(<RadioGroup label="Pick" options={options} disabled />);
    expect((screen.getByLabelText('Alpha') as HTMLInputElement).disabled).toBe(true);
    rerender(<RadioGroup label="Pick" options={options} required invalid />);
    const group = screen.getByRole('radiogroup', { name: 'Pick' });
    expect(group.getAttribute('aria-required')).toBe('true');
    expect(group.getAttribute('aria-invalid')).toBe('true');
  });
});

describe('CheckboxGroup', () => {
  it('reports string[] and native change; flags reach the DOM', async () => {
    const onValueChange = vi.fn();
    const onChange = vi.fn();
    const { rerender } = render(
      <CheckboxGroup
        label="Pick"
        options={options}
        defaultValue={['a']}
        onValueChange={onValueChange}
        onChange={onChange}
      />,
    );
    expect(byValue('a').checked).toBe(true);
    await userEvent.setup().click(byValue('b'));
    expect(onValueChange).toHaveBeenCalledWith(['a', 'b']);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target.tagName).toBe('INPUT');
    expect(byValue('c').disabled).toBe(true);
    rerender(<CheckboxGroup label="Pick" options={options} disabled />);
    expect(byValue('a').disabled).toBe(true);
  });

  it('is controllable', () => {
    const { rerender } = render(
      <CheckboxGroup label="Pick" options={options} value={['b']} onValueChange={() => {}} />,
    );
    expect(byValue('b').checked).toBe(true);
    rerender(
      <CheckboxGroup label="Pick" options={options} value={['a']} onValueChange={() => {}} />,
    );
    expect(byValue('a').checked).toBe(true);
    expect(byValue('b').checked).toBe(false);
  });
});

describe('Chip', () => {
  it('toggles with selected / onSelectedChange (controlled and uncontrolled)', async () => {
    const onSelectedChange = vi.fn();
    const u = userEvent.setup();
    const { rerender } = wrap(
      <Chip selected={false} onSelectedChange={onSelectedChange}>
        React
      </Chip>,
    );
    await u.click(screen.getByRole('button', { name: 'React' }));
    expect(onSelectedChange).toHaveBeenCalledWith(true);
    rerender(
      <IconProvider icons={{}}>
        <Chip selected onSelectedChange={onSelectedChange}>
          React
        </Chip>
      </IconProvider>,
    );
    expect(screen.getByRole('button', { name: 'React' }).getAttribute('aria-pressed')).toBe('true');
    rerender(
      <IconProvider icons={{}}>
        <Chip defaultSelected>React</Chip>
      </IconProvider>,
    );
    expect(screen.getByRole('button', { name: 'React' }).getAttribute('aria-pressed')).toBe('true');
  });

  it('disabled disables the toggle', () => {
    wrap(
      <Chip selected={false} onSelectedChange={() => {}} disabled>
        React
      </Chip>,
    );
    expect((screen.getByRole('button', { name: 'React' }) as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  it('Pill is a removable chip', async () => {
    const onRemove = vi.fn();
    wrap(<Pill onRemove={onRemove}>Tag</Pill>);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Remove' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});

describe('ChipGroup', () => {
  it('multiple: value is string[]; options support disabled', async () => {
    const onValueChange = vi.fn();
    wrap(
      <ChipGroup
        multiple
        aria-label="Pick"
        defaultValue={['a']}
        onValueChange={onValueChange}
        options={options}
      />,
    );
    expect(screen.getByRole('button', { name: 'Alpha' }).getAttribute('aria-pressed')).toBe('true');
    expect((screen.getByRole('button', { name: 'Gamma' }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    await userEvent.setup().click(screen.getByRole('button', { name: 'Beta' }));
    expect(onValueChange).toHaveBeenCalledWith(['a', 'b']);
  });

  it('single (default): value is string | null, controlled', async () => {
    function Demo() {
      const [value, setValue] = useState<string | null>('a');
      return (
        <>
          <ChipGroup aria-label="Pick" value={value} onValueChange={setValue} options={options} />
          <output data-testid="v">{String(value)}</output>
        </>
      );
    }
    wrap(<Demo />);
    await userEvent.setup().click(screen.getByRole('radio', { name: 'Beta' }));
    expect(screen.getByTestId('v').textContent).toBe('b');
  });

  it('disabled reaches every chip', () => {
    wrap(<ChipGroup aria-label="Pick" disabled options={options} />);
    for (const chip of screen.getAllByRole('radio')) {
      expect((chip as HTMLButtonElement).disabled).toBe(true);
    }
  });
});

describe('ToggleButton', () => {
  it('selected / defaultSelected / onSelectedChange / disabled / onClick', async () => {
    const onSelectedChange = vi.fn();
    const onClick = vi.fn();
    const u = userEvent.setup();
    const { rerender } = render(
      <ToggleButton selected={false} onSelectedChange={onSelectedChange} onClick={onClick}>
        Bold
      </ToggleButton>,
    );
    await u.click(screen.getByRole('button'));
    expect(onSelectedChange).toHaveBeenCalledWith(true);
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(<ToggleButton defaultSelected>Bold</ToggleButton>);
    expect(screen.getByRole('button').getAttribute('aria-pressed')).toBe('true');
    rerender(<ToggleButton disabled>Bold</ToggleButton>);
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true);
  });
});

describe('SegmentedControl', () => {
  const segs = [
    { value: 'list', label: 'List' },
    { value: 'grid', label: 'Grid' },
    { value: 'board', label: 'Board', disabled: true },
  ];

  it('uncontrolled: defaultValue and onValueChange', async () => {
    const onValueChange = vi.fn();
    render(<SegmentedControl options={segs} defaultValue="list" onValueChange={onValueChange} />);
    expect(screen.getByRole('radio', { name: 'List' }).getAttribute('aria-checked')).toBe('true');
    await userEvent.setup().click(screen.getByRole('radio', { name: 'Grid' }));
    expect(onValueChange).toHaveBeenCalledWith('grid');
    expect(screen.getByRole('radio', { name: 'Grid' }).getAttribute('aria-checked')).toBe('true');
    expect((screen.getByRole('radio', { name: 'Board' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('controlled value', async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <SegmentedControl options={segs} value="list" onValueChange={onValueChange} />,
    );
    await userEvent.setup().click(screen.getByRole('radio', { name: 'Grid' }));
    expect(onValueChange).toHaveBeenCalledWith('grid');
    // parent has not updated: stays on list
    expect(screen.getByRole('radio', { name: 'List' }).getAttribute('aria-checked')).toBe('true');
    rerender(<SegmentedControl options={segs} value="grid" onValueChange={onValueChange} />);
    expect(screen.getByRole('radio', { name: 'Grid' }).getAttribute('aria-checked')).toBe('true');
  });

  it('disabled disables every segment', () => {
    render(<SegmentedControl options={segs} disabled />);
    for (const r of screen.getAllByRole('radio')) {
      expect((r as HTMLButtonElement).disabled).toBe(true);
    }
  });
});
