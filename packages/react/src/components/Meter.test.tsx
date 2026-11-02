import { createRef } from 'react';
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { getMeterTone } from '@var-ui/core/components/meter';
import { Meter } from './Meter';

describe('Meter', () => {
  it('exposes meter semantics with a label and value', () => {
    render(<Meter label="Disk usage" value={40} />);
    const el = screen.getByRole('meter', { name: 'Disk usage' });
    expect(el.getAttribute('aria-valuenow')).toBe('40');
    expect(el.getAttribute('aria-valuemin')).toBe('0');
    expect(el.getAttribute('aria-valuemax')).toBe('100');
    expect(el.getAttribute('aria-valuetext')).toBe('40%');
  });

  it('clamps the value and uses min / max', () => {
    render(<Meter label="Score" value={9} min={2} max={6} />);
    const el = screen.getByRole('meter');
    expect(el.getAttribute('aria-valuenow')).toBe('6');
    expect(el.querySelector<HTMLElement>('.var-ui-meter__fill')!.style.width).toBe('100%');
  });

  it('hides the value text on request and honours valueLabel', () => {
    const { rerender } = render(<Meter label="Disk" value={10} valueLabel="10 GB" />);
    expect(screen.getByText('10 GB')).toBeTruthy();
    rerender(<Meter label="Disk" value={10} showValueText={false} />);
    expect(screen.queryByText('10%')).toBeNull();
  });

  it('derives the tone from low / high / optimum unless tone is set', () => {
    const { rerender } = render(<Meter label="Disk" value={90} low={25} high={75} optimum={10} />);
    expect(screen.getByRole('meter').getAttribute('data-tone')).toBe('danger');
    rerender(<Meter label="Disk" value={50} low={25} high={75} optimum={20} />);
    expect(screen.getByRole('meter').getAttribute('data-tone')).toBe('warning');
    rerender(<Meter label="Disk" value={10} low={25} high={75} optimum={20} />);
    expect(screen.getByRole('meter').getAttribute('data-tone')).toBe('success');
    rerender(<Meter label="Disk" value={90} high={75} optimum={20} tone="info" />);
    expect(screen.getByRole('meter').getAttribute('data-tone')).toBe('info');
  });

  it('passes props to the root, merges className and forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Meter label="Disk" value={1} id="m" data-x="1" className="extra" ref={ref} />);
    const el = screen.getByRole('meter');
    expect(el.id).toBe('m');
    expect(el.getAttribute('data-x')).toBe('1');
    expect(el.className).toContain('extra');
    expect(ref.current).toBe(el);
  });
});

describe('getMeterTone', () => {
  it('follows the native meter regions', () => {
    // optimum in the low region
    expect(getMeterTone({ value: 10, low: 30, high: 70, optimum: 0 })).toBe('success');
    expect(getMeterTone({ value: 50, low: 30, high: 70, optimum: 0 })).toBe('warning');
    expect(getMeterTone({ value: 90, low: 30, high: 70, optimum: 0 })).toBe('danger');
    // optimum in the high region (password strength)
    expect(getMeterTone({ value: 10, low: 30, high: 70, optimum: 100 })).toBe('danger');
    expect(getMeterTone({ value: 90, low: 30, high: 70, optimum: 100 })).toBe('success');
    // optimum in the middle: either extreme is only a warning
    expect(getMeterTone({ value: 5, low: 30, high: 70, optimum: 50 })).toBe('warning');
    expect(getMeterTone({ value: 50, low: 30, high: 70, optimum: 50 })).toBe('success');
    // defaults: a single middle region, so always good
    expect(getMeterTone({ value: 50 })).toBe('success');
  });
});
