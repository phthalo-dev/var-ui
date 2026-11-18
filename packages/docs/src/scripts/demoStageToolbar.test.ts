import { afterEach, describe, expect, it } from 'vite-plus/test';
import { initDemoStageToolbar } from './demoStageToolbar';

function mount(): HTMLElement {
  document.documentElement.className = 'theme-var-ui-default';
  document.body.innerHTML = `
    <div id="wrap">
      <div data-demo-stage><div data-demo-stage-inner></div></div>
      <div role="toolbar">
        <button data-demo-toggle="color-mode" aria-pressed="false"></button>
        <button data-demo-toggle="direction" aria-pressed="false"></button>
      </div>
    </div>`;
  return document.getElementById('wrap')!;
}

describe('initDemoStageToolbar', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-color-mode');
  });

  it('pins the opposite color mode and theme class on the stage, then restores', () => {
    document.documentElement.setAttribute('data-color-mode', 'light');
    const wrap = mount();
    initDemoStageToolbar();
    const stage = wrap.querySelector<HTMLElement>('[data-demo-stage]')!;
    const button = wrap.querySelector<HTMLElement>('[data-demo-toggle="color-mode"]')!;
    button.click();
    expect(stage.getAttribute('data-color-mode')).toBe('dark');
    expect(stage.classList.contains('theme-var-ui-default')).toBe(true);
    button.click();
    expect(stage.hasAttribute('data-color-mode')).toBe(false);
    expect(stage.classList.contains('theme-var-ui-default')).toBe(false);
  });

  it('toggles right-to-left on the stage content', () => {
    const wrap = mount();
    initDemoStageToolbar();
    const inner = wrap.querySelector<HTMLElement>('[data-demo-stage-inner]')!;
    wrap.querySelector<HTMLElement>('[data-demo-toggle="direction"]')!.click();
    expect(inner.getAttribute('dir')).toBe('rtl');
  });
});
