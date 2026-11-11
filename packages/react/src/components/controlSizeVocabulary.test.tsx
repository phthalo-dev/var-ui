/**
 * `size` vocabulary for the form controls: each control takes `size`, falls back to the
 * surrounding control size (`ControlSizeContext`, provided by InputGroup, Toolbar, Select.Root,
 * Combobox.Root), then `md`. The recipe stamps the resolved size on its slots as `data-size`.
 */
import type { ReactElement } from 'react';
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import type { ControlSize } from '@var-ui/core';
import { IconProvider } from '../icons';
import { ControlSizeContext } from '../internal/controlSizeContext';
import { Button } from './Button';
import { Checkbox } from './Checkbox';
import { CheckboxGroup } from './CheckboxGroup';
import { ColorInput } from './ColorInput';
import { ColorPicker } from './ColorPicker';
import { DateInput } from './DateInput';
import { DateRangeInput } from './DateRangeInput';
import { DateTimeInput } from './DateTimeInput';
import { FileInput } from './FileInput';
import { IconButton } from './IconButton';
import { InputGroup } from './InputGroup';
import { MultiSelector } from './MultiSelector';
import { RadioGroup } from './RadioGroup';
import { Slider } from './Slider';
import { Switch } from './Switch';
import { TextAreaField } from './TextAreaField';
import { TimeInput } from './TimeInput';
import { Tokenizer } from './Tokenizer';
import { Toolbar } from './Toolbar';

const options = [
  { value: 'a', label: 'Apple' },
  { value: 'b', label: 'Banana' },
];

/** Each control, rendered with an optional `size`. */
const controls: Record<string, (size?: ControlSize) => ReactElement> = {
  TextAreaField: (size) => <TextAreaField label="Notes" size={size} />,
  MultiSelector: (size) => (
    <MultiSelector
      label="Fruit"
      options={options}
      value={[]}
      onValueChange={() => {}}
      size={size}
    />
  ),
  Tokenizer: (size) => (
    <Tokenizer label="Tags" options={options} value={['a']} onValueChange={() => {}} size={size} />
  ),
  DateInput: (size) => <DateInput label="Date" size={size} />,
  DateRangeInput: (size) => <DateRangeInput label="Range" size={size} />,
  DateTimeInput: (size) => <DateTimeInput label="When" size={size} />,
  TimeInput: (size) => <TimeInput label="Time" size={size} />,
  FileInput: (size) => <FileInput label="File" value={null} onValueChange={() => {}} size={size} />,
  Checkbox: (size) => <Checkbox size={size}>Accept</Checkbox>,
  Switch: (size) => <Switch size={size}>Wi-Fi</Switch>,
  CheckboxGroup: (size) => <CheckboxGroup label="Fruit" options={options} size={size} />,
  RadioGroup: (size) => <RadioGroup label="Fruit" options={options} size={size} />,
  Slider: (size) => <Slider label="Volume" size={size} />,
  ColorPicker: (size) => <ColorPicker size={size} />,
  Button: (size) => <Button size={size}>Save</Button>,
  IconButton: (size) => <IconButton aria-label="Close" icon="close" size={size} />,
};

/** `data-size` of the control's own slots. Decorative glyphs (`Icon`) keep their own size. */
function sizesIn(container: HTMLElement): string[] {
  return [...container.querySelectorAll('[data-size]:not(.var-ui-icon)')].map((el) =>
    el.getAttribute('data-size')!,
  );
}

function expectSize(container: HTMLElement, size: ControlSize) {
  const sizes = sizesIn(container);
  expect(sizes.length).toBeGreaterThan(0);
  expect(new Set(sizes)).toEqual(new Set([size]));
}

const wrap = (ui: ReactElement) => render(<IconProvider icons={{}}>{ui}</IconProvider>);

describe.each(Object.entries(controls))('%s size', (_name, renderControl) => {
  it('defaults to md', () => {
    expectSize(wrap(renderControl()).container, 'md');
  });

  it('applies an explicit size', () => {
    expectSize(wrap(renderControl('sm')).container, 'sm');
    expectSize(wrap(renderControl('lg')).container, 'lg');
  });

  it('falls back to the surrounding control size', () => {
    const { container } = wrap(
      <ControlSizeContext.Provider value="lg">{renderControl()}</ControlSizeContext.Provider>,
    );
    expectSize(container, 'lg');
  });

  it('prefers its own size over the surrounding one', () => {
    const { container } = wrap(
      <ControlSizeContext.Provider value="lg">{renderControl('sm')}</ControlSizeContext.Provider>,
    );
    expectSize(container, 'sm');
  });
});

describe('size cascade from compound roots', () => {
  it('Button and IconButton inherit an InputGroup size', () => {
    wrap(
      <InputGroup label="Search" size="sm">
        <Button>Go</Button>
        <IconButton aria-label="Clear" icon="close" />
      </InputGroup>,
    );
    expect(screen.getByRole('button', { name: 'Go' }).getAttribute('data-size')).toBe('sm');
    expect(screen.getByRole('button', { name: 'Clear' }).getAttribute('data-size')).toBe('sm');
  });

  it('Toolbar passes its size to the buttons inside', () => {
    wrap(<Toolbar label="Actions" size="lg" startContent={<Button>New</Button>} />);
    expect(screen.getByRole('toolbar').getAttribute('data-size')).toBe('lg');
    expect(screen.getByRole('button', { name: 'New' }).getAttribute('data-size')).toBe('lg');
  });

  it('a group size reaches every option', () => {
    wrap(<RadioGroup label="Fruit" options={options} size="lg" />);
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio.closest('label')?.getAttribute('data-size')).toBe('lg');
    }
  });

  it('ColorInput opens its picker at the input size', () => {
    const { container } = wrap(<ColorInput label="Brand" size="sm" />);
    expectSize(container, 'sm');
  });
});
