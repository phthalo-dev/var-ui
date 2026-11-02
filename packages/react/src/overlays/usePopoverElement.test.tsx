import { act, render, screen } from '@testing-library/react';
import { StrictMode } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { stubNativePopover } from '../test/nativeOverlayStubs';
import type { OverlayOpenChangeHandler } from './changeEvent';
import { OverlayTrigger } from './OverlayTrigger';
import { usePopoverElement, type PopoverMode } from './usePopoverElement';
import { useOverlayRoot } from './useOverlayRoot';
import { useAnchor } from './useAnchor';

const { fire } = stubNativePopover();

type Props = {
  mode?: PopoverMode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: OverlayOpenChangeHandler;
};
function TestPopover({ mode, open, defaultOpen, onOpenChange }: Props) {
  const root = useOverlayRoot({ open, defaultOpen, onOpenChange });
  const pop = usePopoverElement(root, { mode });
  useAnchor(root.triggerEl, root.popupEl, { placement: 'top end', offset: 6 });
  return (
    <>
      <OverlayTrigger root={root} relation="popovertarget">
        <button type="button">trigger</button>
      </OverlayTrigger>
      <div {...pop.props} ref={pop.ref} data-testid="pop">
        {pop.mounted ? (
          <button onClick={() => root.close({ reason: 'close-press' })}>x</button>
        ) : null}
      </div>
    </>
  );
}

const pop = () => screen.getByTestId('pop');
const isOpen = () => pop().hasAttribute('data-popover-open');
const calls = (h: ReturnType<typeof vi.fn<OverlayOpenChangeHandler>>) =>
  h.mock.calls.map(([open, d]) => [open, d.reason]);

describe('usePopoverElement (jsdom, stubbed popover API)', () => {
  it('spreads the popover attribute and the root id; the trigger references it', () => {
    render(<TestPopover mode="manual" />);
    expect(pop().getAttribute('popover')).toBe('manual');
    expect(pop().id).not.toBe('');
    const trigger = screen.getByRole('button', { name: 'trigger' });
    expect(trigger.getAttribute('popovertarget')).toBe(pop().id);
    expect(trigger.getAttribute('popovertargetaction')).toBe('toggle');
    expect(pop().getAttribute('data-placement')).toBe('top end');
    expect(pop().style.getPropertyValue('--var-ui-popup-offset')).toBe('6px');
  });

  it('defaults to auto', () => {
    render(<TestPopover />);
    expect(pop().getAttribute('popover')).toBe('auto');
  });

  it('syncs open both ways and mounts the body only while open', () => {
    const { rerender } = render(<TestPopover open={false} />);
    expect(isOpen()).toBe(false);
    expect(screen.queryByRole('button', { name: 'x' })).toBeNull();
    rerender(<TestPopover open />);
    expect(isOpen()).toBe(true);
    expect(screen.getByRole('button', { name: 'x' })).toBeTruthy();
    rerender(<TestPopover open={false} />);
    expect(isOpen()).toBe(false);
    expect(screen.queryByRole('button', { name: 'x' })).toBeNull();
  });

  it('StrictMode: shown once, nothing reported', () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(
      <StrictMode>
        <TestPopover defaultOpen onOpenChange={onOpenChange} />
      </StrictMode>,
    );
    expect(isOpen()).toBe(true);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('a native close reports once with reason imperative when no gesture was seen', () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestPopover defaultOpen onOpenChange={onOpenChange} />);
    act(() => fire(pop(), 'closed'));
    expect(calls(onOpenChange)).toEqual([[false, 'imperative']]);
    expect(isOpen()).toBe(false);
  });

  it('an invoker source maps to trigger-press and close-press when inside the popup', () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestPopover onOpenChange={onOpenChange} />);
    const trigger = screen.getByRole('button', { name: 'trigger' });
    act(() => fire(pop(), 'open', trigger));
    expect(calls(onOpenChange)).toEqual([[true, 'trigger-press']]);
    act(() => fire(pop(), 'closed', screen.getByRole('button', { name: 'x' })));
    expect(calls(onOpenChange)).toEqual([
      [true, 'trigger-press'],
      [false, 'close-press'],
    ]);
  });

  it('Escape and pointerdown shortly before a native close give their reasons', () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestPopover defaultOpen onOpenChange={onOpenChange} />);
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      fire(pop(), 'closed');
    });
    expect(calls(onOpenChange)).toEqual([[false, 'escape-key']]);
  });

  it('details.cancel() vetoes an open request (beforetoggle is prevented)', () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>((_, d) => d.cancel());
    render(<TestPopover onOpenChange={onOpenChange} />);
    act(() => fire(pop(), 'open'));
    expect(isOpen()).toBe(false);
    expect(calls(onOpenChange)).toEqual([[true, 'imperative']]);
  });

  it('a close the consumer refuses is shown again', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>((_, d) => d.cancel());
    render(<TestPopover defaultOpen onOpenChange={onOpenChange} />);
    await act(async () => {
      fire(pop(), 'closed');
      await Promise.resolve();
    });
    expect(isOpen()).toBe(true);
    expect(calls(onOpenChange)).toEqual([[false, 'imperative']]);
  });

  it('manual: Escape and outside pointerdown dismiss, inside and the trigger do not', () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestPopover mode="manual" defaultOpen onOpenChange={onOpenChange} />);
    const down = (target: Element) =>
      target.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, cancelable: true }));
    act(() => void down(screen.getByRole('button', { name: 'x' })));
    act(() => void down(screen.getByRole('button', { name: 'trigger' })));
    expect(onOpenChange).not.toHaveBeenCalled();
    act(() => void down(document.body));
    expect(calls(onOpenChange)).toEqual([[false, 'outside-press']]);
    expect(isOpen()).toBe(false);
  });

  it('manual: Escape dismisses and the keydown is default-prevented', () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    render(<TestPopover mode="manual" defaultOpen onOpenChange={onOpenChange} />);
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    act(() => void document.dispatchEvent(event));
    expect(calls(onOpenChange)).toEqual([[false, 'escape-key']]);
    expect(event.defaultPrevented).toBe(true);
  });
});
