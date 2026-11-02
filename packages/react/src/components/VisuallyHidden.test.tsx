import { createRef } from 'react';
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { VisuallyHidden } from './VisuallyHidden';

describe('VisuallyHidden', () => {
  it('renders a span with the visually-hidden class merged with className', () => {
    render(<VisuallyHidden className="extra">Delete project</VisuallyHidden>);
    const el = screen.getByText('Delete project');
    expect(el.tagName).toBe('SPAN');
    expect(el.className).toContain('visually-hidden');
    expect(el.classList.contains('extra')).toBe(true);
  });

  it('forwards ref and native attributes', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <VisuallyHidden ref={ref} id="x" data-testid="t" aria-live="polite">
        Saved
      </VisuallyHidden>,
    );
    expect(ref.current).toBe(screen.getByTestId('t'));
    expect(ref.current?.id).toBe('x');
    expect(ref.current?.getAttribute('aria-live')).toBe('polite');
  });
});
