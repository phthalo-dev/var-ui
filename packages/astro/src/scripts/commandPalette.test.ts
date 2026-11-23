import { describe, expect, it, beforeEach } from 'vite-plus/test';
import { getCommandPaletteController, initCommandPalette } from './commandPalette';

describe('initCommandPalette', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('opens from the controller API and renders grouped results', () => {
    HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
      this.open = true;
    };
    HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
      this.open = false;
    };

    document.body.innerHTML = `
      <div
        id="palette"
        data-var-ui-command-palette-root
        data-var-ui-command-palette-id="palette"
        data-var-ui-class-result-link="result-link"
        data-var-ui-class-result-link-active="result-link-active"
        data-var-ui-class-result-body="result-body"
        data-var-ui-class-result-title="result-title"
        data-var-ui-class-result-meta="result-meta"
        data-var-ui-class-empty="empty"
        data-var-ui-class-group="group"
        data-var-ui-class-group-heading="group-heading"
        data-var-ui-hotkey="false"
      >
        <dialog data-var-ui-command-palette-dialog aria-label="Search">
            <input data-var-ui-command-palette-input />
            <div data-var-ui-command-palette-results role="listbox"></div>
        </dialog>
        <script type="application/json" data-var-ui-command-palette-items>
          [
            { "id": "/docs", "title": "Docs", "group": "Docs" },
            { "id": "/button", "title": "Button", "group": "Components" }
          ]
        </script>
      </div>
    `;

    const root = document.getElementById('palette') as HTMLElement;
    initCommandPalette(root);

    const controller = getCommandPaletteController(root);
    expect(controller).toBeTruthy();

    controller?.open();

    const dialog = root.querySelector('dialog');
    expect(dialog?.open).toBe(true);
    expect(root.querySelectorAll('[data-var-ui-command-palette-item]')).toHaveLength(2);
    expect(root.querySelector('.group-heading')?.textContent).toBe('Docs');
    expect(root.querySelector('h2')).toBeNull();

    const body = root.querySelector('[data-var-ui-command-palette-item] > .result-body');
    expect(body?.querySelector('.result-title')?.textContent).toBe('Docs');
  });

  it('does not double-bind handlers', () => {
    document.body.innerHTML = `
      <div
        id="palette"
        data-var-ui-command-palette-root
        data-var-ui-command-palette-id="palette"
        data-var-ui-hotkey="false"
      >
        <dialog data-var-ui-command-palette-dialog aria-label="Search">
            <input data-var-ui-command-palette-input />
            <div data-var-ui-command-palette-results role="listbox"></div>
        </dialog>
        <script type="application/json" data-var-ui-command-palette-items>[]</script>
      </div>
    `;

    const root = document.getElementById('palette') as HTMLElement;
    initCommandPalette(root);
    initCommandPalette(root);

    expect(root.hasAttribute('data-var-ui-command-palette-initialized')).toBe(true);
  });

  it('syncs aria-expanded on the search trigger button and combobox input', () => {
    HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
      this.open = true;
    };
    HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
      this.open = false;
    };

    document.body.innerHTML = `
      <div data-var-ui-search-input data-variant="command" data-var-ui-command-palette="palette">
        <button type="button" data-var-ui-search-input-trigger aria-expanded="false">Search</button>
      </div>
      <div
        id="palette"
        data-var-ui-command-palette-root
        data-var-ui-command-palette-id="palette"
        data-var-ui-hotkey="false"
      >
        <dialog data-var-ui-command-palette-dialog aria-label="Search">
            <input data-var-ui-command-palette-input role="combobox" aria-expanded="false" />
            <div data-var-ui-command-palette-results role="listbox"></div>
        </dialog>
        <script type="application/json" data-var-ui-command-palette-items>[]</script>
      </div>
    `;

    const root = document.getElementById('palette') as HTMLElement;
    const trigger = document.querySelector(
      '[data-var-ui-search-input-trigger]',
    ) as HTMLButtonElement;
    const input = root.querySelector('[data-var-ui-command-palette-input]') as HTMLInputElement;

    initCommandPalette(root);
    getCommandPaletteController(root)?.open();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(input.getAttribute('aria-expanded')).toBe('true');

    getCommandPaletteController(root)?.close();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });
});

describe('command palette results (round 2)', () => {
  function mount(extra = '', items = '[]'): HTMLElement {
    HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
      this.open = true;
    };
    HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
      this.open = false;
    };
    document.body.innerHTML = `
      <div id="p2" data-var-ui-command-palette-root data-var-ui-command-palette-id="p2" data-var-ui-hotkey="false"
        data-var-ui-class-mark="mark" data-var-ui-class-result-icon="result-icon" ${extra}>
        <dialog data-var-ui-command-palette-dialog aria-label="Search">
          <input data-var-ui-command-palette-input />
          <div data-var-ui-command-palette-results role="listbox"></div>
        </dialog>
        <script type="application/json" data-var-ui-command-palette-items>${items}</script>
      </div>`;
    const root = document.getElementById('p2') as HTMLElement;
    initCommandPalette(root);
    getCommandPaletteController(root)?.open();
    return root;
  }

  function type(root: HTMLElement, value: string): HTMLInputElement {
    const input = root.querySelector('input') as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    return input;
  }

  const items = JSON.stringify([
    {
      id: '/docs',
      title: 'Getting started',
      meta: 'Install and set up',
      iconSvg: '<svg data-i></svg>',
    },
    { id: '/button', title: 'Button', meta: 'Actions' },
  ]);

  it('drops aria-activedescendant when nothing matches', () => {
    const root = mount('', items);
    const input = type(root, 'start');
    expect(input.getAttribute('aria-activedescendant')).toBe('var-ui-command-palette-option-p2-0');
    type(root, 'zzz');
    expect(root.querySelector('[data-var-ui-command-palette-empty]')).toBeTruthy();
    expect(input.hasAttribute('aria-activedescendant')).toBe(false);
  });

  it('highlights matched text (escaped) unless highlighting is off', () => {
    const root = mount('', items);
    type(root, 'start');
    expect(root.querySelector('mark.mark')?.textContent).toBe('start');
    const plain = mount('data-var-ui-highlight-matches="false"', items);
    type(plain, 'start');
    expect(plain.querySelector('mark')).toBeNull();
  });

  it('renders the resolved type icon in the icon tile', () => {
    const root = mount('', items);
    const first = root.querySelector('[data-var-ui-command-palette-item]');
    expect(first?.querySelector('.result-icon [data-i]')).toBeTruthy();
  });

  it('lists chosen items under Recent while the query is empty', () => {
    localStorage.removeItem('p2-recent');
    const root = mount('data-var-ui-recent-key="p2-recent"', items);
    expect(root.querySelector('[data-group="recent"]')).toBeNull();
    const button = root.querySelector<HTMLElement>('[data-var-ui-item-id="/button"]')!;
    button.addEventListener('click', (event) => event.preventDefault());
    button.click();
    expect(JSON.parse(localStorage.getItem('p2-recent') ?? '[]')).toEqual(['/button']);
    getCommandPaletteController(root)?.close();
    getCommandPaletteController(root)?.open();
    const recent = root.querySelector('[data-group="recent"]');
    expect(recent?.textContent).toContain('Recent');
    expect(recent?.querySelectorAll('[data-var-ui-command-palette-item]')).toHaveLength(1);
    type(root, 'but');
    expect(root.querySelector('[data-group="recent"]')).toBeNull();
    localStorage.removeItem('p2-recent');
  });

  it('echoes the query in the empty state, adds the hint and flags the frame', () => {
    const root = mount('data-var-ui-empty-hint="Try button"', items);
    const frame = root.querySelector('dialog')!;
    expect(frame.hasAttribute('data-empty')).toBe(false);
    type(root, 'zzz');
    const empty = root.querySelector('[data-var-ui-command-palette-empty]');
    expect(empty?.textContent).toContain('No results for “zzz”');
    expect(empty?.textContent).toContain('Try button');
    expect(frame.hasAttribute('data-empty')).toBe(true);
    type(root, 'but');
    expect(frame.hasAttribute('data-empty')).toBe(false);
  });

  it('names the section of Recent items in their subtitle', () => {
    localStorage.setItem('p3-recent', JSON.stringify(['/t']));
    const root = mount(
      'data-var-ui-recent-key="p3-recent"',
      JSON.stringify([{ id: '/t', title: 'Overview', meta: 'Start here', group: 'Theming' }]),
    );
    const recent = root.querySelector('[data-group="recent"]');
    expect(recent?.textContent).toContain('Theming · Start here');
    localStorage.removeItem('p3-recent');
  });

  const ranked = JSON.stringify([
    {
      id: '/docs/overlays',
      title: 'Overlay lifecycle',
      meta: 'Opens, closes and restores focus for every dialog, popover and trigger button',
      group: 'Docs',
    },
    { id: '/docs/css', title: 'Plain CSS', meta: 'Style a button without JS', group: 'Docs' },
    { id: '/components/button', title: 'Button', meta: 'Actions', group: 'Components' },
  ]);

  function options(root: HTMLElement): HTMLElement[] {
    return [...root.querySelectorAll<HTMLElement>('[data-var-ui-command-palette-item]')];
  }

  it('"but" lists Button first and makes it the active option', () => {
    const root = mount('data-var-ui-class-result-link-active="active"', ranked);
    const input = type(root, 'but');
    const [first] = options(root);
    expect(first?.dataset.varUiItemId).toBe('/components/button');
    expect(first?.getAttribute('aria-selected')).toBe('true');
    expect(first?.classList.contains('active')).toBe(true);
    expect(input.getAttribute('aria-activedescendant')).toBe(first?.id);
  });

  it('shows the highlighted snippet around a description-only match', () => {
    const root = mount('data-var-ui-class-result-meta="result-meta"', ranked);
    type(root, 'butt');
    const overlay = root.querySelector('[data-var-ui-item-id="/docs/overlays"] .result-meta');
    expect(overlay?.textContent?.startsWith('…')).toBe(true);
    expect(overlay?.textContent).toContain('trigger button');
    expect(overlay?.querySelector('mark.mark')?.textContent).toBe('butt');
    // A short description is left whole.
    const css = root.querySelector('[data-var-ui-item-id="/docs/css"] .result-meta');
    expect(css?.textContent).toBe('Style a button without JS');
  });

  it('does not pre-highlight a row on a touch-first device until there is a query', () => {
    const matchMedia = window.matchMedia;
    window.matchMedia = ((query: string) =>
      ({ matches: query.includes('coarse'), media: query }) as MediaQueryList) as typeof matchMedia;
    try {
      const root = mount('', ranked);
      const input = root.querySelector('input')!;
      expect(options(root)).toHaveLength(3);
      expect(options(root).some((el) => el.getAttribute('aria-selected') === 'true')).toBe(false);
      expect(input.hasAttribute('aria-activedescendant')).toBe(false);
      type(root, 'but');
      expect(options(root)[0]?.getAttribute('aria-selected')).toBe('true');
    } finally {
      window.matchMedia = matchMedia;
    }
  });

  it('closes when a result is clicked', () => {
    // With view transitions the palette can live in a persisted element: navigating does not
    // unload it, so a click has to close it the way Enter does.
    const root = mount('', items);
    const button = root.querySelector<HTMLElement>('[data-var-ui-item-id="/button"]')!;
    let navigated = false;
    button.addEventListener('click', (event) => {
      navigated = !event.defaultPrevented;
      event.preventDefault();
    });
    button.click();
    expect(navigated).toBe(true);
    expect(root.querySelector('dialog')!.open).toBe(false);
    expect(root.querySelector('input')!.getAttribute('aria-expanded')).toBe('false');
  });

  it('stays open when a result is opened in a new tab (modifier click)', () => {
    const root = mount('', items);
    const button = root.querySelector<HTMLElement>('[data-var-ui-item-id="/button"]')!;
    button.addEventListener('click', (event) => event.preventDefault());
    button.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true, metaKey: true }),
    );
    expect(root.querySelector('dialog')!.open).toBe(true);
  });

  it('closes from the Cancel button', () => {
    const root = mount();
    const cancel = document.createElement('button');
    cancel.setAttribute('data-var-ui-command-palette-cancel', '');
    root.querySelector('dialog')!.append(cancel);
    // The script binds Cancel at init: mount a fresh palette with the button in place.
    const html = root.outerHTML.replace('data-var-ui-command-palette-initialized=""', '');
    document.body.innerHTML = html;
    const fresh = document.getElementById('p2') as HTMLElement;
    initCommandPalette(fresh);
    getCommandPaletteController(fresh)?.open();
    fresh.querySelector<HTMLElement>('[data-var-ui-command-palette-cancel]')!.click();
    expect(fresh.querySelector('dialog')!.open).toBe(false);
  });
});
