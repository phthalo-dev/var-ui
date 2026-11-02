import { render } from '@testing-library/react';
import { StrictMode, useState } from 'react';
import { cdp, userEvent } from 'vite-plus/test/browser';
import { afterEach, describe, expect, test } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { raf } from '../test/browser';
import { Splitter } from './Splitter';

afterEach(() => window.localStorage.clear());

function Wrap({ children, dir }: { children: React.ReactNode; dir?: 'rtl' }) {
  return (
    <StrictMode>
      <DesignSystemProvider applyToDocument>
        <div dir={dir} style={{ width: 600, height: 300 }}>
          {children}
        </div>
      </DesignSystemProvider>
    </StrictMode>
  );
}

const seps = (c: HTMLElement) => [...c.querySelectorAll<HTMLElement>('[role=separator]')];
const panels = (c: HTMLElement) => [...c.querySelectorAll<HTMLElement>('[data-splitter-panel]')];
const widths = (c: HTMLElement) =>
  panels(c).map((p) => Math.round(p.getBoundingClientRect().width));
const heights = (c: HTMLElement) =>
  panels(c).map((p) => Math.round(p.getBoundingClientRect().height));
const now = (el: HTMLElement) => Number(el.getAttribute('aria-valuenow'));

/** A trusted mouse drag (real pointer events) from `from` to `to`, in viewport coordinates. */
async function drag(from: { x: number; y: number }, to: { x: number; y: number }) {
  // The Playwright provider's CDP session; typed loosely because the augmentation is not in this tsconfig.
  const session = cdp() as unknown as {
    send: (method: string, params: Record<string, unknown>) => Promise<unknown>;
  };
  const send = (type: string, x: number, y: number, buttons: number) =>
    session.send('Input.dispatchMouseEvent', {
      type,
      x,
      y,
      button: 'left',
      buttons,
      clickCount: type === 'mouseMoved' ? 0 : 1,
    });
  await send('mouseMoved', from.x, from.y, 0);
  await send('mousePressed', from.x, from.y, 1);
  await send('mouseMoved', (from.x + to.x) / 2, (from.y + to.y) / 2, 1);
  await send('mouseMoved', to.x, to.y, 1);
  await send('mouseReleased', to.x, to.y, 0);
  await raf();
}

const center = (el: HTMLElement) => {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

const TwoPane = (props: React.ComponentProps<typeof Splitter>) => (
  <Splitter defaultSizes={[50, 50]} style={{ height: '100%' }} {...props}>
    <Splitter.Panel>A</Splitter.Panel>
    <Splitter.Panel>B</Splitter.Panel>
  </Splitter>
);

describe('Splitter (real browser)', () => {
  test('lays out panels by size and leaves room for the divider', async () => {
    const { container } = render(
      <Wrap>
        <TwoPane defaultSizes={[30, 70]} />
      </Wrap>,
    );
    await raf();
    const [a, b] = widths(container);
    expect(a! + b!).toBe(599);
    expect(Math.abs(a! - 0.3 * 599)).toBeLessThanOrEqual(1);
  });

  test('a trusted pointer drag resizes the panels, and keeps tracking outside the handle', async () => {
    const { container } = render(
      <Wrap>
        <TwoPane />
      </Wrap>,
    );
    await raf();
    const handle = seps(container)[0]!;
    const start = center(handle);
    await drag(start, { x: start.x + 100, y: start.y + 150 });
    const [a, b] = widths(container);
    expect(Math.abs(a! - (299.5 + 100))).toBeLessThanOrEqual(3);
    expect(a! + b!).toBe(599);
    expect(now(handle)).toBeGreaterThan(62);
    expect(now(handle)).toBeLessThan(71);
  });

  test('dragging past the limits clamps to maxSizes', async () => {
    const { container } = render(
      <Wrap>
        <TwoPane maxSizes={[60, 100]} minSizes={[0, 25]} />
      </Wrap>,
    );
    await raf();
    const handle = seps(container)[0]!;
    await drag(center(handle), { x: center(handle).x + 100, y: 100 });
    expect(now(handle)).toBe(60);
    await drag(center(handle), { x: 0, y: 100 });
    expect(now(handle)).toBeLessThan(2);
  });

  test('keyboard: arrows, Shift, Home and End clamp to the limits', async () => {
    const { container } = render(
      <Wrap>
        <TwoPane minSizes={[20, 20]} />
      </Wrap>,
    );
    const handle = seps(container)[0]!;
    handle.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(now(handle)).toBe(55);
    await userEvent.keyboard('{Shift>}{ArrowLeft}{/Shift}');
    expect(now(handle)).toBe(35);
    await userEvent.keyboard('{Home}');
    expect(now(handle)).toBe(20);
    await userEvent.keyboard('{ArrowLeft}');
    expect(now(handle)).toBe(20);
    await userEvent.keyboard('{End}');
    expect(now(handle)).toBe(80);
    await userEvent.keyboard('{ArrowRight}');
    expect(now(handle)).toBe(80);
    await raf();
    expect(widths(container)[0]).toBeGreaterThan(470);
  });

  test('vertical orientation stacks panels and uses ArrowDown/ArrowUp', async () => {
    const { container } = render(
      <Wrap>
        <TwoPane orientation="vertical" />
      </Wrap>,
    );
    await raf();
    const handle = seps(container)[0]!;
    expect(handle.getAttribute('aria-orientation')).toBe('horizontal');
    const [ha, hb] = heights(container);
    expect(Math.abs(ha! + hb! - 299)).toBeLessThanOrEqual(1);
    handle.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(now(handle)).toBe(55);
    await userEvent.keyboard('{ArrowRight}');
    expect(now(handle)).toBe(55);
    const start = center(handle);
    await drag(start, { x: start.x + 80, y: start.y - 60 });
    expect(heights(container)[0]).toBeLessThan(ha! + 20);
    expect(heights(container)[0]).toBeGreaterThan(ha! - 70);
  });

  test('RTL mirrors horizontal arrows and drag', async () => {
    const { container } = render(
      <Wrap dir="rtl">
        <TwoPane />
      </Wrap>,
    );
    await raf();
    const handle = seps(container)[0]!;
    const [first] = panels(container);
    // Panel A sits on the right in RTL.
    expect(first!.getBoundingClientRect().left).toBeGreaterThan(
      panels(container)[1]!.getBoundingClientRect().left,
    );
    handle.focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(now(handle)).toBe(55);
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    expect(now(handle)).toBe(45);
    const before = widths(container)[0]!;
    const start = center(handle);
    await drag(start, { x: start.x - 60, y: start.y });
    expect(widths(container)[0]!).toBeGreaterThan(before + 50);
  });

  test('Enter collapses a collapsible panel to nothing and restores it', async () => {
    const { container } = render(
      <Wrap>
        <TwoPane defaultSizes={[30, 70]} collapsible={[true, false]} minSizes={[15, 0]} />
      </Wrap>,
    );
    const handle = seps(container)[0]!;
    handle.focus();
    await userEvent.keyboard('{Enter}');
    await raf();
    expect(now(handle)).toBe(0);
    expect(widths(container)[0]).toBe(0);
    expect(panels(container)[0]!.hasAttribute('data-collapsed')).toBe(true);
    await userEvent.keyboard('{ArrowRight}');
    expect(now(handle)).toBe(15);
    await userEvent.keyboard('{ArrowLeft}');
    expect(now(handle)).toBe(0);
    await userEvent.keyboard('{Enter}');
    expect(now(handle)).toBe(15);
  });

  test('dragging a collapsible panel below half its minimum collapses it', async () => {
    const { container } = render(
      <Wrap>
        <TwoPane defaultSizes={[30, 70]} collapsible={[true, false]} minSizes={[20, 0]} />
      </Wrap>,
    );
    await raf();
    const handle = seps(container)[0]!;
    const start = center(handle);
    await drag(start, { x: start.x - 100, y: start.y });
    expect(now(handle)).toBe(20);
    await drag(center(handle), { x: 5, y: 100 });
    expect(now(handle)).toBe(0);
  });

  test('double-click resets to the default sizes', async () => {
    const { container } = render(
      <Wrap>
        <TwoPane defaultSizes={[30, 70]} />
      </Wrap>,
    );
    const handle = seps(container)[0]!;
    handle.focus();
    await userEvent.keyboard('{End}');
    expect(now(handle)).toBe(100);
    await userEvent.dblClick(handle);
    expect(now(handle)).toBe(30);
  });

  test('three panels: each divider moves only its two neighbours', async () => {
    const { container } = render(
      <Wrap>
        <Splitter defaultSizes={[20, 30, 50]} style={{ height: '100%' }}>
          <Splitter.Panel>A</Splitter.Panel>
          <Splitter.Panel>B</Splitter.Panel>
          <Splitter.Panel>C</Splitter.Panel>
        </Splitter>
      </Wrap>,
    );
    await raf();
    const [h1, h2] = seps(container);
    expect(h1!.getAttribute('aria-valuemax')).toBe('50');
    h2!.focus();
    await userEvent.keyboard('{ArrowRight}');
    const w = widths(container);
    expect(Math.abs(w[0]! - 0.2 * 598)).toBeLessThanOrEqual(2);
    expect(now(h2!)).toBe(35);
    expect(now(h1!)).toBe(20);
  });

  test('content is clipped or scrolls instead of stretching the panel', async () => {
    const { container } = render(
      <Wrap>
        <TwoPane defaultSizes={[20, 80]}>
          <Splitter.Panel>
            <div style={{ width: 3000, height: 3000 }} />
          </Splitter.Panel>
          <Splitter.Panel>B</Splitter.Panel>
        </TwoPane>
      </Wrap>,
    );
    await raf();
    const w = widths(container);
    expect(w[0]! + w[1]!).toBe(599);
    expect(Math.abs(w[0]! - 0.2 * 599)).toBeLessThanOrEqual(1);
  });

  test('persists with autoSaveId across mounts', async () => {
    const first = render(
      <Wrap>
        <TwoPane autoSaveId="persist" />
      </Wrap>,
    );
    seps(first.container)[0]!.focus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    first.unmount();
    const second = render(
      <Wrap>
        <TwoPane autoSaveId="persist" />
      </Wrap>,
    );
    await raf();
    expect(now(seps(second.container)[0]!)).toBe(60);
    expect(Math.abs(widths(second.container)[0]! - 0.6 * 599)).toBeLessThanOrEqual(1);
  });

  test('nested splitters resize independently', async () => {
    const { container } = render(
      <Wrap>
        <Splitter defaultSizes={[40, 60]} style={{ height: '100%' }}>
          <Splitter.Panel>A</Splitter.Panel>
          <Splitter.Panel>
            <Splitter orientation="vertical" defaultSizes={[50, 50]} style={{ height: '100%' }}>
              <Splitter.Panel>B1</Splitter.Panel>
              <Splitter.Panel>B2</Splitter.Panel>
            </Splitter>
          </Splitter.Panel>
        </Splitter>
      </Wrap>,
    );
    await raf();
    const [outer, inner] = seps(container);
    expect(inner!.getAttribute('aria-orientation')).toBe('horizontal');
    inner!.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(now(inner!)).toBe(55);
    expect(now(outer!)).toBe(40);
    const start = center(outer!);
    await drag(start, { x: start.x + 60, y: start.y });
    expect(now(outer!)).toBeGreaterThan(45);
    expect(now(inner!)).toBe(55);
  });

  test('controlled sizes follow the parent', async () => {
    function Demo() {
      const [sizes, setSizes] = useState([50, 50]);
      return (
        <>
          <button type="button" onClick={() => setSizes([10, 90])}>
            go
          </button>
          <TwoPane sizes={sizes} onSizesChange={setSizes} />
        </>
      );
    }
    const { container, getByText } = render(
      <Wrap>
        <Demo />
      </Wrap>,
    );
    getByText('go').click();
    await raf();
    expect(now(seps(container)[0]!)).toBe(10);
    seps(container)[0]!.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(now(seps(container)[0]!)).toBe(15);
  });

  test('the divider is focusable and shows a focus ring', async () => {
    const { container } = render(
      <Wrap>
        <button type="button">before</button>
        <TwoPane />
      </Wrap>,
    );
    await userEvent.tab();
    await userEvent.tab();
    const handle = seps(container)[0]!;
    expect(document.activeElement).toBe(handle);
    expect(getComputedStyle(handle).outlineStyle).not.toBe('none');
  });
});
