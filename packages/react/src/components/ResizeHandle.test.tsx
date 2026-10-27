import { describe, expect, it, vi } from 'vite-plus/test';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResizeHandle } from './ResizeHandle';

// jsdom has no PointerEvent; without it `fireEvent.pointer*` drops pointerId/clientX.
if (typeof window.PointerEvent === 'undefined') {
  class PointerEventShim extends MouseEvent {
    pointerId: number;
    pointerType: string;
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
      this.pointerId = init.pointerId ?? 0;
      this.pointerType = init.pointerType ?? 'mouse';
    }
  }
  window.PointerEvent = PointerEventShim as unknown as typeof PointerEvent;
}

describe('ResizeHandle', () => {
  it('renders as a labeled separator with value attrs', () => {
    render(
      <ResizeHandle
        value={260}
        minValue={180}
        maxValue={480}
        onChange={() => {}}
        aria-label="Resize sidebar"
      />,
    );
    const handle = screen.getByRole('separator', { name: 'Resize sidebar' });
    expect(handle.getAttribute('aria-orientation')).toBe('horizontal');
    expect(handle.getAttribute('aria-valuenow')).toBe('260');
    expect(handle.getAttribute('aria-valuemin')).toBe('180');
    expect(handle.getAttribute('aria-valuemax')).toBe('480');
    expect(handle.getAttribute('tabindex')).toBe('0');
  });

  it('nudges value by 10 on ArrowRight for horizontal direction', async () => {
    const onChange = vi.fn();
    render(
      <ResizeHandle
        value={260}
        minValue={180}
        maxValue={480}
        onChange={onChange}
        aria-label="Resize"
      />,
    );
    const handle = screen.getByRole('separator', { name: 'Resize' });
    handle.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith(270);
  });

  it('nudges value by -10 on ArrowLeft for horizontal direction', async () => {
    const onChange = vi.fn();
    render(
      <ResizeHandle
        value={260}
        minValue={180}
        maxValue={480}
        onChange={onChange}
        aria-label="Resize"
      />,
    );
    const handle = screen.getByRole('separator', { name: 'Resize' });
    handle.focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(onChange).toHaveBeenCalledWith(250);
  });

  it('nudges by 50 with Shift held', async () => {
    const onChange = vi.fn();
    render(
      <ResizeHandle
        value={260}
        minValue={180}
        maxValue={480}
        onChange={onChange}
        aria-label="Resize"
      />,
    );
    const handle = screen.getByRole('separator', { name: 'Resize' });
    handle.focus();
    await userEvent.keyboard('{Shift>}{ArrowRight}{/Shift}');
    expect(onChange).toHaveBeenCalledWith(310);
  });

  it('clamps arrow-key nudges to min/max', async () => {
    const onChange = vi.fn();
    render(
      <ResizeHandle
        value={478}
        minValue={180}
        maxValue={480}
        onChange={onChange}
        aria-label="Resize"
      />,
    );
    const handle = screen.getByRole('separator', { name: 'Resize' });
    handle.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith(480);
  });

  it('jumps to min/max on Home/End', async () => {
    const onChange = vi.fn();
    render(
      <ResizeHandle
        value={260}
        minValue={180}
        maxValue={480}
        onChange={onChange}
        aria-label="Resize"
      />,
    );
    const handle = screen.getByRole('separator', { name: 'Resize' });
    handle.focus();
    await userEvent.keyboard('{Home}');
    expect(onChange).toHaveBeenLastCalledWith(180);
    await userEvent.keyboard('{End}');
    expect(onChange).toHaveBeenLastCalledWith(480);
  });

  it('uses vertical orientation and arrow keys when direction is vertical', async () => {
    const onChange = vi.fn();
    render(
      <ResizeHandle
        direction="vertical"
        value={260}
        minValue={180}
        maxValue={480}
        onChange={onChange}
        aria-label="Resize panel"
      />,
    );
    const handle = screen.getByRole('separator', { name: 'Resize panel' });
    expect(handle.getAttribute('aria-orientation')).toBe('vertical');
    handle.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(onChange).toHaveBeenCalledWith(270);
  });

  it('tracks pointer drag delta on the inline axis', () => {
    const onChange = vi.fn();
    render(
      <ResizeHandle
        value={260}
        minValue={180}
        maxValue={480}
        onChange={onChange}
        aria-label="Resize"
      />,
    );
    const handle = screen.getByRole('separator', { name: 'Resize' });
    fireEvent.pointerDown(handle, { pointerId: 1, pointerType: 'touch', clientX: 100, clientY: 0 });
    fireEvent.pointerMove(handle, { pointerId: 1, pointerType: 'touch', clientX: 140, clientY: 0 });
    expect(onChange).toHaveBeenCalledWith(300);
    fireEvent.pointerUp(handle, { pointerId: 1, pointerType: 'touch' });
    onChange.mockClear();
    fireEvent.pointerMove(handle, { pointerId: 1, pointerType: 'touch', clientX: 200, clientY: 0 });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('ignores moves from a different pointer and non-primary mouse buttons', () => {
    const onChange = vi.fn();
    render(
      <ResizeHandle
        value={260}
        minValue={180}
        maxValue={480}
        onChange={onChange}
        aria-label="Resize"
      />,
    );
    const handle = screen.getByRole('separator', { name: 'Resize' });
    fireEvent.pointerDown(handle, { pointerId: 1, pointerType: 'mouse', button: 2, clientX: 100 });
    fireEvent.pointerMove(handle, { pointerId: 1, pointerType: 'mouse', clientX: 140 });
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.pointerDown(handle, { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 100 });
    fireEvent.pointerMove(handle, { pointerId: 2, pointerType: 'touch', clientX: 140 });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not start a drag while collapsed', () => {
    const onChange = vi.fn();
    render(
      <ResizeHandle
        value={260}
        minValue={180}
        maxValue={480}
        onChange={onChange}
        isCollapsed
        aria-label="Resize"
      />,
    );
    const handle = screen.getByRole('separator', { name: 'Resize' });
    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 100, clientY: 0 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 140, clientY: 0 });
    expect(onChange).not.toHaveBeenCalled();
    expect(handle.getAttribute('data-collapsed')).toBe('');
  });

  it('calls onCollapse on double click', async () => {
    const onCollapse = vi.fn();
    render(
      <ResizeHandle
        value={260}
        minValue={180}
        maxValue={480}
        onChange={() => {}}
        onCollapse={onCollapse}
        aria-label="Resize"
      />,
    );
    const handle = screen.getByRole('separator', { name: 'Resize' });
    await userEvent.dblClick(handle);
    expect(onCollapse).toHaveBeenCalledTimes(1);
  });
});
