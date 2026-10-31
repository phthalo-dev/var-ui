import { afterEach, beforeAll, expect, test } from 'vite-plus/test';
import { dialog } from '@var-ui/core/components/dialog';
import { drawer } from '@var-ui/core/components/drawer';
import '../../../core/src/theme/base-styles';
import { edgeInfo, raf, viewport } from './browser';

// The core recipes style a native <dialog> directly: enter/exit is pure CSS (@starting-style plus
// discrete `display`/`overlay` transitions) and the ::backdrop fades through an inherited
// registered custom property. No theme is mounted here, so define the few tokens they read.
beforeAll(() => {
  const tokens = document.createElement('style');
  tokens.textContent = `:root {
    --var-ui-duration-slow: 300ms;
    --var-ui-easing-emphasized: linear;
    --var-ui-color-overlay-default: rgb(0 0 0 / 0.5);
    --var-ui-color-background-surface: white;
  }`;
  document.head.append(tokens);
});

afterEach(() => {
  document.body.innerHTML = '';
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const backdropAlpha = (el: Element) => {
  const m = getComputedStyle(el, '::backdrop').backgroundColor.match(/[\d.]+/g);
  return m && m.length >= 4 ? Number(m[3]) : 1;
};

function mount(html: string) {
  document.body.insertAdjacentHTML('beforeend', html);
  return document.body.lastElementChild as HTMLDialogElement;
}

test('dialog popup animates in and out and keeps the top layer while exiting; backdrop fades', async () => {
  const d = dialog();
  const el = mount(
    `<dialog class="${d.popup.className}"><div class="${d.content.className}">Hello</div></dialog>`,
  );
  expect(getComputedStyle(el).display).toBe('none');

  el.showModal();
  await sleep(100); // ~1/3 through the 300ms enter
  const midOpacity = Number(getComputedStyle(el).opacity);
  const midBackdrop = backdropAlpha(el);
  expect(midOpacity).toBeGreaterThan(0);
  expect(midOpacity).toBeLessThan(1);
  expect(midBackdrop).toBeGreaterThan(0);
  expect(midBackdrop).toBeLessThan(0.5);

  await sleep(400);
  expect(Number(getComputedStyle(el).opacity)).toBe(1);
  expect(backdropAlpha(el)).toBeCloseTo(0.5, 2);
  expect(document.documentElement.matches(':has(dialog:modal)')).toBe(true);
  expect(getComputedStyle(document.documentElement).overflow).toBe('hidden');
  expect(getComputedStyle(el).overscrollBehaviorY).toBe('contain');

  el.close();
  await sleep(100); // exit in progress: closed attribute-wise, still rendered
  expect(el.open).toBe(false);
  expect(el.matches(':modal')).toBe(false);
  expect(getComputedStyle(el).display).not.toBe('none');
  const exitOpacity = Number(getComputedStyle(el).opacity);
  expect(exitOpacity).toBeGreaterThan(0);
  expect(exitOpacity).toBeLessThan(1);
  const exitBackdrop = backdropAlpha(el);
  expect(exitBackdrop).toBeGreaterThan(0);
  expect(exitBackdrop).toBeLessThan(0.5);
  expect(getComputedStyle(document.documentElement).overflow).toBe('visible');

  await sleep(400);
  expect(getComputedStyle(el).display).toBe('none');
});

test('drawer popup slides in from its placement edge via translate', async () => {
  const s = drawer();
  const el = mount(`<dialog class="${s.popup.className}" data-placement="end">Drawer</dialog>`);
  el.showModal();
  await raf();
  const entering = getComputedStyle(el).translate;
  expect(entering).not.toBe('none'); // still travelling from 100% 0
  await sleep(400);
  expect(getComputedStyle(el).translate).toBe('none');
  const rect = el.getBoundingClientRect();
  expect(Math.round(rect.right), edgeInfo(el)).toBe(viewport().right); // docked to the inline end edge
  el.close();
  await sleep(100);
  expect(getComputedStyle(el).translate).not.toBe('none');
  await sleep(400);
  expect(getComputedStyle(el).display).toBe('none');
});
