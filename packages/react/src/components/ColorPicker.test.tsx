import { describe, expect, it, vi } from 'vite-plus/test';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorPicker } from './ColorPicker';

describe('ColorPicker', () => {
  it('renders saturation, hue, and swatch controls', () => {
    render(
      <ColorPicker value="#228be6" onValueChange={() => {}} swatches={['#ff0000', '#00ff00']} />,
    );
    expect(screen.getByLabelText('Saturation and brightness')).toBeTruthy();
    expect(screen.getByRole('slider', { name: 'Hue' })).toBeTruthy();
    expect(screen.getByRole('listbox', { name: 'Color swatches' })).toBeTruthy();
  });

  it('selects a swatch color', async () => {
    const onValueChange = vi.fn();
    render(<ColorPicker value="#228be6" onValueChange={onValueChange} swatches={['#ff0000']} />);
    await userEvent.click(screen.getByRole('option', { name: '#ff0000' }));
    expect(onValueChange).toHaveBeenCalledWith('#ff0000');
  });
});

describe('ColorPicker keyboard support', () => {
  it('adjusts hue with arrows, shift, page and home/end', () => {
    const { container } = render(<ColorPicker defaultValue="#ff0000" />);
    const hue = screen.getByRole('slider', { name: 'Hue' });
    expect(hue.getAttribute('aria-valuetext')).toBe('0 degrees');
    fireEvent.keyDown(hue, { key: 'ArrowRight' });
    expect(hue.getAttribute('aria-valuenow')).toBe('1');
    fireEvent.keyDown(hue, { key: 'ArrowRight', shiftKey: true });
    expect(hue.getAttribute('aria-valuenow')).toBe('11');
    fireEvent.keyDown(hue, { key: 'PageUp' });
    expect(hue.getAttribute('aria-valuenow')).toBe('21');
    fireEvent.keyDown(hue, { key: 'ArrowLeft' });
    expect(hue.getAttribute('aria-valuenow')).toBe('20');
    fireEvent.keyDown(hue, { key: 'End' });
    expect(hue.getAttribute('aria-valuenow')).toBe('359');
    fireEvent.keyDown(hue, { key: 'Home' });
    expect(hue.getAttribute('aria-valuenow')).toBe('0');
    expect(container).toBeTruthy();
  });

  it('adjusts alpha with the keyboard', () => {
    render(<ColorPicker defaultValue="#ff0000ff" withAlpha />);
    const alpha = screen.getByRole('slider', { name: 'Alpha' });
    fireEvent.keyDown(alpha, { key: 'ArrowLeft', shiftKey: true });
    expect(alpha.getAttribute('aria-valuenow')).toBe('90');
    expect(alpha.getAttribute('aria-valuetext')).toBe('90%');
    fireEvent.keyDown(alpha, { key: 'Home' });
    expect(alpha.getAttribute('aria-valuenow')).toBe('0');
  });
});
