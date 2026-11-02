import { render } from '@testing-library/react';
import { describe, expect, test } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { raf } from '../test/browser';
import { Meter } from './Meter';
import { ProgressCircle } from './ProgressCircle';

function Wrap({ children, dir }: { children: React.ReactNode; dir?: 'rtl' }) {
  return (
    <DesignSystemProvider applyToDocument>
      <div dir={dir}>{children}</div>
    </DesignSystemProvider>
  );
}

const fillOf = () => document.querySelector<SVGCircleElement>('.var-ui-progress-circle__fill')!;
/** First number of the computed `stroke-dasharray`, in pathLength (0..100) units. */
const dash = (el: Element) =>
  parseFloat(/-?[\d.]+/.exec(getComputedStyle(el).strokeDasharray)?.[0] ?? 'NaN');

describe('ProgressCircle (browser)', () => {
  test('the fill dash length equals the value', async () => {
    const { rerender } = render(
      <Wrap>
        <ProgressCircle label="Upload" value={25} />
      </Wrap>,
    );
    await raf();
    expect(dash(fillOf())).toBeCloseTo(25, 0);
    rerender(
      <Wrap>
        <ProgressCircle label="Upload" value={3} min={0} max={4} />
      </Wrap>,
    );
    await raf();
    await Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {})));
    expect(dash(fillOf())).toBeCloseTo(75, 0);
  });

  test('draws a ring sized by the size axis, with children centered', async () => {
    render(
      <Wrap>
        <ProgressCircle label="Upload" value={50} size="lg">
          50%
        </ProgressCircle>
      </Wrap>,
    );
    await raf();
    const root = document.querySelector<HTMLElement>('[role=progressbar]')!;
    const rect = root.getBoundingClientRect();
    expect(rect.width).toBe(64);
    expect(rect.height).toBe(64);
    const text = document.querySelector<HTMLElement>('.var-ui-progress-circle__content')!;
    const t = text.getBoundingClientRect();
    expect(Math.abs(t.left + t.width / 2 - (rect.left + rect.width / 2))).toBeLessThan(1);
    expect(Math.abs(t.top + t.height / 2 - (rect.top + rect.height / 2))).toBeLessThan(1);
  });

  test('indeterminate spins a quarter arc', async () => {
    render(
      <Wrap>
        <ProgressCircle label="Loading" />
      </Wrap>,
    );
    await raf();
    const fill = fillOf();
    expect(dash(fill)).toBeCloseTo(25, 0);
    expect(getComputedStyle(fill).animationName).toContain('progress-circle-spin');
    expect(fill.getAnimations().length).toBeGreaterThan(0);
  });

  test('RTL mirrors the sweep', async () => {
    render(
      <Wrap dir="rtl">
        <ProgressCircle label="Upload" value={50} />
      </Wrap>,
    );
    await raf();
    const ring = document.querySelector<SVGElement>('.var-ui-progress-circle__ring')!;
    // rotate(-90deg) gives c = 1; the RTL scaleX(-1) flips it to -1 (the sweep runs the other way).
    expect(new DOMMatrix(getComputedStyle(ring).transform).c).toBeCloseTo(-1, 5);
    const ltr = render(
      <Wrap>
        <ProgressCircle label="Upload" value={50} />
      </Wrap>,
    );
    await raf();
    const ringLtr = ltr.container.querySelector<SVGElement>('.var-ui-progress-circle__ring')!;
    expect(new DOMMatrix(getComputedStyle(ringLtr).transform).c).toBeCloseTo(1, 5);
  });
});

describe('Meter (browser)', () => {
  test('the fill width follows the value and the tone paints the fill', async () => {
    render(
      <Wrap>
        <Meter label="Disk" value={30} />
        <Meter label="Disk full" value={90} high={75} optimum={10} />
      </Wrap>,
    );
    await raf();
    const [a, b] = [...document.querySelectorAll<HTMLElement>('[role~=meter]')];
    const track = (el: HTMLElement) =>
      el.querySelector<HTMLElement>('.var-ui-meter__track')!.getBoundingClientRect().width;
    const fill = (el: HTMLElement) => el.querySelector<HTMLElement>('.var-ui-meter__fill')!;
    await Promise.all(document.getAnimations().map((x) => x.finished.catch(() => {})));
    expect(fill(a).getBoundingClientRect().width / track(a)).toBeCloseTo(0.3, 2);
    expect(fill(b).getBoundingClientRect().width / track(b)).toBeCloseTo(0.9, 2);
    expect(getComputedStyle(fill(a)).backgroundColor).not.toBe(
      getComputedStyle(fill(b)).backgroundColor,
    );
  });
});
