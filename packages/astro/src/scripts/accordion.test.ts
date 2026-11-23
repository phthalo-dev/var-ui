import { beforeEach, describe, expect, it } from 'vite-plus/test';
import { createAccordionController } from './accordion';

function mountAccordion(options?: { type?: string; collapsible?: boolean }): HTMLElement {
  const type = options?.type ?? 'single';
  const collapsible = options?.collapsible ?? true;
  const root = document.createElement('div');
  root.innerHTML = `
    <div
      data-var-ui-accordion
      data-var-ui-accordion-type="${type}"
      data-collapsible="${collapsible ? 'true' : 'false'}"
    >
      <details data-var-ui-accordion-item data-var-ui-accordion-id="a" open>
        <summary data-var-ui-accordion-trigger>A</summary>
        <div>Panel A</div>
      </details>
      <details data-var-ui-accordion-item data-var-ui-accordion-id="b">
        <summary data-var-ui-accordion-trigger>B</summary>
        <div>Panel B</div>
      </details>
      <details data-var-ui-accordion-item data-var-ui-accordion-id="c">
        <summary data-var-ui-accordion-trigger>C</summary>
        <div>Panel C</div>
      </details>
    </div>
  `;
  document.body.appendChild(root);
  return root.querySelector('[data-var-ui-accordion]') as HTMLElement;
}

function item(root: HTMLElement, id: string): HTMLDetailsElement {
  const el = root.querySelector(`[data-var-ui-accordion-id="${id}"]`);
  if (!(el instanceof HTMLDetailsElement)) {
    throw new Error(`Missing accordion item ${id}`);
  }
  return el;
}

function clickTrigger(root: HTMLElement, id: string): void {
  const summary = root.querySelector(`[data-var-ui-accordion-id="${id}"] summary`);
  if (!(summary instanceof HTMLElement)) {
    throw new Error(`Missing accordion trigger for ${id}`);
  }
  summary.click();
}

async function flushMicrotasks(): Promise<void> {
  await Promise.resolve();
}

describe('createAccordionController', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('closes other panels when one opens in single mode', async () => {
    const root = mountAccordion();
    createAccordionController(root);

    clickTrigger(root, 'b');
    await flushMicrotasks();

    expect(item(root, 'a').open).toBe(false);
    expect(item(root, 'b').open).toBe(true);
    expect(item(root, 'c').open).toBe(false);
  });

  it('allows multiple open panels in multiple mode', () => {
    const root = mountAccordion({ type: 'multiple' });
    createAccordionController(root);

    item(root, 'a').open = true;
    clickTrigger(root, 'b');

    expect(item(root, 'a').open).toBe(true);
    expect(item(root, 'b').open).toBe(true);
  });

  it('prevents closing the last open panel when collapsible is false', async () => {
    const root = mountAccordion({ collapsible: false });
    createAccordionController(root);

    clickTrigger(root, 'a');
    await flushMicrotasks();

    expect(item(root, 'a').open).toBe(true);
  });

  it('moves focus between triggers with arrow keys', () => {
    const root = mountAccordion();
    createAccordionController(root);
    const triggerA = root.querySelector('[data-var-ui-accordion-id="a"] summary') as HTMLElement;
    const triggerB = root.querySelector('[data-var-ui-accordion-id="b"] summary') as HTMLElement;

    triggerA.focus();
    triggerA.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

    expect(document.activeElement).toBe(triggerB);
  });

  it('does not double-bind handlers', async () => {
    const root = mountAccordion();
    createAccordionController(root);
    createAccordionController(root);

    clickTrigger(root, 'b');
    await flushMicrotasks();
    expect(item(root, 'a').open).toBe(false);
  });
});
