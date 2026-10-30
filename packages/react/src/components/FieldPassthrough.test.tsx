import { createRef } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField } from './TextField';
import { TextAreaField } from './TextAreaField';
import { PasswordInput } from './PasswordInput';
import { SearchInput } from './SearchInput';
import { NumberInput } from './NumberInput';
import { Slider } from './Slider';
import { PinInput } from './PinInput';
import { ColorInput } from './ColorInput';
import { InputGroup, InputGroupInput } from './InputGroup';
import { InputGroupText } from './InputGroupText';
import { EditableText } from './EditableText';

describe('TextField / TextAreaField / PasswordInput passthrough', () => {
  it('TextField sends native attrs, ref and handlers to the input; className to the root', async () => {
    const ref = createRef<HTMLInputElement>();
    const onKeyDown = vi.fn();
    render(
      <TextField
        label="Name"
        data-testid="t"
        id="name-id"
        autoComplete="name"
        className="mine"
        ref={ref}
        onKeyDown={onKeyDown}
      />,
    );
    const input = screen.getByLabelText('Name') as HTMLInputElement;
    expect(screen.getByTestId('t')).toBe(input);
    expect(input.id).toBe('name-id');
    expect(input.autocomplete).toBe('name');
    expect(ref.current).toBe(input);
    expect(input.parentElement?.className).toContain('mine');
    await userEvent.type(input, 'a');
    expect(onKeyDown).toHaveBeenCalled();
  });

  it('wires description and error ids into aria-describedby and derives invalid', () => {
    render(<TextField label="Name" description="Hint" errorMessage="Bad" />);
    const input = screen.getByLabelText('Name');
    const ids = (input.getAttribute('aria-describedby') ?? '').split(' ');
    expect(ids.map((id) => document.getElementById(id)?.textContent)).toEqual(
      expect.arrayContaining(['Hint', 'Bad']),
    );
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('TextAreaField reaches the textarea', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<TextAreaField label="Bio" data-testid="t" rows={5} ref={ref} className="mine" />);
    const el = screen.getByLabelText('Bio') as HTMLTextAreaElement;
    expect(screen.getByTestId('t')).toBe(el);
    expect(el.rows).toBe(5);
    expect(ref.current).toBe(el);
    expect(el.parentElement?.className).toContain('mine');
  });

  it('PasswordInput passes attrs/ref to the input and labels are overridable', async () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <PasswordInput
        label="Password"
        data-testid="t"
        ref={ref}
        className="mine"
        showPasswordLabel="Mostrar"
        hidePasswordLabel="Ocultar"
      />,
    );
    const input = screen.getByLabelText('Password') as HTMLInputElement;
    expect(screen.getByTestId('t')).toBe(input);
    expect(ref.current).toBe(input);
    expect(input.parentElement?.parentElement?.className).toContain('mine');
    await userEvent.click(screen.getByRole('button', { name: 'Mostrar' }));
    expect(input.type).toBe('text');
    expect(screen.getByRole('button', { name: 'Ocultar' })).toBeTruthy();
  });
});

describe('SearchInput passthrough', () => {
  it('sends attrs and ref to the input, className to the root, placeholder is the default name', async () => {
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    const onFocus = vi.fn();
    render(
      <SearchInput
        data-testid="t"
        id="s"
        className="mine"
        ref={ref}
        onValueChange={onChange}
        onFocus={onFocus}
      />,
    );
    const input = screen.getByTestId('t') as HTMLInputElement;
    expect(input.tagName).toBe('INPUT');
    expect(input.id).toBe('s');
    expect(input.getAttribute('aria-label')).toBe('Search…');
    expect(ref.current).toBe(input);
    expect(input.parentElement?.className).toContain('mine');
    await userEvent.type(input, 'x');
    expect(onChange).toHaveBeenCalledWith('x');
    expect(onFocus).toHaveBeenCalled();
  });
});

describe('NumberInput passthrough', () => {
  it('sends attrs and ref to the input, className to the root, labels overridable', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <NumberInput
        label="Qty"
        data-testid="t"
        className="mine"
        ref={ref}
        decrementLabel="Menos"
        incrementLabel="Mas"
      />,
    );
    const input = screen.getByTestId('t') as HTMLInputElement;
    expect(input.tagName).toBe('INPUT');
    expect(ref.current).toBe(input);
    expect(input.getAttribute('aria-labelledby')).toBe(screen.getByText('Qty').id);
    expect(screen.getByRole('button', { name: /Menos/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Mas/ })).toBeTruthy();
    expect(input.closest('.mine')).toBeTruthy();
  });
});

describe('Slider passthrough', () => {
  it('points ref and name at the range input and merges className on the root', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(
      <Slider
        label="Volume"
        name="vol"
        ref={ref}
        className="mine"
        data-testid="t"
        description="Hint"
      />,
    );
    expect(ref.current?.type).toBe('range');
    expect(ref.current?.name).toBe('vol');
    expect(screen.getByTestId('t').className).toContain('mine');
    expect(container.querySelector('#' + CSS.escape(screen.getByText('Hint').id))).toBeTruthy();
  });
});

describe('PinInput passthrough', () => {
  it('puts ref on the first cell and attrs on the group; className on the root; labels overridable', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <PinInput
        label="Code"
        length={2}
        data-testid="t"
        ref={ref}
        className="mine"
        getCellLabel={(i) => `Cell ${i}`}
      />,
    );
    const cells = screen.getAllByRole('textbox');
    expect(ref.current).toBe(cells[0]);
    expect(cells[1]?.getAttribute('aria-label')).toBe('Cell 1');
    const group = screen.getByTestId('t');
    expect(group.getAttribute('role')).toBe('group');
    expect(group.parentElement?.className).toContain('mine');
  });
});

describe('ColorInput passthrough', () => {
  it('sends attrs, ref and handlers to the hex input', async () => {
    const ref = createRef<HTMLInputElement>();
    const onBlur = vi.fn();
    render(
      <ColorInput
        label="Brand"
        defaultValue="#ff00aa"
        data-testid="t"
        ref={ref}
        className="mine"
        onBlur={onBlur}
      />,
    );
    const input = screen.getByLabelText('Brand') as HTMLInputElement;
    expect(screen.getByTestId('t')).toBe(input);
    expect(ref.current).toBe(input);
    expect(input.parentElement?.parentElement?.className).toContain('mine');
    input.focus();
    input.blur();
    expect(onBlur).toHaveBeenCalled();
  });
});

describe('InputGroup passthrough', () => {
  it('sends attrs and ref to the group element; className to the root', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <InputGroup label="Price" data-testid="t" ref={ref} className="mine" errorMessage="Bad">
        <InputGroupText data-testid="txt">$</InputGroupText>
        <InputGroupInput aria-label="Price" />
      </InputGroup>,
    );
    const group = screen.getByRole('group');
    expect(screen.getByTestId('t')).toBe(group);
    expect(ref.current).toBe(group);
    expect(group.parentElement?.className).toContain('mine');
    expect(group.getAttribute('aria-describedby')).toBeTruthy();
    expect(screen.getByTestId('txt').textContent).toBe('$');
  });
});

describe('EditableText passthrough', () => {
  it('sends attrs, ref, className and handlers to the root; empty label overridable', async () => {
    const ref = createRef<HTMLDivElement>();
    const onClick = vi.fn();
    render(
      <EditableText
        value=""
        onCommit={() => {}}
        data-testid="t"
        ref={ref}
        className="mine"
        onClick={onClick}
        activation="click"
        emptyLabel="Editar"
      >
        <span>x</span>
      </EditableText>,
    );
    const root = screen.getByTestId('t');
    expect(ref.current).toBe(root);
    expect(root.className).toContain('mine');
    await userEvent.click(root);
    expect(onClick).toHaveBeenCalled();
    expect(screen.getByLabelText('Editar')).toBeTruthy();
  });
});
