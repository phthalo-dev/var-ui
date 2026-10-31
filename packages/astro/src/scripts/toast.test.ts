import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { initToastRegion, toast } from './toast';

function mountRegion(options?: { maxVisible?: number }): HTMLElement {
  const root = document.createElement('div');
  root.setAttribute('data-var-ui-toast-region', '');
  root.className = 'var-ui-toast__region';
  if (options?.maxVisible !== undefined) {
    root.dataset.maxVisible = String(options.maxVisible);
  }
  document.body.append(root);
  initToastRegion(root);
  return root;
}

describe('initToastRegion', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  it('shows a toast with title and description', () => {
    const region = mountRegion();
    const controller = initToastRegion(region);
    controller.show({
      tone: 'success',
      title: 'Saved',
      description: 'Draft stored.',
      durationMs: 0,
    });

    expect(region.querySelector('.var-ui-toast__title')?.textContent).toBe('Saved');
    expect(region.querySelector('.var-ui-toast__description')?.textContent).toBe('Draft stored.');
    expect(region.querySelector('.var-ui-toast__item')?.getAttribute('data-tone')).toBe('success');
  });

  it('dismisses a toast from the close button', () => {
    const region = mountRegion();
    const controller = initToastRegion(region);
    controller.show({ title: 'Hello', durationMs: 0 });
    const close = region.querySelector<HTMLButtonElement>('.var-ui-toast__close');
    close?.click();
    expect(region.querySelector('.var-ui-toast__item')).toBeNull();
  });

  it('auto-dismisses after durationMs', () => {
    vi.useFakeTimers();
    const region = mountRegion();
    const controller = initToastRegion(region);
    controller.show({ title: 'Temporary', durationMs: 50 });
    expect(region.querySelector('.var-ui-toast__item')).toBeTruthy();
    vi.advanceTimersByTime(60);
    expect(region.querySelector('.var-ui-toast__item')).toBeNull();
  });

  it('updates an existing toast', () => {
    const region = mountRegion();
    const controller = initToastRegion(region);
    const id = controller.show({ title: 'Loading', durationMs: 0 });
    controller.update(id, { title: 'Done', tone: 'success' });
    expect(region.querySelector('.var-ui-toast__title')?.textContent).toBe('Done');
    expect(region.querySelector('.var-ui-toast__icon')?.innerHTML).toContain('M8.5 12.5');
  });

  it('limits visible toasts to maxVisible', () => {
    const region = mountRegion({ maxVisible: 2 });
    const controller = initToastRegion(region);
    controller.show({ title: 'One', durationMs: 0 });
    controller.show({ title: 'Two', durationMs: 0 });
    controller.show({ title: 'Three', durationMs: 0 });
    expect(region.querySelectorAll('.var-ui-toast__item')).toHaveLength(2);
    expect(region.querySelector('.var-ui-toast__title')?.textContent).toBe('Three');
  });
});

describe('toast imperative API', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('uses the mounted region through toast.show()', () => {
    const region = mountRegion();
    toast.show({ title: 'Hello', durationMs: 0 });
    expect(region.querySelector('.var-ui-toast__title')?.textContent).toBe('Hello');
  });

  it('creates a default region when none is mounted', () => {
    toast.show({ title: 'Auto region', durationMs: 0 });
    const region = document.querySelector('[data-var-ui-toast-region]');
    expect(region).toBeTruthy();
    expect(region?.querySelector('.var-ui-toast__title')?.textContent).toBe('Auto region');
  });
});

describe('popover region', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('shows the manual popover while it has toasts and hides it when empty', () => {
    const open = new WeakSet<HTMLElement>();
    const proto = HTMLElement.prototype as unknown as Record<string, unknown>;
    proto.showPopover = function (this: HTMLElement) {
      open.add(this);
    };
    proto.hidePopover = function (this: HTMLElement) {
      open.delete(this);
    };
    const original = Element.prototype.matches;
    const spy = vi.spyOn(Element.prototype, 'matches').mockImplementation(function (
      this: Element,
      sel: string,
    ) {
      return sel === ':popover-open'
        ? open.has(this as HTMLElement)
        : Reflect.apply(original, this, [sel]);
    } as typeof Element.prototype.matches);
    try {
      const region = mountRegion();
      expect(region.getAttribute('popover')).toBe('manual');
      expect(open.has(region)).toBe(false);
      const id = initToastRegion(region).show({ title: 'Hi', durationMs: 0 });
      expect(open.has(region)).toBe(true);
      initToastRegion(region).dismiss(id);
      expect(open.has(region)).toBe(false);
    } finally {
      spy.mockRestore();
      delete proto.showPopover;
      delete proto.hidePopover;
    }
  });
});
