import { createRef } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { Select } from './Select';
import { Combobox } from './Combobox';
import { Typeahead } from './Typeahead';
import { MultiSelector } from './MultiSelector';
import { Tokenizer } from './Tokenizer';
import { SegmentedControl } from './SegmentedControl';
import { Chip, ChipGroup } from './Chip';
import { RadioGroup } from './RadioGroup';
import { CheckboxGroup } from './CheckboxGroup';
import { Checkbox } from './Checkbox';
import { Switch } from './Switch';

if (typeof globalThis.CSS === 'undefined') {
  // @ts-expect-error -- partial CSS polyfill, only `escape` is needed.
  globalThis.CSS = {};
}
if (typeof globalThis.CSS.escape !== 'function') {
  globalThis.CSS.escape = (value: string) => value.replace(/([^\w-])/g, '\\$1');
}

const SELECT_OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'plum', label: 'Plum' },
];
const OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'plum', label: 'Plum' },
];

function wrap(ui: React.ReactNode) {
  return render(<IconProvider icons={{}}>{ui}</IconProvider>);
}

function describedTexts(el: Element) {
  return (el.getAttribute('aria-describedby') ?? '')
    .split(' ')
    .map((id) => document.getElementById(id)?.textContent);
}

describe('Select passthrough', () => {
  it('sends ref, attrs and handlers to the trigger; className to the root', async () => {
    const ref = createRef<HTMLButtonElement>();
    const onClick = vi.fn();
    wrap(
      <Select
        label="Fruit"
        options={SELECT_OPTIONS}
        data-testid="t"
        title="Pick"
        className="mine"
        ref={ref}
        onClick={onClick}
      />,
    );
    const trigger = screen.getByTestId('t');
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger.getAttribute('title')).toBe('Pick');
    expect(ref.current).toBe(trigger);
    expect(trigger.closest('.mine')).toBeTruthy();
    expect(trigger.className).not.toContain('mine');
    await userEvent.click(trigger);
    expect(onClick).toHaveBeenCalled();
  });

  it('errorMessage implies invalid and is described; placeholder is overridable', () => {
    wrap(
      <Select
        label="Fruit"
        options={SELECT_OPTIONS}
        description="Hint"
        errorMessage="Bad"
        placeholder="Elige"
      />,
    );
    const trigger = screen.getByRole('button', { name: /Fruit/ });
    expect(trigger.textContent).toContain('Elige');
    expect(describedTexts(trigger)).toEqual(expect.arrayContaining(['Hint', 'Bad']));
  });

  it('parts take native props, className and ref', () => {
    const labelRef = createRef<HTMLLabelElement>();
    const valueRef = createRef<HTMLSpanElement>();
    const triggerRef = createRef<HTMLButtonElement>();
    wrap(
      <Select.Root>
        <Select.Label data-testid="label" className="l" ref={labelRef}>
          Fruit
        </Select.Label>
        <Select.Trigger data-testid="trigger" className="tr" ref={triggerRef}>
          <Select.Value data-testid="value" className="v" ref={valueRef} />
        </Select.Trigger>
        <Select.Description data-testid="desc" className="d">
          Hint
        </Select.Description>
      </Select.Root>,
    );
    expect(screen.getByTestId('label')).toBe(labelRef.current);
    expect(screen.getByTestId('label').className).toContain('l');
    expect(screen.getByTestId('trigger')).toBe(triggerRef.current);
    expect(screen.getByTestId('value')).toBe(valueRef.current);
    expect(screen.getByTestId('desc').className).toContain('d');
  });
});

describe('Combobox / Typeahead passthrough', () => {
  it('Combobox.Input sends ref and attrs to the input; className to the wrapper; clear label overridable', () => {
    const ref = createRef<HTMLInputElement>();
    wrap(
      <Combobox.Root aria-label="Search">
        <Combobox.Input
          data-testid="t"
          autoComplete="off"
          className="mine"
          ref={ref}
          clearable
          clearLabel="Borrar"
        />
      </Combobox.Root>,
    );
    const input = screen.getByTestId('t') as HTMLInputElement;
    expect(input.tagName).toBe('INPUT');
    expect(ref.current).toBe(input);
    expect(input.autocomplete).toBe('off');
    expect(input.parentElement?.className).toContain('mine');
    expect(screen.getByRole('button', { name: 'Borrar' })).toBeTruthy();
  });

  it('Typeahead sends ref/attrs to the input and className to the root; errorMessage implies invalid', () => {
    const ref = createRef<HTMLInputElement>();
    const onKeyDown = vi.fn();
    wrap(
      <Typeahead
        label="Fruit"
        options={OPTIONS}
        description="Hint"
        errorMessage="Bad"
        data-testid="t"
        name="fruit"
        className="mine"
        ref={ref}
        clearLabel="Borrar"
        onKeyDown={onKeyDown}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Fruit' }) as HTMLInputElement;
    expect(screen.getByTestId('t')).toBe(input);
    expect(ref.current).toBe(input);
    expect(input.closest('.mine')).toBeTruthy();
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(describedTexts(input)).toEqual(expect.arrayContaining(['Hint', 'Bad']));
    expect(screen.getByRole('button', { name: 'Borrar' })).toBeTruthy();
  });
});

describe('MultiSelector passthrough', () => {
  it('sends ref/attrs to the trigger, className to the root, wires ids', async () => {
    const ref = createRef<HTMLButtonElement>();
    const onClick = vi.fn();
    wrap(
      <MultiSelector
        label="Fruit"
        description="Hint"
        errorMessage="Bad"
        options={OPTIONS}
        value={[]}
        onValueChange={() => {}}
        data-testid="t"
        id="ms"
        className="mine"
        ref={ref}
        onClick={onClick}
      />,
    );
    const trigger = screen.getByTestId('t');
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger.id).toBe('ms');
    expect(ref.current).toBe(trigger);
    expect(trigger.getAttribute('aria-invalid')).toBe('true');
    expect(describedTexts(trigger)).toEqual(expect.arrayContaining(['Hint', 'Bad']));
    expect(trigger.closest('.mine')).toBeTruthy();
    await userEvent.click(trigger);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Tokenizer passthrough', () => {
  it('sends ref/attrs to the search input, className to the root; strings overridable', () => {
    const ref = createRef<HTMLInputElement>();
    const onKeyDown = vi.fn();
    wrap(
      <Tokenizer
        options={OPTIONS}
        value={['apple']}
        onValueChange={() => {}}
        description="Hint"
        errorMessage="Bad"
        data-testid="t"
        id="tk"
        className="mine"
        ref={ref}
        searchLabel="Buscar"
        tokensLabel="Elegidos"
        removeLabel="Quitar"
        onKeyDown={onKeyDown}
      />,
    );
    const input = screen.getByTestId('t') as HTMLInputElement;
    expect(input.tagName).toBe('INPUT');
    expect(input.id).toBe('tk');
    expect(ref.current).toBe(input);
    expect(input.getAttribute('aria-label')).toBe('Buscar');
    expect(input.closest('.mine')).toBeTruthy();
    expect(describedTexts(input)).toEqual(expect.arrayContaining(['Hint', 'Bad']));
    expect(screen.getByRole('button', { name: /Quitar Apple/ })).toBeTruthy();
    expect(screen.getByRole('grid', { name: 'Elegidos' })).toBeTruthy();
  });
});

describe('SegmentedControl passthrough', () => {
  it('sends attrs and ref to the group and merges className', () => {
    const ref = createRef<HTMLDivElement>();
    wrap(
      <SegmentedControl
        aria-label="View"
        data-testid="t"
        className="mine"
        ref={ref}
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
      />,
    );
    const group = screen.getByTestId('t');
    expect(ref.current).toBe(group);
    expect(group.className).toContain('mine');
  });
});

describe('Chip passthrough', () => {
  it('static chip: attrs, className and ref reach the span', () => {
    const ref = createRef<HTMLElement>();
    wrap(
      <Chip data-testid="t" title="tip" id="c" className="mine" ref={ref}>
        Beta
      </Chip>,
    );
    const el = screen.getByTestId('t');
    expect(el.tagName).toBe('SPAN');
    expect(el.id).toBe('c');
    expect(el.getAttribute('title')).toBe('tip');
    expect(el.className).toContain('mine');
    expect(ref.current).toBe(el);
  });

  it('toggle chip: attrs, handlers and ref reach the button', async () => {
    const ref = createRef<HTMLElement>();
    const onMouseEnter = vi.fn();
    wrap(
      <Chip
        selected={false}
        onSelectedChange={() => {}}
        data-testid="t"
        title="tip"
        className="mine"
        ref={ref}
        onMouseEnter={onMouseEnter}
      >
        React
      </Chip>,
    );
    const el = screen.getByTestId('t');
    expect(el.tagName).toBe('BUTTON');
    expect(el.getAttribute('title')).toBe('tip');
    expect(el.className).toContain('mine');
    expect(ref.current).toBe(el);
    await userEvent.hover(el);
    expect(onMouseEnter).toHaveBeenCalled();
  });

  it('ChipGroup passes attrs and ref to the group; options can be disabled', () => {
    const ref = createRef<HTMLDivElement>();
    wrap(
      <ChipGroup
        multiple
        aria-label="Tags"
        data-testid="t"
        className="mine"
        ref={ref}
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B', disabled: true },
        ]}
      />,
    );
    const group = screen.getByTestId('t');
    expect(ref.current).toBe(group);
    expect(group.className).toContain('mine');
    expect((screen.getByRole('button', { name: 'B' }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole('button', { name: 'A' }) as HTMLButtonElement).disabled).toBe(false);
  });
});

describe('RadioGroup / CheckboxGroup passthrough', () => {
  it('RadioGroup: attrs, ref and className on the group; description/error wired; option disabled', () => {
    const ref = createRef<HTMLDivElement>();
    wrap(
      <RadioGroup
        label="Size"
        description="Hint"
        errorMessage="Bad"
        data-testid="t"
        className="mine"
        ref={ref}
        options={[
          { value: 's', label: 'Small' },
          { value: 'l', label: 'Large', disabled: true },
        ]}
      />,
    );
    const group = screen.getByRole('radiogroup', { name: 'Size' });
    expect(screen.getByTestId('t')).toBe(group);
    expect(ref.current).toBe(group);
    expect(group.className).toContain('mine');
    expect(describedTexts(group)).toEqual(expect.arrayContaining(['Hint', 'Bad']));
    expect((screen.getByLabelText('Large') as HTMLInputElement).disabled).toBe(true);
    expect((screen.getByLabelText('Small') as HTMLInputElement).disabled).toBe(false);
  });

  it('CheckboxGroup: attrs, ref and className on the group; description/error wired; option disabled', () => {
    const ref = createRef<HTMLDivElement>();
    wrap(
      <CheckboxGroup
        label="Toppings"
        description="Hint"
        errorMessage="Bad"
        data-testid="t"
        className="mine"
        ref={ref}
        options={[
          { value: 'a', label: 'Cheese' },
          { value: 'b', label: 'Ham', disabled: true },
        ]}
      />,
    );
    const group = screen.getByRole('group', { name: 'Toppings' });
    expect(screen.getByTestId('t')).toBe(group);
    expect(ref.current).toBe(group);
    expect(group.className).toContain('mine');
    expect(describedTexts(group)).toEqual(expect.arrayContaining(['Hint', 'Bad']));
    expect((screen.getByLabelText('Ham') as HTMLInputElement).disabled).toBe(true);
  });
});

describe('Checkbox / Switch passthrough', () => {
  it('Checkbox: ref and field attrs reach the input; className on the label', async () => {
    const ref = createRef<HTMLInputElement>();
    const onKeyDown = vi.fn();
    wrap(
      <Checkbox name="agree" value="yes" id="cb" className="mine" ref={ref} onKeyDown={onKeyDown}>
        Agree
      </Checkbox>,
    );
    const input = screen.getByLabelText('Agree') as HTMLInputElement;
    expect(input.tagName).toBe('INPUT');
    expect(ref.current).toBe(input);
    expect(input.name).toBe('agree');
    expect(input.id).toBe('cb');
    expect(input.closest('label')?.className).toContain('mine');
    input.focus();
    await userEvent.keyboard('{Enter}');
    expect(onKeyDown).toHaveBeenCalled();
  });

  it('Switch: ref and field attrs reach the input; className on the label', () => {
    const ref = createRef<HTMLInputElement>();
    wrap(
      <Switch name="notify" id="sw" className="mine" ref={ref}>
        Notify
      </Switch>,
    );
    const input = screen.getByRole('switch') as HTMLInputElement;
    expect(ref.current).toBe(input);
    expect(input.name).toBe('notify');
    expect(input.id).toBe('sw');
    expect(input.closest('label')?.className).toContain('mine');
  });
});
