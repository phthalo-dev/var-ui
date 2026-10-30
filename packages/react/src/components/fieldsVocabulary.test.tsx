/** VarUI-vocabulary tests for the field-like components (NumberInput, PinInput, Slider, ...). */
import { useState } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { Button } from './Button';
import { ColorInput } from './ColorInput';
import { EditableText } from './EditableText';
import { FileInput } from './FileInput';
import { FileTrigger } from './FileTrigger';
import { InputGroup, InputGroupInput } from './InputGroup';
import { NumberInput } from './NumberInput';
import { PasswordInput } from './PasswordInput';
import { PinInput } from './PinInput';
import { SearchInput } from './SearchInput';
import { Slider } from './Slider';
import { TextAreaField } from './TextAreaField';

const wrap = (ui: React.ReactElement) => render(<IconProvider icons={{}}>{ui}</IconProvider>);

describe('Button loading', () => {
  it('ignores presses while loading', async () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole('button');
    expect(button.getAttribute('data-pending')).not.toBeNull();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
    rerender(<Button onClick={onClick}>Save</Button>);
    expect(screen.getByRole('button').getAttribute('data-pending')).toBeNull();
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('NumberInput', () => {
  it('reports the parsed number via onValueChange and the native event via onChange', async () => {
    const onValueChange = vi.fn();
    const onChange = vi.fn();
    render(<NumberInput label="Qty" onValueChange={onValueChange} onChange={onChange} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await userEvent.type(input, '12');
    await userEvent.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(12);
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0][0].target).toBe(input);
  });

  it('is controlled and uncontrolled', () => {
    const { rerender } = render(<NumberInput label="Qty" defaultValue={3} />);
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('3');
    rerender(<NumberInput label="Qty" value={7} onValueChange={() => {}} />);
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('7');
  });

  it('maps state flags and bounds to the DOM', async () => {
    const { rerender } = render(<NumberInput label="Qty" disabled required invalid />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(input.required).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    rerender(<NumberInput label="Qty" readOnly defaultValue={1} max={5} />);
    expect((screen.getByRole('textbox') as HTMLInputElement).readOnly).toBe(true);
    rerender(<NumberInput label="Qty" defaultValue={1} max={5} />);
    await userEvent.clear(screen.getByRole('textbox'));
    await userEvent.type(screen.getByRole('textbox'), '99');
    await userEvent.tab();
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('5');
  });
});

describe('PasswordInput and TextAreaField', () => {
  it('PasswordInput: value flags and onValueChange', async () => {
    const onValueChange = vi.fn();
    const onChange = vi.fn();
    const { container } = render(
      <PasswordInput label="Pw" required onValueChange={onValueChange} onChange={onChange} />,
    );
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.required).toBe(true);
    await userEvent.type(input, 'ab');
    expect(onValueChange).toHaveBeenLastCalledWith('ab');
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('TextAreaField: onValueChange, readOnly, disabled', async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<TextAreaField label="Bio" onValueChange={onValueChange} />);
    await userEvent.type(screen.getByRole('textbox'), 'hi');
    expect(onValueChange).toHaveBeenLastCalledWith('hi');
    rerender(<TextAreaField label="Bio" readOnly disabled />);
    const area = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(area.readOnly).toBe(true);
    expect(area.disabled).toBe(true);
  });
});

describe('SearchInput', () => {
  it('fires onValueChange with text and the native onChange with the event', async () => {
    const onValueChange = vi.fn();
    const onChange = vi.fn();
    wrap(<SearchInput onValueChange={onValueChange} onChange={onChange} />);
    await userEvent.type(screen.getByRole('searchbox'), 'ab');
    expect(onValueChange).toHaveBeenLastCalledWith('ab');
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange.mock.calls[0][0].target).toBe(screen.getByRole('searchbox'));
  });
});

describe('PinInput', () => {
  it('onValueChange gets the joined value, onComplete when full', async () => {
    const onValueChange = vi.fn();
    const onComplete = vi.fn();
    const onChange = vi.fn();
    render(
      <PinInput
        label="Code"
        length={3}
        onValueChange={onValueChange}
        onComplete={onComplete}
        onChange={onChange}
      />,
    );
    await userEvent.type(screen.getAllByRole('textbox')[0], '123');
    expect(onValueChange).toHaveBeenLastCalledWith('123');
    expect(onComplete).toHaveBeenCalledWith('123');
    // the native change event bubbles to the root group
    expect(onChange).toHaveBeenCalled();
  });

  it('characters switches numeric and alphanumeric; type stays free', async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<PinInput label="Code" length={2} onValueChange={onValueChange} />);
    await userEvent.type(screen.getAllByRole('textbox')[0], 'a');
    expect(onValueChange).not.toHaveBeenCalled();
    rerender(
      <PinInput label="Code" length={2} characters="alphanumeric" onValueChange={onValueChange} />,
    );
    await userEvent.type(screen.getAllByRole('textbox')[0], 'a');
    expect(onValueChange).toHaveBeenLastCalledWith('A');
  });

  it('controlled and uncontrolled', () => {
    const { rerender } = render(<PinInput label="Code" length={3} defaultValue="12" />);
    expect((screen.getAllByRole('textbox')[1] as HTMLInputElement).value).toBe('2');
    rerender(<PinInput label="Code" length={3} value="789" onValueChange={() => {}} />);
    expect((screen.getAllByRole('textbox')[2] as HTMLInputElement).value).toBe('9');
  });

  it('disabled and required reach every cell', () => {
    render(<PinInput label="Code" length={2} disabled required />);
    for (const cell of screen.getAllByRole('textbox') as HTMLInputElement[]) {
      expect(cell.disabled).toBe(true);
      expect(cell.getAttribute('aria-required')).toBe('true');
    }
  });
});

describe('EditableText', () => {
  it('onValueChange gets the draft; disabled and readOnly block editing', async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <EditableText value="a" onCommit={() => {}} onValueChange={onValueChange} activation="click">
        <span>a</span>
      </EditableText>,
    );
    await userEvent.click(screen.getByText('a'));
    await userEvent.keyboard('b');
    expect(onValueChange).toHaveBeenLastCalledWith('b'); // the existing text is selected when editing starts
    rerender(
      <EditableText value="a" onCommit={() => {}} disabled activation="click">
        <span>a</span>
      </EditableText>,
    );
    expect(screen.queryByRole('textbox')).toBeNull();
    rerender(
      <EditableText value="a" onCommit={() => {}} readOnly activation="click">
        <span>a</span>
      </EditableText>,
    );
    await userEvent.click(screen.getByText('a'));
    expect(screen.queryByRole('textbox')).toBeNull();
  });
});

describe('ColorInput', () => {
  it('onValueChange gets a valid hex; native onChange gets the event; flags reach the input', async () => {
    const onValueChange = vi.fn();
    const onChange = vi.fn();
    const { container } = wrap(
      <ColorInput
        label="Brand"
        defaultValue="#000000"
        onValueChange={onValueChange}
        onChange={onChange}
        required
      />,
    );
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.required).toBe(true);
    fireEvent.change(input, { target: { value: '#ff0000' } });
    expect(onValueChange).toHaveBeenLastCalledWith('#ff0000');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('disabled disables the input and swatch button', () => {
    const { container } = wrap(<ColorInput label="Brand" disabled />);
    expect((container.querySelector('input') as HTMLInputElement).disabled).toBe(true);
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true);
  });
});

describe('InputGroup', () => {
  it('disabled maps to aria-disabled', () => {
    render(
      <InputGroup label="Price" disabled>
        <InputGroupInput aria-label="Price" />
      </InputGroup>,
    );
    expect(screen.getByRole('group').getAttribute('aria-disabled')).toBe('true');
  });
});

describe('FileInput and FileTrigger', () => {
  it('FileInput: onValueChange gets the file, native onChange fires, disabled blocks', () => {
    const onValueChange = vi.fn();
    const onChange = vi.fn();
    const file = new File(['x'], 'a.txt', { type: 'text/plain' });
    const { container, rerender } = render(
      <FileInput label="Doc" value={null} onValueChange={onValueChange} onChange={onChange} />,
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });
    expect(onValueChange).toHaveBeenCalledWith(file);
    expect(onChange).toHaveBeenCalledTimes(1);
    rerender(<FileInput label="Doc" value={null} onValueChange={onValueChange} disabled />);
    expect((container.querySelector('input[type="file"]') as HTMLInputElement).disabled).toBe(true);
    expect(screen.getByRole('button').getAttribute('aria-disabled')).toBe('true');
  });

  it('FileTrigger: disabled disables the child button and the input', () => {
    const { container } = render(
      <FileTrigger onSelect={() => {}} disabled>
        <button type="button">Pick</button>
      </FileTrigger>,
    );
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true);
    expect((container.querySelector('input') as HTMLInputElement).disabled).toBe(true);
  });
});

describe('Slider', () => {
  it('onValueChange gets a number and the native onChange fires on the input', async () => {
    const onValueChange = vi.fn();
    const onChange = vi.fn();
    render(
      <Slider label="Vol" defaultValue={40} onValueChange={onValueChange} onChange={onChange} />,
    );
    const input = screen.getByRole('slider') as HTMLInputElement;
    expect(input.value).toBe('40');
    fireEvent.change(input, { target: { value: '50' } });
    expect(onValueChange).toHaveBeenLastCalledWith(50);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target).toBe(input);
  });

  it('is controlled and honours disabled and min/max', () => {
    function Controlled() {
      const [v, setV] = useState(10);
      return <Slider label="Vol" value={v} onValueChange={setV} min={0} max={20} />;
    }
    const { unmount } = render(<Controlled />);
    const input = screen.getByRole('slider') as HTMLInputElement;
    expect(input.value).toBe('10');
    expect(input.max).toBe('20');
    unmount();
    render(<Slider label="Vol" disabled />);
    expect((screen.getByRole('slider') as HTMLInputElement).disabled).toBe(true);
  });
});
