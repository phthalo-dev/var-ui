import { createRef } from 'react';
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { ProgressCircle } from './ProgressCircle';

describe('ProgressCircle', () => {
  it('exposes progressbar semantics with a name and value', () => {
    render(<ProgressCircle label="Upload" value={40} />);
    const el = screen.getByRole('progressbar', { name: 'Upload' });
    expect(el.getAttribute('aria-valuenow')).toBe('40');
    expect(el.getAttribute('aria-valuemin')).toBe('0');
    expect(el.getAttribute('aria-valuemax')).toBe('100');
    expect(el.getAttribute('aria-valuetext')).toBe('40%');
  });

  it('is indeterminate without a value, or with indeterminate', () => {
    const { rerender } = render(<ProgressCircle label="Loading" />);
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBeNull();
    rerender(<ProgressCircle label="Loading" value={30} indeterminate />);
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBeNull();
    // `indeterminate={false}` cannot invent a value when none was passed.
    rerender(<ProgressCircle label="Loading" indeterminate={false} />);
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBeNull();
  });

  it('honours min, max, valueLabel and formatOptions', () => {
    const { rerender } = render(<ProgressCircle label="Step" value={3} min={0} max={4} />);
    const el = screen.getByRole('progressbar');
    expect(el.getAttribute('aria-valuemax')).toBe('4');
    expect(el.getAttribute('aria-valuetext')).toBe('75%');
    rerender(<ProgressCircle label="Step" value={3} min={0} max={4} valueLabel="Step 3 of 4" />);
    expect(screen.getByRole('progressbar').getAttribute('aria-valuetext')).toBe('Step 3 of 4');
  });

  it('sets the progress custom property as a 0..1 fraction', () => {
    render(<ProgressCircle label="Upload" value={25} />);
    const svg = document.querySelector('svg')!;
    expect(svg.style.getPropertyValue('--var-ui-progress-circle-progress')).toBe('0.25');
  });

  it('renders children (or a render function) inside the ring', () => {
    const { rerender } = render(
      <ProgressCircle label="Upload" value={50}>
        half
      </ProgressCircle>,
    );
    expect(screen.getByText('half')).toBeTruthy();
    rerender(
      <ProgressCircle label="Upload" value={50}>
        {({ valueText }) => `now ${valueText}`}
      </ProgressCircle>,
    );
    expect(screen.getByText('now 50%')).toBeTruthy();
  });

  it('passes props to the root, merges className and forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ProgressCircle label="Upload" value={1} id="p" data-x="1" className="extra" ref={ref} />,
    );
    const el = screen.getByRole('progressbar');
    expect(el.id).toBe('p');
    expect(el.getAttribute('data-x')).toBe('1');
    expect(el.className).toContain('extra');
    expect(el.className).toContain('var-ui-progress-circle');
    expect(ref.current).toBe(el);
  });

  it('exposes the recipe axes', () => {
    render(<ProgressCircle label="Upload" value={1} size="lg" tone="success" />);
    const el = screen.getByRole('progressbar');
    expect(el.getAttribute('data-size')).toBe('lg');
    expect(el.getAttribute('data-tone')).toBe('success');
  });
});
