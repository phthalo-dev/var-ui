/** Canonical VarUI-vocabulary tests for the PR 2 reference components. Copy the shape for other groups. */
import { useState } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { Alert } from './Alert';
import { Button } from './Button';
import { Checkbox } from './Checkbox';
import { Dialog } from './Dialog';
import { IconButton } from './IconButton';
import { Select } from './Select';
import { Switch } from './Switch';
import { TextField } from './TextField';

const wrap = (ui: React.ReactElement) => render(<IconProvider icons={{}}>{ui}</IconProvider>);

describe('Button', () => {
  it('fires onClick for mouse and keyboard, not when disabled', async () => {
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Go</Button>);
    const u = userEvent.setup();
    await u.click(screen.getByRole('button'));
    await u.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(2);
    rerender(
      <Button onClick={onClick} disabled>
        Go
      </Button>,
    );
    await u.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(2);
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true);
  });

  it('keeps native attributes (name, type, form)', () => {
    render(
      <Button name="intent" type="submit" form="f1">
        Save
      </Button>,
    );
    const el = screen.getByRole('button');
    expect(el.getAttribute('name')).toBe('intent');
    expect(el.getAttribute('type')).toBe('submit');
    expect(el.getAttribute('form')).toBe('f1');
  });
});

describe('IconButton', () => {
  it('takes icon (name or node) and leaves name native', () => {
    const { rerender } = wrap(<IconButton icon="close" name="dismiss" aria-label="Close" />);
    expect(screen.getByRole('button').getAttribute('name')).toBe('dismiss');
    rerender(
      <IconProvider icons={{}}>
        <IconButton icon={<svg data-testid="custom" />} aria-label="Custom" />
      </IconProvider>,
    );
    expect(screen.getByTestId('custom')).toBeTruthy();
  });
});

describe('TextField', () => {
  it('calls onValueChange with the string and native onChange with the event', () => {
    const onValueChange = vi.fn();
    const onChange = vi.fn();
    render(<TextField label="Name" onValueChange={onValueChange} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ada' } });
    expect(onValueChange).toHaveBeenCalledWith('Ada');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target.value).toBe('Ada');
  });

  it('supports controlled and uncontrolled values', () => {
    const { rerender } = render(<TextField label="Name" defaultValue="a" />);
    expect((screen.getByLabelText('Name') as HTMLInputElement).value).toBe('a');
    rerender(<TextField label="Name" value="b" onValueChange={() => {}} />);
    expect((screen.getByLabelText('Name') as HTMLInputElement).value).toBe('b');
  });

  it('maps disabled / required / readOnly / invalid', () => {
    render(<TextField label="Name" disabled required readOnly invalid />);
    const input = screen.getByLabelText(/Name/) as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(input.required).toBe(true);
    expect(input.readOnly).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });
});

describe('Checkbox', () => {
  it('uncontrolled: defaultChecked + onCheckedChange + native onChange', async () => {
    const onCheckedChange = vi.fn();
    const onChange = vi.fn();
    render(
      <Checkbox defaultChecked onCheckedChange={onCheckedChange} onChange={onChange}>
        Accept
      </Checkbox>,
    );
    const box = screen.getByRole('checkbox') as HTMLInputElement;
    expect(box.checked).toBe(true);
    await userEvent.click(box);
    expect(onCheckedChange).toHaveBeenCalledWith(false);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target).toBe(box);
    expect(box.checked).toBe(false);
  });

  it('controlled: checked follows the prop', async () => {
    function Controlled() {
      const [on, setOn] = useState(false);
      return (
        <Checkbox checked={on} onCheckedChange={setOn}>
          Accept
        </Checkbox>
      );
    }
    render(<Controlled />);
    const box = screen.getByRole('checkbox') as HTMLInputElement;
    await userEvent.click(box);
    expect(box.checked).toBe(true);
  });

  it('indeterminate and disabled', () => {
    render(
      <Checkbox indeterminate disabled>
        Some
      </Checkbox>,
    );
    expect(document.querySelector('[data-indeterminate]')).not.toBeNull();
    expect((screen.getByRole('checkbox') as HTMLInputElement).disabled).toBe(true);
  });
});

describe('Switch', () => {
  it('checked / onCheckedChange / native onChange', async () => {
    const onCheckedChange = vi.fn();
    const onChange = vi.fn();
    render(
      <Switch onCheckedChange={onCheckedChange} onChange={onChange}>
        Notify
      </Switch>,
    );
    await userEvent.click(screen.getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

describe('Select', () => {
  const OPTIONS = [
    { value: 'apple', label: 'Apple' },
    { value: 'plum', label: 'Plum', disabled: true },
    { value: 'fig', label: 'Fig' },
  ];

  it('single: onValueChange gets the option value; disabled options are skipped', async () => {
    const onValueChange = vi.fn();
    wrap(<Select label="Fruit" options={OPTIONS} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('button', { name: /Fruit/ }));
    expect(screen.getByRole('option', { name: 'Plum' }).getAttribute('aria-disabled')).toBe('true');
    await userEvent.click(await screen.findByRole('option', { name: 'Fig' }));
    expect(onValueChange).toHaveBeenCalledWith('fig');
  });

  it('single: controlled value renders in the trigger', () => {
    wrap(<Select label="Fruit" options={OPTIONS} value="apple" />);
    expect(screen.getByRole('button', { name: /Fruit/ }).textContent).toContain('Apple');
  });

  it('multiple: value is string[]', async () => {
    const onValueChange = vi.fn();
    wrap(
      <Select
        label="Fruit"
        options={OPTIONS}
        multiple
        defaultValue={['apple']}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /Fruit/ }));
    await userEvent.click(await screen.findByRole('option', { name: 'Fig' }));
    expect(onValueChange).toHaveBeenCalledWith(['apple', 'fig']);
  });

  it('open / onOpenChange', async () => {
    const onOpenChange = vi.fn();
    wrap(<Select label="Fruit" options={OPTIONS} onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByRole('button', { name: /Fruit/ }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    wrap(<Select label="Other" options={OPTIONS} open />);
    expect((await screen.findAllByRole('listbox')).length).toBeGreaterThan(0);
  });

  it('disabled', () => {
    wrap(<Select label="Fruit" options={OPTIONS} disabled />);
    expect((screen.getByRole('button', { name: /Fruit/ }) as HTMLButtonElement).disabled).toBe(
      true,
    );
  });
});

describe('Dialog', () => {
  const body = (props: { open?: boolean; dismissable?: boolean; onOpenChange?: () => void }) => (
    <Dialog.Root {...props}>
      <Dialog.Backdrop>
        <Dialog.Popup aria-label="Demo">
          <Dialog.Title>Hi</Dialog.Title>
        </Dialog.Popup>
      </Dialog.Backdrop>
    </Dialog.Root>
  );

  it('open shows the dialog; onOpenChange fires on Escape when dismissable', async () => {
    const onOpenChange = vi.fn();
    wrap(body({ open: true, onOpenChange }));
    expect(await screen.findByRole('dialog')).toBeTruthy();
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalled();
    expect(onOpenChange.mock.calls[0][0]).toBe(false);
  });

  it('outside press closes only when dismissable', async () => {
    const closed = vi.fn();
    const kept = vi.fn();
    const { unmount } = wrap(body({ open: true, onOpenChange: closed }));
    await userEvent.click(document.body);
    expect(closed).toHaveBeenCalled();
    unmount();
    wrap(body({ open: true, dismissable: false, onOpenChange: kept }));
    await screen.findByRole('dialog');
    await userEvent.click(document.body);
    expect(kept).not.toHaveBeenCalled();
  });
});

describe('Alert', () => {
  it('tone drives the recipe axis and data hook', () => {
    wrap(<Alert tone="danger">Boom</Alert>);
    const root = document.querySelector('[data-alert]') as HTMLElement;
    expect(root.getAttribute('data-tone')).toBe('danger');
    expect(root.getAttribute('data-alert-tone')).toBe('danger');
  });
});
