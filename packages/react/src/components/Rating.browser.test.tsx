import { render } from '@testing-library/react';
import { StrictMode, useState } from 'react';
import { userEvent } from 'vite-plus/test/browser';
import { describe, expect, test } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { raf, settled } from '../test/browser';
import { Rating } from './Rating';

function Wrap({ children, dir }: { children: React.ReactNode; dir?: 'rtl' }) {
  return (
    <StrictMode>
      <DesignSystemProvider applyToDocument>
        <div dir={dir}>{children}</div>
      </DesignSystemProvider>
    </StrictMode>
  );
}

const radios = (c: HTMLElement) => [...c.querySelectorAll<HTMLInputElement>('input[type=radio]')];
const items = (c: HTMLElement) => [...c.querySelectorAll<HTMLElement>('.var-ui-rating__item')];
/** Rendered fill of item n (0-based) as a share of the item width. */
const fillShare = (c: HTMLElement, i: number) => {
  const item = items(c)[i]!;
  const fill = item.querySelector<HTMLElement>('.var-ui-rating__fill')!;
  return Math.round(
    (fill.getBoundingClientRect().width / item.getBoundingClientRect().width) * 100,
  );
};

describe('Rating (real browser)', () => {
  test('Tab enters the group once on the checked star; arrows move and select', async () => {
    const { container } = render(
      <Wrap>
        <button type="button">before</button>
        <Rating defaultValue={2} label="Quality" />
        <button type="button">after</button>
      </Wrap>,
    );
    await userEvent.tab();
    await userEvent.tab();
    expect(document.activeElement).toBe(radios(container)[1]);
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(radios(container)[2]);
    expect(radios(container)[2]?.checked).toBe(true);
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(radios(container)[0]?.checked).toBe(true);
    await userEvent.tab();
    expect(document.activeElement?.textContent).toBe('after');
  });

  test('arrow keys follow the visual direction in RTL', async () => {
    const { container } = render(
      <Wrap dir="rtl">
        <Rating defaultValue={3} />
      </Wrap>,
    );
    radios(container)[2]!.focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(radios(container)[3]?.checked).toBe(true);
    await userEvent.keyboard('{ArrowRight}');
    expect(radios(container)[2]?.checked).toBe(true);
  });

  test('shows a focus ring on the focused star only', async () => {
    const { container } = render(
      <Wrap>
        <Rating defaultValue={2} />
      </Wrap>,
    );
    await userEvent.tab();
    const [a, b] = items(container);
    expect(getComputedStyle(b!).outlineStyle).toBe('solid');
    expect(getComputedStyle(a!).outlineStyle).toBe('none');
  });

  test('hover previews up to the hovered star, then restores', async () => {
    const { container } = render(
      <Wrap>
        <Rating defaultValue={4} />
      </Wrap>,
    );
    await settled(document.body);
    expect([0, 1, 2, 3, 4].map((i) => fillShare(container, i))).toEqual([100, 100, 100, 100, 0]);
    await userEvent.hover(items(container)[1]!);
    await settled(document.body);
    expect([0, 1, 2, 3, 4].map((i) => fillShare(container, i))).toEqual([100, 100, 0, 0, 0]);
    await userEvent.unhover(items(container)[1]!);
    await settled(document.body);
    expect([0, 1, 2, 3, 4].map((i) => fillShare(container, i))).toEqual([100, 100, 100, 100, 0]);
  });

  test('hover preview follows the DOM order in RTL (stars fill from the inline start)', async () => {
    const { container } = render(
      <Wrap dir="rtl">
        <Rating defaultValue={0} />
      </Wrap>,
    );
    const list = items(container);
    // In RTL the first star sits at the right edge.
    expect(list[0]!.getBoundingClientRect().left).toBeGreaterThan(
      list[4]!.getBoundingClientRect().left,
    );
    await userEvent.hover(list[2]!);
    await settled(document.body);
    expect([0, 1, 2, 3, 4].map((i) => fillShare(container, i))).toEqual([100, 100, 100, 0, 0]);
  });

  test('read-only fractional value clips the next star at the fraction', async () => {
    const { container } = render(
      <Wrap>
        <Rating readOnly value={3.5} />
      </Wrap>,
    );
    await settled(document.body);
    expect([0, 1, 2, 3, 4].map((i) => fillShare(container, i))).toEqual([100, 100, 100, 50, 0]);
  });

  test('read-only fractions fill from the inline start in RTL', async () => {
    const { container } = render(
      <Wrap dir="rtl">
        <Rating readOnly value={0.5} />
      </Wrap>,
    );
    await settled(document.body);
    const item = items(container)[0]!.getBoundingClientRect();
    const fill = items(container)[0]!
      .querySelector('.var-ui-rating__fill')!
      .getBoundingClientRect();
    expect(Math.round(fill.right)).toBe(Math.round(item.right));
  });

  test('clicking a star picks it and posts the number with a form', async () => {
    const { container } = render(
      <Wrap>
        <form>
          <Rating name="quality" />
        </form>
      </Wrap>,
    );
    const form = container.querySelector('form')!;
    expect(new FormData(form).get('quality')).toBeNull();
    await userEvent.click(items(container)[3]!);
    expect(new FormData(form).get('quality')).toBe('4');
  });

  test('an unnamed rating posts nothing', async () => {
    const { container } = render(
      <Wrap>
        <form>
          <Rating defaultValue={3} />
        </form>
      </Wrap>,
    );
    expect([...new FormData(container.querySelector('form')!).keys()]).toEqual([]);
  });

  test('required blocks submission until a star is picked', async () => {
    const { container } = render(
      <Wrap>
        <form>
          <Rating name="q" required />
        </form>
      </Wrap>,
    );
    const form = container.querySelector('form')!;
    expect(form.checkValidity()).toBe(false);
    await userEvent.click(items(container)[0]!);
    expect(form.checkValidity()).toBe(true);
  });

  test('clearable: clicking the current star clears it, clicking another picks it', async () => {
    function Controlled() {
      const [v, setV] = useState(3);
      return (
        <>
          <Rating clearable value={v} onValueChange={setV} />
          <output>{v}</output>
        </>
      );
    }
    const { container } = render(
      <Wrap>
        <Controlled />
      </Wrap>,
    );
    await userEvent.click(items(container)[2]!);
    expect(container.querySelector('output')?.textContent).toBe('0');
    expect(radios(container).some((r) => r.checked)).toBe(false);
    await userEvent.click(items(container)[1]!);
    expect(container.querySelector('output')?.textContent).toBe('2');
  });

  test('disabled stars are not tabbable and ignore clicks', async () => {
    const { container } = render(
      <Wrap>
        <button type="button">before</button>
        <Rating disabled defaultValue={1} />
        <button type="button">after</button>
      </Wrap>,
    );
    await userEvent.tab();
    await userEvent.tab();
    expect(document.activeElement?.textContent).toBe('after');
    await userEvent.click(items(container)[3]!, { force: true });
    expect(radios(container)[0]?.checked).toBe(true);
  });

  test('read-only has no focusable stars', async () => {
    const { container } = render(
      <Wrap>
        <button type="button">before</button>
        <Rating readOnly value={2} />
        <button type="button">after</button>
      </Wrap>,
    );
    await userEvent.tab();
    await userEvent.tab();
    expect(document.activeElement?.textContent).toBe('after');
    expect(container.querySelectorAll('input[type=radio]')).toHaveLength(0);
  });
});
