import { createRef } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { fireEvent, render, screen } from '@testing-library/react';
import { ToggleGroup } from './ToggleGroup';
import { Toolbar } from './Toolbar';

function Basic(props: Partial<React.ComponentProps<typeof ToggleGroup>> = {}) {
  return (
    <ToggleGroup aria-label="Style" {...(props as object)}>
      <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
      <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
      <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
    </ToggleGroup>
  );
}

const pressed = (name: string) =>
  screen.getByRole('button', { name }).getAttribute('aria-pressed') === 'true';

describe('ToggleGroup', () => {
  it('renders a labelled group of native buttons with aria-pressed', () => {
    render(<Basic />);
    const group = screen.getByRole('group', { name: 'Style' });
    expect(group.tagName).toBe('DIV');
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    for (const b of buttons) {
      expect(b.tagName).toBe('BUTTON');
      expect(b.getAttribute('type')).toBe('button');
      expect(b.getAttribute('aria-pressed')).toBe('false');
    }
  });

  it('passes props, className and ref to the group and items', () => {
    const ref = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLButtonElement>();
    const onClick = vi.fn();
    render(
      <ToggleGroup ref={ref} aria-label="x" id="g" className="custom" data-testid="g">
        <ToggleGroup.Item
          value="a"
          ref={itemRef}
          className="item-x"
          title="Alpha"
          aria-label="Alpha"
          onClick={onClick}
        >
          A
        </ToggleGroup.Item>
      </ToggleGroup>,
    );
    const group = screen.getByTestId('g');
    expect(ref.current).toBe(group);
    expect(group.id).toBe('g');
    expect(group.className).toContain('custom');
    expect(group.className).toContain('var-ui-toggle-group');
    expect(itemRef.current).toBe(screen.getByRole('button', { name: 'Alpha' }));
    expect(itemRef.current!.className).toContain('item-x');
    expect(itemRef.current!.title).toBe('Alpha');
    fireEvent.click(itemRef.current!);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(pressed('Alpha')).toBe(true);
  });

  it('single: presses one at a time and can be turned off', () => {
    const onValueChange = vi.fn();
    render(<Basic onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Bold' }));
    expect(pressed('Bold')).toBe(true);
    expect(onValueChange).toHaveBeenLastCalledWith('bold');
    fireEvent.click(screen.getByRole('button', { name: 'Italic' }));
    expect(pressed('Bold')).toBe(false);
    expect(pressed('Italic')).toBe(true);
    expect(onValueChange).toHaveBeenLastCalledWith('italic');
    fireEvent.click(screen.getByRole('button', { name: 'Italic' }));
    expect(pressed('Italic')).toBe(false);
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it('single + required: the pressed item stays pressed', () => {
    const onValueChange = vi.fn();
    render(<Basic required defaultValue="bold" onValueChange={onValueChange} />);
    expect(screen.getByRole('group', { name: 'Style' }).hasAttribute('data-required')).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Bold' }));
    expect(pressed('Bold')).toBe(true);
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Italic' }));
    expect(pressed('Italic')).toBe(true);
    expect(pressed('Bold')).toBe(false);
  });

  it('multiple: any number pressed, value is an array', () => {
    const onValueChange = vi.fn();
    render(<Basic multiple defaultValue={['bold']} onValueChange={onValueChange} />);
    expect(pressed('Bold')).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Italic' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['bold', 'italic']);
    fireEvent.click(screen.getByRole('button', { name: 'Bold' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['italic']);
    expect(pressed('Bold')).toBe(false);
  });

  it('multiple + required keeps the last pressed item', () => {
    render(<Basic multiple required defaultValue={['bold']} />);
    fireEvent.click(screen.getByRole('button', { name: 'Bold' }));
    expect(pressed('Bold')).toBe(true);
  });

  it('is controlled by value', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<Basic value="bold" onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Italic' }));
    expect(onValueChange).toHaveBeenCalledWith('italic');
    expect(pressed('Bold')).toBe(true);
    expect(pressed('Italic')).toBe(false);
    rerender(<Basic value="italic" onValueChange={onValueChange} />);
    expect(pressed('Italic')).toBe(true);
    rerender(<Basic value={null} onValueChange={onValueChange} />);
    expect(pressed('Italic')).toBe(false);
  });

  it('disables the whole group or a single item', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<Basic disabled onValueChange={onValueChange} />);
    for (const b of screen.getAllByRole('button'))
      expect((b as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Bold' }));
    expect(onValueChange).not.toHaveBeenCalled();
    rerender(
      <ToggleGroup aria-label="Style">
        <ToggleGroup.Item value="a">A</ToggleGroup.Item>
        <ToggleGroup.Item value="b" disabled>
          B
        </ToggleGroup.Item>
      </ToggleGroup>,
    );
    expect((screen.getByRole('button', { name: 'B' }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByRole('button', { name: 'B' }).hasAttribute('data-disabled')).toBe(true);
    expect((screen.getByRole('button', { name: 'A' }) as HTMLButtonElement).disabled).toBe(false);
  });

  it('item onClick can prevent the toggle', () => {
    render(
      <ToggleGroup aria-label="x">
        <ToggleGroup.Item value="a" onClick={(e) => e.preventDefault()}>
          A
        </ToggleGroup.Item>
      </ToggleGroup>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'A' }));
    expect(pressed('A')).toBe(false);
  });

  it('exposes data-selected and orientation hooks', () => {
    render(<Basic orientation="vertical" defaultValue="bold" />);
    expect(screen.getByRole('button', { name: 'Bold' }).hasAttribute('data-selected')).toBe(true);
    expect(screen.getByRole('button', { name: 'Italic' }).hasAttribute('data-selected')).toBe(
      false,
    );
    expect(screen.getByRole('group').getAttribute('data-orientation')).toBe('vertical');
  });

  it('keeps one Tab stop (the pressed item, else the first enabled)', () => {
    const { unmount } = render(<Basic defaultValue="italic" />);
    expect(screen.getByRole('button', { name: 'Italic' }).tabIndex).toBe(0);
    expect(screen.getByRole('button', { name: 'Bold' }).tabIndex).toBe(-1);
    unmount();
    render(<Basic />);
    expect(screen.getByRole('button', { name: 'Bold' }).tabIndex).toBe(0);
    expect(screen.getByRole('button', { name: 'Underline' }).tabIndex).toBe(-1);
  });

  it('works inside a Toolbar', () => {
    render(<Toolbar label="Editor" startContent={<Basic />} />);
    expect(screen.getByRole('toolbar', { name: 'Editor' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Bold' }));
    expect(pressed('Bold')).toBe(true);
  });

  it('is not part of a form submission', () => {
    const { container } = render(
      <form>
        <Basic defaultValue="bold" />
      </form>,
    );
    expect(new FormData(container.querySelector('form')!).entries().next().done).toBe(true);
  });

  it('throws when an item is rendered outside a group', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ToggleGroup.Item value="a">A</ToggleGroup.Item>)).toThrow();
    spy.mockRestore();
  });
});
