import { StrictMode, useRef } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { fireEvent, render, screen } from '@testing-library/react';
import { useClickOutside, type UseClickOutsideOptions } from './useClickOutside';

function Fixture({
  handler,
  options,
}: {
  handler: (event: Event) => void;
  options?: UseClickOutsideOptions;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const other = useRef<HTMLDivElement>(null);
  useClickOutside([ref, other], handler, options);
  return (
    <>
      <div ref={ref} data-testid="panel">
        <button type="button">inside</button>
      </div>
      <div ref={other} data-testid="other" />
      <button type="button">outside</button>
    </>
  );
}

describe('useClickOutside', () => {
  it('fires for pointerdown outside and ignores inside, in any listed ref', () => {
    const handler = vi.fn();
    render(<Fixture handler={handler} />, { wrapper: StrictMode });
    fireEvent.pointerDown(screen.getByText('inside'));
    fireEvent.pointerDown(screen.getByTestId('other'));
    expect(handler).not.toHaveBeenCalled();
    fireEvent.pointerDown(screen.getByText('outside'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('fires in the capture phase even if propagation is stopped', () => {
    const handler = vi.fn();
    render(<Fixture handler={handler} />);
    const outside = screen.getByText('outside');
    outside.addEventListener('pointerdown', (e) => e.stopPropagation());
    fireEvent.pointerDown(outside);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('uses the configured events and honours enabled', () => {
    const handler = vi.fn();
    const { rerender } = render(<Fixture handler={handler} options={{ events: ['click'] }} />);
    fireEvent.pointerDown(screen.getByText('outside'));
    expect(handler).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('outside'));
    expect(handler).toHaveBeenCalledTimes(1);
    rerender(<Fixture handler={handler} options={{ events: ['click'], enabled: false }} />);
    fireEvent.click(screen.getByText('outside'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('removes its listener on unmount', () => {
    const handler = vi.fn();
    const { unmount } = render(<Fixture handler={handler} />);
    unmount();
    fireEvent.pointerDown(document.body);
    expect(handler).not.toHaveBeenCalled();
  });
});
