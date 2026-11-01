import { act, render, renderHook, screen } from '@testing-library/react';
import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import type { OverlayOpenChangeHandler } from './changeEvent';
import { useDialogElement, type UseDialogElementOptions } from './useDialogElement';
import { useMountedWhileAnimating } from './useMountedWhileAnimating';
import { useOverlayRoot } from './useOverlayRoot';

// jsdom has no top layer: stub the dialog methods with their observable effects.
const proto = HTMLDialogElement.prototype;
let showModal: ReturnType<typeof vi.fn>;
beforeEach(() => {
  showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  Object.assign(proto, {
    showModal,
    close(this: HTMLDialogElement) {
      if (!this.open) return;
      this.removeAttribute('open');
      queueMicrotask(() => this.dispatchEvent(new Event('close')));
    },
  });
});
afterEach(() => {
  Reflect.deleteProperty(proto, 'showModal');
  Reflect.deleteProperty(proto, 'close');
});

type Props = UseDialogElementOptions & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: OverlayOpenChangeHandler;
};
function TestDialog({ open, defaultOpen, onOpenChange, dismissable }: Props) {
  const root = useOverlayRoot({ open, defaultOpen, onOpenChange });
  const dialog = useDialogElement(root, { dismissable });
  return (
    <>
      <button onClick={root.triggerPress}>trigger</button>
      <dialog ref={dialog.ref} data-testid="dialog">
        {dialog.mounted ? (
          <button onClick={() => root.close({ reason: 'close-press' })}>x</button>
        ) : null}
      </dialog>
    </>
  );
}
const getDialog = () => screen.getByTestId('dialog') as HTMLDialogElement;
const reasons = (h: ReturnType<typeof vi.fn<OverlayOpenChangeHandler>>) =>
  h.mock.calls.map(([open, d]) => [open, d.reason]);

describe('useDialogElement', () => {
  it('shows the modal for defaultOpen and mounts children only while open', () => {
    render(<TestDialog defaultOpen />);
    expect(getDialog().open).toBe(true);
    expect(screen.getByText('x')).toBeTruthy();
  });

  it('stays closed and childless by default; the trigger opens with trigger-press', () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestDialog onOpenChange={onOpenChange} />);
    expect(getDialog().open).toBe(false);
    expect(screen.queryByText('x')).toBeNull();
    act(() => screen.getByText('trigger').click());
    expect(getDialog().open).toBe(true);
    expect(reasons(onOpenChange)).toEqual([[true, 'trigger-press']]);
  });

  it('follows controlled open and closes with imperative semantics (no report)', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    const { rerender } = render(<TestDialog open={false} onOpenChange={onOpenChange} />);
    rerender(<TestDialog open onOpenChange={onOpenChange} />);
    expect(getDialog().open).toBe(true);
    rerender(<TestDialog open={false} onOpenChange={onOpenChange} />);
    expect(getDialog().open).toBe(false);
    await act(async () => {});
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('cancel without a keydown is imperative; with Escape it is escape-key', () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestDialog defaultOpen onOpenChange={onOpenChange} />);
    const cancel = () => new Event('cancel', { cancelable: true });
    const first = cancel();
    act(() => void getDialog().dispatchEvent(first));
    expect(first.defaultPrevented).toBe(true);
    expect(reasons(onOpenChange)).toEqual([[false, 'imperative']]);
    expect(getDialog().open).toBe(false);

    onOpenChange.mockClear();
    act(() => screen.getByText('trigger').click());
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      getDialog().dispatchEvent(cancel());
    });
    expect(reasons(onOpenChange)[reasons(onOpenChange).length - 1]).toEqual([false, 'escape-key']);
  });

  it('details.cancel() keeps the dialog open', () => {
    render(<TestDialog defaultOpen onOpenChange={(_o, d) => d.cancel()} />);
    act(() => void getDialog().dispatchEvent(new Event('cancel', { cancelable: true })));
    expect(getDialog().open).toBe(true);
  });

  it('backdrop press (pointerdown and click on the dialog) is outside-press when dismissable', () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestDialog defaultOpen onOpenChange={onOpenChange} />);
    const dialog = getDialog();
    act(() => {
      dialog.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
      dialog.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(reasons(onOpenChange)).toEqual([[false, 'outside-press']]);
  });

  it('ignores a click without a backdrop pointerdown, a content press and a non-dismissable dialog', () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    const { rerender } = render(<TestDialog defaultOpen onOpenChange={onOpenChange} />);
    const dialog = getDialog();
    act(() => void dialog.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    const inner = screen.getByText('x');
    act(() => {
      inner.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
      dialog.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    rerender(<TestDialog defaultOpen dismissable={false} onOpenChange={onOpenChange} />);
    act(() => {
      dialog.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
      dialog.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('an accepted non-cancelable cancel does not re-show the dialog', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestDialog defaultOpen onOpenChange={onOpenChange} />);
    showModal.mockClear();
    act(() => void getDialog().dispatchEvent(new Event('cancel', { cancelable: false })));
    await act(async () => {});
    expect(reasons(onOpenChange)).toEqual([[false, 'imperative']]);
    expect(getDialog().open).toBe(false);
    expect(showModal).not.toHaveBeenCalled();
  });

  it('a vetoed non-cancelable cancel re-shows after the browser closes the dialog', async () => {
    render(<TestDialog defaultOpen onOpenChange={(_open, details) => details.cancel()} />);
    showModal.mockClear();
    const dialog = getDialog();
    act(() => {
      dialog.dispatchEvent(new Event('cancel', { cancelable: false }));
      dialog.close();
    });
    await act(async () => {});
    expect(dialog.open).toBe(true);
    expect(showModal).toHaveBeenCalled();
  });

  it('dedupes: two cancels in a row report once', () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestDialog defaultOpen onOpenChange={onOpenChange} />);
    act(() => void getDialog().dispatchEvent(new Event('cancel', { cancelable: true })));
    act(() => void getDialog().dispatchEvent(new Event('cancel', { cancelable: true })));
    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });

  it('is safe under StrictMode (one showModal, still open)', () => {
    render(
      <StrictMode>
        <TestDialog defaultOpen />
      </StrictMode>,
    );
    expect(getDialog().open).toBe(true);
    expect(showModal).toHaveBeenCalledTimes(1);
  });
});

describe('useMountedWhileAnimating', () => {
  const fakeAnimation = () => {
    let finish!: () => void;
    const finished = new Promise<void>((resolve) => (finish = resolve));
    return { animation: { playState: 'running', finished } as unknown as Animation, finish };
  };

  it('is true while open and false right after close when nothing animates', () => {
    const ref = { current: document.createElement('div') };
    const { result, rerender } = renderHook(({ open }) => useMountedWhileAnimating(ref, open), {
      initialProps: { open: true },
    });
    expect(result.current).toBe(true);
    rerender({ open: false });
    expect(result.current).toBe(false);
  });

  it('stays true until the shell animations finish', async () => {
    const el = document.createElement('div');
    const { animation, finish } = fakeAnimation();
    el.getAnimations = () => [animation];
    const ref = { current: el };
    const { result, rerender } = renderHook(({ open }) => useMountedWhileAnimating(ref, open), {
      initialProps: { open: true },
    });
    rerender({ open: false });
    expect(result.current).toBe(true);
    (animation as { playState: string }).playState = 'finished';
    await act(async () => finish());
    expect(result.current).toBe(false);
  });

  it('keeps children mounted on the close render, then drops them when nothing animates', () => {
    const ref = { current: document.createElement('div') };
    const seen: boolean[] = [];
    function Probe({ open }: { open: boolean }) {
      seen.push(useMountedWhileAnimating(ref, open));
      return null;
    }
    const { rerender } = render(<Probe open />);
    seen.length = 0;
    rerender(<Probe open={false} />);
    expect(seen[0]).toBe(true);
    expect(seen[seen.length - 1]).toBe(false);
  });

  it('ignores an infinite descendant animation when deciding the exit is over', async () => {
    const el = document.createElement('div');
    const finished = new Promise<Animation>(() => {});
    el.getAnimations = () =>
      [
        {
          playState: 'running',
          pending: false,
          finished,
          effect: { getComputedTiming: () => ({ iterations: Infinity }) },
        },
      ] as unknown as Animation[];
    const ref = { current: el };
    const { result, rerender } = renderHook(({ open }) => useMountedWhileAnimating(ref, open), {
      initialProps: { open: true },
    });
    rerender({ open: false });
    expect(result.current).toBe(false);
  });

  it('reopening during the exit cancels the unmount', async () => {
    const el = document.createElement('div');
    const { animation, finish } = fakeAnimation();
    el.getAnimations = () => [animation];
    const ref = { current: el };
    const { result, rerender } = renderHook(({ open }) => useMountedWhileAnimating(ref, open), {
      initialProps: { open: true },
    });
    rerender({ open: false });
    rerender({ open: true });
    (animation as { playState: string }).playState = 'finished';
    await act(async () => finish());
    expect(result.current).toBe(true);
  });
});
