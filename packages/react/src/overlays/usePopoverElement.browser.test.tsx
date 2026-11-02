import { render } from '@testing-library/react';
import { StrictMode, useState, type ReactNode } from 'react';
import { userEvent } from 'vite-plus/test/browser';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vite-plus/test';
import { finishAll, raf } from '../test/browser';
import type { OverlayOpenChangeHandler } from './changeEvent';
import { OverlayTrigger } from './OverlayTrigger';
import { isPopoverShowing, usePopoverElement, type PopoverMode } from './usePopoverElement';
import { useOverlayRoot } from './useOverlayRoot';

beforeAll(() => {
  const style = document.createElement('style');
  style.textContent = `
    [popover].t{position:fixed;inset:auto;top:200px;left:20px;width:160px;height:80px;padding:4px;
      border:1px solid #888;background:#fff;overflow:visible}
    [popover].t.fx{opacity:0;transition:opacity 120ms,overlay 120ms allow-discrete,display 120ms allow-discrete}
    [popover].t.fx:popover-open{opacity:1}
    @starting-style{[popover].t.fx:popover-open{opacity:0}}
    [popover].t.inner{top:220px;left:40px;width:100px;height:40px}
  `;
  document.head.append(style);
});

type Props = {
  mode?: PopoverMode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: OverlayOpenChangeHandler;
  /** `false`: the trigger opens with `root.triggerPress` (react-aria style) instead of `popovertarget`. */
  invoker?: boolean;
  fx?: boolean;
  id?: string;
  inner?: boolean;
  children?: ReactNode;
};

function TestPopover({
  mode = 'auto',
  open,
  defaultOpen,
  onOpenChange,
  invoker = true,
  fx = false,
  id = 'a',
  inner = false,
  children,
}: Props) {
  const root = useOverlayRoot({ open, defaultOpen, onOpenChange });
  const pop = usePopoverElement(root, { mode });
  return (
    <>
      <OverlayTrigger root={root} relation={invoker ? 'popovertarget' : undefined} mode="none">
        <button
          data-testid={`trigger-${id}`}
          onClick={invoker ? undefined : root.triggerPress}
          type="button"
        >
          open {id}
        </button>
      </OverlayTrigger>
      <div
        {...pop.props}
        ref={pop.ref}
        data-testid={`popover-${id}`}
        className={`t ${fx ? 'fx' : ''} ${inner ? 'inner' : ''}`}
      >
        {pop.mounted ? (
          <div data-testid={`body-${id}`}>
            <button
              data-testid={`close-${id}`}
              type="button"
              onClick={() => root.close({ reason: 'close-press' })}
            >
              close
            </button>
            <p data-testid={`text-${id}`} style={{ margin: 0 }}>
              text
            </p>
            {children}
          </div>
        ) : null}
      </div>
    </>
  );
}

/** Controlled wrapper that mirrors `onOpenChange` unless told to keep the popover as is. */
function Controlled({
  keep,
  startOpen = true,
  onOpenChange,
  ...rest
}: Props & { keep?: boolean; startOpen?: boolean }) {
  const [open, setOpen] = useState(startOpen);
  return (
    <TestPopover
      {...rest}
      open={open}
      onOpenChange={(next, details) => {
        onOpenChange?.(next, details);
        if (!keep) setOpen(next);
      }}
    />
  );
}

const q = (id: string) => document.querySelector<HTMLElement>(`[data-testid="${id}"]`)!;
const pop = (id = 'a') => q(`popover-${id}`);
const showing = (id = 'a') => isPopoverShowing(pop(id));
const calls = (h: ReturnType<typeof vi.fn<OverlayOpenChangeHandler>>) =>
  h.mock.calls.map(([open, d]) => [open, d.reason]);

/** A point outside every test popover and trigger. */
const clickOutside = () => userEvent.click(document.body, { position: { x: 380, y: 400 } });

afterEach(async () => {
  // Unmount first (RTL cleanup in setup) happens after this; close anything left in the top layer.
  for (const el of document.querySelectorAll('[popover]:popover-open')) {
    (el as HTMLElement).hidePopover();
  }
});

describe('open sync', () => {
  test('defaultOpen shows a real popover in the top layer and mounts the body', async () => {
    render(<TestPopover defaultOpen />);
    await raf();
    expect(showing()).toBe(true);
    expect(q('body-a')).toBeTruthy();
  });

  test('closed: no body; invoker click opens (trigger-press) and toggles closed (trigger-press)', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestPopover onOpenChange={onOpenChange} />);
    expect(showing()).toBe(false);
    expect(q('body-a')).toBeNull();
    expect(q('trigger-a').getAttribute('popovertarget')).toBe(pop().id);
    await userEvent.click(q('trigger-a'));
    await raf();
    expect(showing()).toBe(true);
    expect(q('body-a')).toBeTruthy();
    expect(q('trigger-a').getAttribute('aria-expanded')).toBeNull();
    await userEvent.click(q('trigger-a'));
    await raf();
    expect(showing()).toBe(false);
    expect(q('body-a')).toBeNull();
    expect(calls(onOpenChange)).toEqual([
      [true, 'trigger-press'],
      [false, 'trigger-press'],
    ]);
    expect(onOpenChange.mock.calls[0]![1].event?.type).toBe('beforetoggle');
  });

  test('controlled open follows the prop both ways without reporting', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    const { rerender } = render(<TestPopover open={false} onOpenChange={onOpenChange} />);
    rerender(<TestPopover open onOpenChange={onOpenChange} />);
    await raf();
    expect(showing()).toBe(true);
    rerender(<TestPopover open={false} onOpenChange={onOpenChange} />);
    await raf();
    expect(showing()).toBe(false);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  test('StrictMode double effects leave one open popover and report nothing', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(
      <StrictMode>
        <TestPopover defaultOpen onOpenChange={onOpenChange} />
      </StrictMode>,
    );
    await raf();
    expect(showing()).toBe(true);
    expect(document.querySelectorAll('[popover]:popover-open')).toHaveLength(1);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  test('children stay mounted through the CSS exit and unmount when it ends', async () => {
    render(<TestPopover defaultOpen fx />);
    await raf();
    await finishAll(pop());
    await userEvent.click(q('trigger-a'));
    await raf();
    expect(showing()).toBe(false);
    expect(q('body-a')).toBeTruthy(); // exiting
    await finishAll(pop());
    await raf();
    expect(q('body-a')).toBeNull();
  });
});

describe('reasons (auto)', () => {
  test('Escape -> escape-key, once, with the keydown as event', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestPopover defaultOpen onOpenChange={onOpenChange} />);
    await raf();
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(calls(onOpenChange)).toEqual([[false, 'escape-key']]);
    expect(onOpenChange.mock.calls[0]![1].event?.type).toBe('keydown');
    expect(showing()).toBe(false);
  });

  test('outside click -> outside-press, once', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestPopover defaultOpen onOpenChange={onOpenChange} />);
    await raf();
    await clickOutside();
    await raf();
    expect(calls(onOpenChange)).toEqual([[false, 'outside-press']]);
    expect(onOpenChange.mock.calls[0]![1].event?.type).toBe('pointerdown');
    expect(showing()).toBe(false);
  });

  test('close button -> close-press once (no second report from the native hide)', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestPopover defaultOpen onOpenChange={onOpenChange} />);
    await raf();
    await userEvent.click(q('close-a'));
    await raf();
    expect(calls(onOpenChange)).toEqual([[false, 'close-press']]);
    expect(showing()).toBe(false);
  });

  test('a popovertargetaction=hide invoker inside the popup -> close-press', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(
      <TestPopover defaultOpen onOpenChange={onOpenChange}>
        <button type="button" data-testid="hide" popoverTarget="p-hide" popoverTargetAction="hide">
          hide
        </button>
      </TestPopover>,
    );
    await raf();
    q('hide').setAttribute('popovertarget', pop().id);
    await userEvent.click(q('hide'));
    await raf();
    expect(calls(onOpenChange)).toEqual([[false, 'close-press']]);
  });

  test('hidePopover() from outside our code -> imperative, and state follows', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestPopover defaultOpen onOpenChange={onOpenChange} />);
    await raf();
    pop().hidePopover();
    await raf();
    expect(calls(onOpenChange)).toEqual([[false, 'imperative']]);
    expect(q('body-a')).toBeNull();
  });

  test('showPopover() from outside our code -> imperative open', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestPopover onOpenChange={onOpenChange} />);
    pop().showPopover();
    await raf();
    expect(calls(onOpenChange)).toEqual([[true, 'imperative']]);
    expect(q('body-a')).toBeTruthy();
    expect(showing()).toBe(true);
  });

  test('another auto popover opening light-dismisses this one (no gesture -> imperative)', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(
      <>
        <TestPopover defaultOpen onOpenChange={onOpenChange} id="a" />
        <TestPopover id="b" />
      </>,
    );
    await raf();
    pop('b').showPopover();
    await raf();
    expect(calls(onOpenChange)).toEqual([[false, 'imperative']]);
    expect(showing('a')).toBe(false);
    expect(showing('b')).toBe(true);
  });
});

describe('details.cancel()', () => {
  test('veto of open (invoker click): never shows, one report', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>((_, d) => d.cancel());
    render(<TestPopover onOpenChange={onOpenChange} />);
    await userEvent.click(q('trigger-a'));
    await raf();
    expect(showing()).toBe(false);
    expect(q('body-a')).toBeNull();
    expect(calls(onOpenChange)).toEqual([[true, 'trigger-press']]);
  });

  test('controlled parent that does not follow an open request: refused', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<Controlled startOpen={false} keep onOpenChange={onOpenChange} />);
    await userEvent.click(q('trigger-a'));
    await raf();
    expect(showing()).toBe(false);
    expect(calls(onOpenChange)).toEqual([[true, 'trigger-press']]);
  });

  test('veto of Escape: popover is re-shown (blink), children never unmounted, one report', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>((_, d) => d.cancel());
    render(<TestPopover defaultOpen onOpenChange={onOpenChange} />);
    await raf();
    const body = q('body-a');
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(calls(onOpenChange)).toEqual([[false, 'escape-key']]);
    expect(showing()).toBe(true);
    expect(q('body-a')).toBe(body);
  });

  test('controlled open=true kept by the consumer re-shows after an outside click', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<Controlled keep onOpenChange={onOpenChange} />);
    await raf();
    await clickOutside();
    await raf();
    expect(calls(onOpenChange)).toEqual([[false, 'outside-press']]);
    expect(showing()).toBe(true);
    // and it can still be dismissed once the consumer follows
  });

  test('accepted close in controlled mode is not re-shown', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<Controlled onOpenChange={onOpenChange} />);
    await raf();
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(showing()).toBe(false);
    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });
});

describe('manual mode', () => {
  test('trigger click opens via triggerPress; outside press and Escape dismiss with reasons', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestPopover mode="manual" invoker={false} onOpenChange={onOpenChange} />);
    await userEvent.click(q('trigger-a'));
    await raf();
    expect(showing()).toBe(true);
    // The trigger itself is not "outside": a second click toggles through triggerPress only.
    await userEvent.click(q('trigger-a'));
    await raf();
    expect(showing()).toBe(false);
    await userEvent.click(q('trigger-a'));
    await raf();
    await clickOutside();
    await raf();
    expect(showing()).toBe(false);
    await userEvent.click(q('trigger-a'));
    await raf();
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(showing()).toBe(false);
    expect(calls(onOpenChange)).toEqual([
      [true, 'trigger-press'],
      [false, 'trigger-press'],
      [true, 'trigger-press'],
      [false, 'outside-press'],
      [true, 'trigger-press'],
      [false, 'escape-key'],
    ]);
  });

  test('a press inside the popup does not dismiss; manual ignores native light dismiss', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestPopover mode="manual" defaultOpen invoker={false} onOpenChange={onOpenChange} />);
    await raf();
    await userEvent.click(q('body-a'));
    await raf();
    expect(showing()).toBe(true);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  test('veto of a manual outside press keeps it open with a single report', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>((_, d) => d.cancel());
    render(<TestPopover mode="manual" defaultOpen invoker={false} onOpenChange={onOpenChange} />);
    await raf();
    await clickOutside();
    await raf();
    expect(showing()).toBe(true);
    expect(calls(onOpenChange)).toEqual([[false, 'outside-press']]);
  });

  test('imperative setOpen from the consumer (controlled) hides without a report', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    const { rerender } = render(
      <TestPopover mode="manual" open invoker={false} onOpenChange={onOpenChange} />,
    );
    await raf();
    rerender(
      <TestPopover mode="manual" open={false} invoker={false} onOpenChange={onOpenChange} />,
    );
    await raf();
    expect(showing()).toBe(false);
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});

describe('nesting', () => {
  function Nested({ mode }: { mode: PopoverMode }) {
    return (
      <TestPopover
        mode={mode}
        invoker={mode !== 'manual'}
        defaultOpen
        id="a"
        onOpenChange={nestedParent}
      >
        <TestPopover
          mode={mode}
          invoker={mode !== 'manual'}
          id="b"
          inner
          onOpenChange={nestedChild}
        />
      </TestPopover>
    );
  }
  const nestedParent = vi.fn<OverlayOpenChangeHandler>();
  const nestedChild = vi.fn<OverlayOpenChangeHandler>();

  for (const mode of ['auto', 'manual'] as const) {
    test(`${mode}: opening and using a nested popover does not dismiss the parent; Escape closes the child first`, async () => {
      nestedParent.mockClear();
      nestedChild.mockClear();
      render(<Nested mode={mode} />);
      await raf();
      await userEvent.click(q('trigger-b'));
      await raf();
      expect(showing('b')).toBe(true);
      expect(showing('a')).toBe(true);
      await userEvent.click(q('text-b'));
      await raf();
      expect(showing('a')).toBe(true);
      expect(nestedParent).not.toHaveBeenCalled();
      await userEvent.keyboard('{Escape}');
      await raf();
      expect(showing('b')).toBe(false);
      expect(showing('a')).toBe(true);
      expect(calls(nestedChild).slice(-1)[0]).toEqual([false, 'escape-key']);
      expect(nestedParent).not.toHaveBeenCalled();
      await userEvent.keyboard('{Escape}');
      await raf();
      expect(showing('a')).toBe(false);
      expect(calls(nestedParent)).toEqual([[false, 'escape-key']]);
    });
  }
});

describe('inside a modal <dialog>', () => {
  function InDialog({
    mode,
    onOpenChange,
  }: {
    mode: PopoverMode;
    onOpenChange: OverlayOpenChangeHandler;
  }) {
    return (
      <dialog data-testid="dlg" style={{ width: 300, height: 400, padding: 0 }}>
        <TestPopover mode={mode} invoker={mode !== 'manual'} onOpenChange={onOpenChange} />
      </dialog>
    );
  }

  for (const mode of ['auto', 'manual'] as const) {
    test(`${mode}: opens above the modal, is hit-testable, and Escape closes only the popover first`, async () => {
      const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
      render(<InDialog mode={mode} onOpenChange={onOpenChange} />);
      const dialog = q('dlg') as HTMLDialogElement;
      dialog.showModal();
      await raf();
      await userEvent.click(q('trigger-a'));
      await raf();
      expect(showing()).toBe(true);
      const rect = pop().getBoundingClientRect();
      expect(document.elementFromPoint(rect.x + 8, rect.y + rect.height - 8)).toBe(pop());
      await userEvent.keyboard('{Escape}');
      await raf();
      expect(showing()).toBe(false);
      expect(dialog.open).toBe(true);
      expect(calls(onOpenChange).slice(-1)[0]).toEqual([false, 'escape-key']);
      await userEvent.keyboard('{Escape}');
      await raf();
      expect(dialog.open).toBe(false);
    });
  }
});
