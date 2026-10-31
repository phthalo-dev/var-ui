import { afterEach, beforeAll, expect, test } from 'vite-plus/test';
import { popover } from '@var-ui/core/components/popover';
import { select } from '@var-ui/core/components/select';
import '../../../core/src/theme/base-styles';
import { finishAll, freezeAt, raf } from './browser';

// The core recipes position a `[popover]` element against its anchor in pure CSS (position-area,
// position-try-fallbacks, anchor-size). JS only names the anchor: `anchor-name` on the trigger and
// `position-anchor` on the popup. No theme is mounted, so define the tokens the recipes read.
beforeAll(() => {
  const tokens = document.createElement('style');
  tokens.textContent = `:root {
    --var-ui-duration-slow: 300ms;
    --var-ui-easing-emphasized: linear;
    --var-ui-space-1: 4px; --var-ui-space-2: 8px; --var-ui-space-3: 12px; --var-ui-space-4: 16px;
    --var-ui-borderWidth-default: 1px;
    --var-ui-radius-md: 6px;
    --var-ui-shadow-md: none;
    --var-ui-color-background-surface: white;
    --var-ui-color-border-default: gray;
    --var-ui-color-text-primary: black;
  }
  body { margin: 0; }
  .trigger { position: fixed; box-sizing: border-box; height: 30px; margin: 0; padding: 0; }`;
  document.head.append(tokens);
});

afterEach(() => {
  document.body.innerHTML = '';
  document.body.removeAttribute('dir');
  document.documentElement.removeAttribute('dir');
});

type Mounted = { trigger: HTMLElement; popup: HTMLElement };

function mount(opts: {
  popupClass: string;
  placement?: string;
  triggerStyle: string;
  popupStyle?: string;
  content?: string;
}): Mounted {
  document.body.innerHTML = `
    <button class="trigger" style="${opts.triggerStyle}">trigger</button>
    <div popover="auto" class="${opts.popupClass}" ${opts.placement ? `data-placement="${opts.placement}"` : ''}
      style="${opts.popupStyle ?? ''}"><div style="height:${opts.content ?? '100px'}">content</div></div>`;
  const trigger = document.body.firstElementChild as HTMLElement;
  const popup = trigger.nextElementSibling as HTMLElement;
  // what `useAnchor` does at runtime
  trigger.style.setProperty('anchor-name', '--test-anchor');
  popup.style.setProperty('position-anchor', '--test-anchor');
  return { trigger, popup };
}

async function open({ popup }: Mounted) {
  popup.showPopover();
  await raf();
  await finishAll(popup); // measure after the scale-in, which would skew the rect
  return popup.getBoundingClientRect();
}

const near = (a: number, b: number) => expect(Math.abs(a - b)).toBeLessThan(1.5);

test('popover=auto opens below its trigger, offset by the default space token', async () => {
  const m = mount({
    popupClass: popover().root.className,
    triggerStyle: 'top:100px;left:120px;width:100px',
  });
  const pop = await open(m);
  const trg = m.trigger.getBoundingClientRect();
  near(pop.top, trg.bottom + 8); // --var-ui-space-2
  near(pop.left, trg.left); // `bottom` = start-aligned
  expect(getComputedStyle(m.popup).position).toBe('fixed');
});

test('flips above the trigger when there is no room below', async () => {
  const m = mount({
    popupClass: popover().root.className,
    triggerStyle: `top:${window.innerHeight - 40}px;left:120px;width:100px`,
    content: '150px',
  });
  const pop = await open(m);
  const trg = m.trigger.getBoundingClientRect();
  near(pop.bottom, trg.top - 8);
  expect(pop.top).toBeGreaterThanOrEqual(0);
});

test('a listbox popup matches the trigger width through anchor-size', async () => {
  const m = mount({
    popupClass: select().popover.className,
    triggerStyle: 'top:60px;left:40px;width:237px',
  });
  const pop = await open(m);
  near(pop.width, 237);
  near(pop.top, m.trigger.getBoundingClientRect().bottom + 4); // select uses space-1
});

test('the offset custom property moves the popup', async () => {
  const m = mount({
    popupClass: popover().root.className,
    triggerStyle: 'top:100px;left:120px;width:100px',
    popupStyle: '--var-ui-popup-offset:30px',
  });
  const pop = await open(m);
  near(pop.top, m.trigger.getBoundingClientRect().bottom + 30);
});

test('placement is logical: start/end mirror in RTL', async () => {
  const geometry = async (dir: 'ltr' | 'rtl', placement: string) => {
    document.body.dir = dir;
    const m = mount({
      popupClass: popover().root.className,
      placement,
      triggerStyle: 'top:200px;left:140px;width:100px',
      popupStyle: 'width:80px;min-width:0',
    });
    const pop = await open(m);
    const trg = m.trigger.getBoundingClientRect();
    m.popup.hidePopover();
    await finishAll(m.popup);
    return { pop, trg };
  };

  // inline side: `end` sits after the trigger (right in LTR, left in RTL)
  let g = await geometry('ltr', 'end center');
  near(g.pop.left, g.trg.right + 8);
  g = await geometry('rtl', 'end center');
  near(g.pop.right, g.trg.left - 8);
  g = await geometry('ltr', 'start center');
  near(g.pop.right, g.trg.left - 8);
  g = await geometry('rtl', 'start center');
  near(g.pop.left, g.trg.right + 8);

  // block side with inline align: `bottom start` shares the leading edge, `bottom end` the trailing one
  g = await geometry('ltr', 'bottom start');
  near(g.pop.left, g.trg.left);
  g = await geometry('rtl', 'bottom start');
  near(g.pop.right, g.trg.right);
  g = await geometry('rtl', 'bottom end');
  near(g.pop.left, g.trg.left);
  g = await geometry('ltr', 'bottom center');
  near(g.pop.left + g.pop.width / 2, g.trg.left + g.trg.width / 2);
});

test('top placement sits above the trigger', async () => {
  const m = mount({
    popupClass: popover().root.className,
    placement: 'top end',
    triggerStyle: 'top:300px;left:300px;width:100px',
    popupStyle: 'width:60px;min-width:0',
  });
  const pop = await open(m);
  const trg = m.trigger.getBoundingClientRect();
  near(pop.bottom, trg.top - 8);
  near(pop.right, trg.right); // `end` align shares the trailing edge
});

test('enter and exit animate and the element stays rendered until the exit ends', async () => {
  const m = mount({
    popupClass: popover().root.className,
    triggerStyle: 'top:100px;left:120px;width:100px',
  });
  const { popup } = m;
  expect(getComputedStyle(popup).display).toBe('none');

  popup.showPopover();
  await raf();
  expect(freezeAt(popup, 1 / 3)).toBeGreaterThan(0);
  const mid = Number(getComputedStyle(popup).opacity);
  expect(mid).toBeGreaterThan(0);
  expect(mid).toBeLessThan(1);

  await finishAll(popup);
  expect(Number(getComputedStyle(popup).opacity)).toBe(1);
  expect(popup.matches(':popover-open')).toBe(true);

  popup.hidePopover();
  await raf();
  expect(popup.matches(':popover-open')).toBe(false);
  expect(freezeAt(popup, 1 / 3)).toBeGreaterThan(0);
  expect(getComputedStyle(popup).display).not.toBe('none'); // still rendered, animating out
  const exiting = Number(getComputedStyle(popup).opacity);
  expect(exiting).toBeGreaterThan(0);
  expect(exiting).toBeLessThan(1);

  await finishAll(popup);
  expect(getComputedStyle(popup).display).toBe('none');
});
