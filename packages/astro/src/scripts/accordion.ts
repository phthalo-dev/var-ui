export function createAccordionController(root: HTMLElement): void {
  if (root.hasAttribute('data-var-ui-accordion-initialized')) return;
  root.setAttribute('data-var-ui-accordion-initialized', '');

  const type = root.dataset.varUiAccordionType ?? 'single';
  const collapsible = root.dataset.collapsible !== 'false';

  const items = Array.from(
    root.querySelectorAll<HTMLDetailsElement>('[data-var-ui-accordion-item]'),
  );

  function getTriggers(): HTMLElement[] {
    return items
      .map((item) => item.querySelector<HTMLElement>('[data-var-ui-accordion-trigger]'))
      .filter((node): node is HTMLElement => node instanceof HTMLElement);
  }

  function closeOthers(except: HTMLDetailsElement): void {
    if (type !== 'single') return;
    for (const item of items) {
      if (item !== except && item.open) {
        item.open = false;
      }
    }
  }

  function handleItemStateChange(item: HTMLDetailsElement, wasOpen: boolean): void {
    if (item.open && !wasOpen) {
      closeOthers(item);
      return;
    }

    if (!item.open && wasOpen && type === 'single' && !collapsible) {
      item.open = true;
    }
  }

  items.forEach((item) => {
    const trigger = item.querySelector('[data-var-ui-accordion-trigger]');
    if (!(trigger instanceof HTMLElement)) return;

    trigger.addEventListener('click', () => {
      const wasOpen = item.open;
      queueMicrotask(() => handleItemStateChange(item, wasOpen));
    });
  });

  getTriggers().forEach((trigger) => {
    trigger.addEventListener('keydown', (event) => {
      if (!(event instanceof KeyboardEvent)) return;

      const triggers = getTriggers();
      const index = triggers.indexOf(trigger);
      if (index === -1) return;

      let target: HTMLElement | undefined;

      switch (event.key) {
        case 'Home':
          target = triggers[0];
          break;
        case 'End':
          target = triggers[triggers.length - 1];
          break;
        case 'ArrowDown':
          target = triggers[Math.min(triggers.length - 1, index + 1)];
          break;
        case 'ArrowUp':
          target = triggers[Math.max(0, index - 1)];
          break;
        default:
          return;
      }

      event.preventDefault();
      target?.focus();
    });
  });
}

export function initAccordions(root: ParentNode = document): void {
  root.querySelectorAll('[data-var-ui-accordion]').forEach((node) => {
    if (node instanceof HTMLElement) {
      createAccordionController(node);
    }
  });
}
