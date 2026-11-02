import { createRef } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { fireEvent, render, screen } from '@testing-library/react';
import { Menu } from './Menu';
import { Menubar } from './Menubar';

function Basic(props: Partial<React.ComponentProps<typeof Menubar>> = {}) {
  return (
    <Menubar aria-label="Application" {...props}>
      <Menubar.Menu label="File">
        <Menu.Item id="new">New</Menu.Item>
      </Menubar.Menu>
      <Menubar.Menu label="Edit">
        <Menu.Item id="undo">Undo</Menu.Item>
      </Menubar.Menu>
      <Menubar.Menu label="Window" disabled>
        <Menu.Item id="min">Minimize</Menu.Item>
      </Menubar.Menu>
      <Menubar.Menu label="Help">
        <Menu.Item id="about">About</Menu.Item>
      </Menubar.Menu>
    </Menubar>
  );
}

const trigger = (name: string) => screen.getByRole('menuitem', { name });

describe('Menubar', () => {
  it('renders a labelled menubar of menuitem buttons that have a popup', () => {
    render(<Basic />);
    const bar = screen.getByRole('menubar', { name: 'Application' });
    expect(bar.tagName).toBe('DIV');
    for (const name of ['File', 'Edit', 'Window', 'Help']) {
      const b = trigger(name);
      expect(b.tagName).toBe('BUTTON');
      expect(b.getAttribute('type')).toBe('button');
      expect(b.getAttribute('aria-haspopup')).toBe('menu');
    }
    expect(trigger('File').getAttribute('aria-expanded')).toBe('false');
  });

  it('passes props, className and refs to the bar and the triggers', () => {
    const ref = createRef<HTMLDivElement>();
    const triggerRef = createRef<HTMLButtonElement>();
    const onClick = vi.fn();
    render(
      <Menubar ref={ref} aria-label="x" id="bar" className="custom" data-testid="bar">
        <Menubar.Menu label="File" ref={triggerRef} className="t-x" title="Files" onClick={onClick}>
          <Menu.Item id="new">New</Menu.Item>
        </Menubar.Menu>
      </Menubar>,
    );
    const bar = screen.getByTestId('bar');
    expect(ref.current).toBe(bar);
    expect(bar.id).toBe('bar');
    expect(bar.className).toContain('custom');
    expect(bar.className).toContain('var-ui-menubar');
    expect(triggerRef.current).toBe(trigger('File'));
    expect(triggerRef.current!.className).toContain('t-x');
    expect(triggerRef.current!.className).toContain('var-ui-menubar__trigger');
    expect(triggerRef.current!.title).toBe('Files');
    fireEvent.click(triggerRef.current!);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('makes one enabled trigger the Tab stop; the disabled one is a native disabled button', () => {
    render(<Basic />);
    expect(trigger('File').tabIndex).toBe(0);
    expect(trigger('Edit').tabIndex).toBe(-1);
    expect(trigger('Help').tabIndex).toBe(-1);
    const disabled = trigger('Window') as HTMLButtonElement;
    expect(disabled.disabled).toBe(true);
    expect(disabled.hasAttribute('data-disabled')).toBe(true);
  });

  it('arrow keys, Home and End rove, wrap and skip disabled triggers', () => {
    render(<Basic />);
    trigger('File').focus();
    fireEvent.keyDown(trigger('File'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(trigger('Edit'));
    expect(trigger('Edit').tabIndex).toBe(0);
    expect(trigger('File').tabIndex).toBe(-1);
    fireEvent.keyDown(trigger('Edit'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(trigger('Help'));
    fireEvent.keyDown(trigger('Help'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(trigger('File'));
    fireEvent.keyDown(trigger('File'), { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(trigger('Help'));
    fireEvent.keyDown(trigger('Help'), { key: 'Home' });
    expect(document.activeElement).toBe(trigger('File'));
    fireEvent.keyDown(trigger('File'), { key: 'End' });
    expect(document.activeElement).toBe(trigger('Help'));
  });

  it('mirrors Left/Right in RTL', () => {
    render(
      <div dir="rtl">
        <Basic />
      </div>,
    );
    trigger('File').focus();
    fireEvent.keyDown(trigger('File'), { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(trigger('Edit'));
  });

  it('ignores modified arrow keys and keys from other elements', () => {
    render(<Basic />);
    trigger('File').focus();
    fireEvent.keyDown(trigger('File'), { key: 'ArrowRight', altKey: true });
    expect(document.activeElement).toBe(trigger('File'));
  });

  it('size follows the prop', () => {
    render(<Basic size="lg" />);
    expect(screen.getByRole('menubar').className).toContain('var-ui-menubar');
  });

  it('throws when Menubar.Menu is used outside a Menubar', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(
        <Menubar.Menu label="x">
          <Menu.Item id="a">A</Menu.Item>
        </Menubar.Menu>,
      ),
    ).toThrow(/inside a Menubar/);
    spy.mockRestore();
  });
});
