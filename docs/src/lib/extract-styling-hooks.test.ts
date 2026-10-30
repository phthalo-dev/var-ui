import { beforeAll, describe, expect, it } from 'vite-plus/test';
import { componentRegistry } from '../data/components';
import { extractAllStylingHooks, type StylingHooksDoc } from './extract-styling-hooks';

let docs: Record<string, StylingHooksDoc>;

beforeAll(async () => {
  docs = await extractAllStylingHooks();
}, 60_000);

async function all() {
  return docs;
}

describe('extract-styling-hooks', () => {
  it('Button: variant axes with real attribute names and variables with defaults', async () => {
    const button = (await all()).button!;
    expect(button.slots).toEqual([{ recipe: 'button', slot: 'base', className: 'var-ui-button' }]);
    const tone = button.axes.find((a) => a.name === 'tone')!;
    expect(tone.attribute).toBe('data-tone');
    expect(tone.options).toEqual(expect.arrayContaining(['neutral', 'accent', 'danger']));
    expect(tone.default).toBe('neutral');
    expect(button.axes.find((a) => a.name === 'elevated')).toMatchObject({
      attribute: 'data-elevated',
      kind: 'boolean',
    });
    const background = button.vars.find((v) => v.name === '--var-ui-button-background')!;
    expect(background.syntax).toBe('<color>');
    expect(background.defaultValue).toContain('var(--var-ui-color');
    expect(background.controls).toContain('background-color');
    expect(button.starter).toMatch(
      /^\.var-ui-button\[data-\w+='[\w-]+'\] \{\n {2}--var-ui-button-/,
    );
  });

  it('Dialog: one class per slot, BEM-style', async () => {
    const dialog = (await all()).dialog!;
    const classes = Object.fromEntries(dialog.slots.map((s) => [s.slot, s.className]));
    expect(classes).toMatchObject({
      overlay: 'var-ui-dialog__overlay',
      modal: 'var-ui-dialog__modal',
      closeButton: 'var-ui-dialog__closeButton',
    });
  });

  it('state attributes come from the CSS the library ships, with the slot they apply to', async () => {
    const dialog = (await all()).dialog!;
    const starting = dialog.states.find((s) => s.attribute === 'data-starting-style')!;
    expect(starting.slots).toEqual(expect.arrayContaining(['overlay', 'modal']));
    const table = (await all()).table!;
    expect(table.states.find((s) => s.attribute === 'data-align')?.values).toContain('end');
    const tabs = (await all()).tabs!;
    expect(tabs.states.find((s) => s.attribute === 'data-selected')?.slots).toContain('tab');
    // Variant axes are not repeated as state.
    expect(tabs.states.some((s) => tabs.axes.some((a) => a.attribute === s.attribute))).toBe(false);
  });

  it('every documented component with a recipe has at least one slot class', async () => {
    const result = await all();
    const withHooks = componentRegistry.filter((c) => result[c.slug]);
    expect(withHooks.length).toBeGreaterThan(80);
    for (const { slug } of withHooks) {
      expect(result[slug]!.slots.length, slug).toBeGreaterThan(0);
      for (const slot of result[slug]!.slots) expect(slot.className).toMatch(/^var-ui-/);
    }
    for (const slug of ['button', 'text-field', 'dialog', 'table', 'tabs', 'select', 'card']) {
      expect(result[slug], slug).toBeDefined();
    }
  });
});
