import { StrictMode, createRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vite-plus/test';
import { fireEvent, render, screen } from '@testing-library/react';
import { Portal } from './Portal';

describe('Portal', () => {
  it('mounts into document.body by default and cleans up', () => {
    const { container, unmount } = render(
      <Portal>
        <p>floating</p>
      </Portal>,
      { wrapper: StrictMode },
    );
    const el = screen.getByText('floating');
    expect(container.contains(el)).toBe(false);
    expect(el.parentElement).toBe(document.body);
    unmount();
    expect(screen.queryByText('floating')).toBeNull();
  });

  it('mounts into an element container', () => {
    const target = document.createElement('div');
    document.body.append(target);
    render(
      <Portal container={target}>
        <p>inside</p>
      </Portal>,
    );
    expect(target.contains(screen.getByText('inside'))).toBe(true);
    target.remove();
  });

  it('mounts into a ref container', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <>
        <div ref={ref} data-testid="host" />
        <Portal container={ref}>
          <p>via ref</p>
        </Portal>
      </>,
    );
    expect(screen.getByTestId('host').contains(screen.getByText('via ref'))).toBe(true);
  });

  it('waits for a ref container that mounts later instead of falling back to body', () => {
    const ref = createRef<HTMLDivElement>();
    function Demo() {
      const [ready, setReady] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setReady(true)}>
            show
          </button>
          {ready ? <div ref={ref} data-testid="host" /> : null}
          <Portal container={ref}>
            <p>banner</p>
          </Portal>
        </>
      );
    }
    render(<Demo />);
    expect(screen.queryByText('banner')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'show' }));
    const banner = screen.getByText('banner');
    expect(screen.getByTestId('host').contains(banner)).toBe(true);
  });

  it('renders nothing on the server', () => {
    expect(
      renderToString(
        <Portal>
          <p>server</p>
        </Portal>,
      ),
    ).toBe('');
  });
});
