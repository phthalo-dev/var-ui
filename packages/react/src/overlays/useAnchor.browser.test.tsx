import { render } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, beforeAll, describe, expect, test } from 'vite-plus/test';
import { raf } from '../test/browser';
import { useAnchor, useVirtualAnchor, type AnchorPlacement } from './useAnchor';
import { useOverlayRoot } from './useOverlayRoot';
import { usePopoverElement } from './usePopoverElement';

// Stand-in for the core `anchored` mixin (which consumes the same hooks): position-area from
// data-placement, margin from the offset variable.
beforeAll(() => {
  const style = document.createElement('style');
  style.textContent = `
    [popover].a{position:fixed;inset:auto;margin:var(--var-ui-popup-offset,0px);width:80px;height:40px;
      padding:0;border:0;background:#ccc;overflow:visible}
    [popover].a[data-placement~="bottom"]{position-area:block-end}
    [popover].a[data-placement~="top"]{position-area:block-start}
    [popover].a[data-placement~="start"]{position-area:inline-start}
    [popover].a[data-placement~="end"]{position-area:inline-end}
  `;
  document.head.append(style);
});

const q = (id: string) => document.querySelector<HTMLElement>(`[data-testid="${id}"]`)!;

function Anchored({
  placement,
  offset,
  id = 'a',
  top = 200,
  left = 150,
}: {
  placement?: AnchorPlacement;
  offset?: number | string;
  id?: string;
  top?: number;
  left?: number;
}) {
  const root = useOverlayRoot({ defaultOpen: true });
  const pop = usePopoverElement(root, { mode: 'manual' });
  const anchor = useAnchor(root.triggerEl, root.popupEl, { placement, offset });
  return (
    <>
      <button
        ref={root.setTriggerEl}
        data-testid={`trigger-${id}`}
        data-anchor={anchor.name}
        style={{ position: 'absolute', top, left, width: 100, height: 30 }}
      >
        t
      </button>
      <div {...pop.props} ref={pop.ref} data-testid={`popup-${id}`} className="a" />
    </>
  );
}

function Toggle() {
  const [on, setOn] = useState(true);
  return (
    <>
      <button data-testid="toggle" onClick={() => setOn((v) => !v)} />
      {on ? <Anchored /> : null}
    </>
  );
}

afterEach(() => {
  document.documentElement.removeAttribute('dir');
});

describe('wiring', () => {
  test('explicit anchor-name on the trigger and matching position-anchor on the popup', async () => {
    render(<Anchored />);
    await raf();
    const name = q('trigger-a').dataset.anchor!;
    expect(name).toMatch(/^--var-ui-[a-zA-Z0-9_-]+$/);
    expect(q('trigger-a').style.getPropertyValue('anchor-name')).toBe(name);
    expect(q('popup-a').style.getPropertyValue('position-anchor')).toBe(name);
  });

  test('every root gets its own name', async () => {
    render(
      <>
        <Anchored id="a" />
        <Anchored id="b" top={300} />
      </>,
    );
    await raf();
    expect(q('trigger-a').dataset.anchor).not.toBe(q('trigger-b').dataset.anchor);
    expect(q('popup-b').style.getPropertyValue('position-anchor')).toBe(
      q('trigger-b').dataset.anchor,
    );
  });

  test('data-placement is the requested placement and tracks changes; default is bottom', async () => {
    const { rerender } = render(<Anchored />);
    await raf();
    expect(q('popup-a').getAttribute('data-placement')).toBe('bottom');
    rerender(<Anchored placement="top end" />);
    await raf();
    expect(q('popup-a').getAttribute('data-placement')).toBe('top end');
  });

  test('offset is written as --var-ui-popup-offset (number -> px, string as is) and removed when unset', async () => {
    const { rerender } = render(<Anchored offset={12} />);
    await raf();
    expect(q('popup-a').style.getPropertyValue('--var-ui-popup-offset')).toBe('12px');
    rerender(<Anchored offset="var(--space-2)" />);
    await raf();
    expect(q('popup-a').style.getPropertyValue('--var-ui-popup-offset')).toBe('var(--space-2)');
    rerender(<Anchored />);
    await raf();
    expect(q('popup-a').style.getPropertyValue('--var-ui-popup-offset')).toBe('');
  });

  test('unmounting leaves no anchor properties behind on the (still mounted) trigger', async () => {
    const trigger = document.createElement('button');
    document.body.append(trigger);
    function Probe({ on }: { on: boolean }) {
      const [popup, setPopup] = useState<HTMLElement | null>(null);
      useAnchor(on ? trigger : null, on ? popup : null, { placement: 'start', offset: 4 });
      return <div ref={setPopup} />;
    }
    const { rerender, container } = render(<Probe on />);
    await raf();
    expect(trigger.style.getPropertyValue('anchor-name')).toMatch(/^--var-ui-/);
    const popup = container.firstElementChild as HTMLElement;
    expect(popup.getAttribute('data-placement')).toBe('start');
    rerender(<Probe on={false} />);
    await raf();
    expect(trigger.style.getPropertyValue('anchor-name')).toBe('');
    expect(popup.hasAttribute('data-placement')).toBe(false);
    expect(popup.style.getPropertyValue('position-anchor')).toBe('');
    expect(popup.style.getPropertyValue('--var-ui-popup-offset')).toBe('');
    trigger.remove();
  });

  test('toggling the whole component mounts and unmounts cleanly', async () => {
    render(<Toggle />);
    await raf();
    q('toggle').click();
    await raf();
    expect(document.querySelector('[data-testid="popup-a"]')).toBeNull();
    q('toggle').click();
    await raf();
    expect(q('popup-a').style.getPropertyValue('position-anchor')).toMatch(/^--var-ui-/);
  });
});

describe('positioning with the real engine', () => {
  const rect = (id: string) => ({
    trigger: q(`trigger-${id}`).getBoundingClientRect(),
    popup: q(`popup-${id}`).getBoundingClientRect(),
  });

  test('bottom: below the trigger, offset applies', async () => {
    render(<Anchored placement="bottom" offset={10} />);
    await raf();
    const { trigger, popup } = rect('a');
    expect(popup.top).toBeCloseTo(trigger.bottom + 10, 0);
  });

  test('top: above the trigger', async () => {
    render(<Anchored placement="top" />);
    await raf();
    const { trigger, popup } = rect('a');
    expect(popup.bottom).toBeCloseTo(trigger.top, 0);
  });

  test('start/end are logical: they swap in RTL', async () => {
    const { rerender } = render(<Anchored placement="end" />);
    await raf();
    let r = rect('a');
    expect(r.popup.left).toBeCloseTo(r.trigger.right, 0);
    document.documentElement.setAttribute('dir', 'rtl');
    rerender(<Anchored placement="end" id="a" />);
    await raf();
    r = rect('a');
    expect(r.popup.right).toBeCloseTo(r.trigger.left, 0);
  });
});

describe('useVirtualAnchor', () => {
  function Context() {
    const root = useOverlayRoot({ defaultOpen: true });
    const pop = usePopoverElement(root, { mode: 'manual' });
    const point = useVirtualAnchor();
    useAnchor(point.element, root.popupEl, { placement: 'bottom' });
    return (
      <>
        <span {...point.props} data-testid="point" />
        <button data-testid="move" onClick={() => point.moveTo(220, 300)} />
        <div {...pop.props} ref={pop.ref} data-testid="popup-ctx" className="a" />
      </>
    );
  }

  test('a 1px element moved to pointer coordinates anchors the popup there', async () => {
    render(<Context />);
    await raf();
    q('move').click();
    await raf();
    expect(q('point').style.getPropertyValue('anchor-name')).toMatch(/^--var-ui-/);
    const popup = q('popup-ctx').getBoundingClientRect();
    expect(popup.top).toBeCloseTo(301, 0);
    expect(popup.left + popup.width / 2).toBeGreaterThan(200);
  });
});
