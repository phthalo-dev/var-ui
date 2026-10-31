import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { field } from '../../src/components/field';
import { combobox } from '../../src/components/combobox';
import { multiSelector } from '../../src/components/multiSelector';
import { select } from '../../src/components/select';
import { textAreaField } from '../../src/components/textAreaField';
import { textField } from '../../src/components/textField';

describe('field recipe', () => {
  it('registers root/label/description/error slots', () => {
    field();
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-field');
    expect(css).toContain('.var-ui-field__label');
    expect(css).toContain('.var-ui-field__description');
    expect(css).toContain('.var-ui-field__error');
  });

  it('keeps textField public class names stable after fieldChrome refactor', () => {
    textField();
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-text-field');
    expect(css).toContain('.var-ui-text-field__label');
    expect(css).toContain('.var-ui-text-field__input');
    expect(css).toContain('.var-ui-text-field__description');
    expect(css).toContain('.var-ui-text-field__error');
  });

  it('keeps textAreaField and select class names stable', () => {
    textAreaField();
    select();
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-text-area-field');
    expect(css).toContain('.var-ui-text-area-field__label');
    expect(css).toContain('.var-ui-text-area-field__input');
    expect(css).toContain('.var-ui-text-area-field__description');
    expect(css).toContain('.var-ui-text-area-field__error');
    expect(css).toContain('.var-ui-select');
    expect(css).toContain('.var-ui-select__label');
    expect(css).toContain('.var-ui-select__trigger');
    expect(css).toContain('.var-ui-select__selectValue');
    expect(css).toContain('.var-ui-select__popover');
    expect(css).toContain('.var-ui-select__listbox');
    expect(css).toContain('.var-ui-select__item');
  });

  it('registers shared dropdown popover slots on combobox and multiSelector', () => {
    combobox();
    multiSelector();
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-combobox__popover');
    expect(css).toContain('.var-ui-combobox__listbox');
    expect(css).toContain('.var-ui-multiSelector__popover');
    expect(css).toContain('.var-ui-multiSelector__listbox');
    expect(css).toContain('anchor-size(width)');
  });

  it('declares dropdown popover vars on the popover slot for portaled listboxes', () => {
    select();
    const css = getRegisteredCss();
    expect(css).toMatch(/\.var-ui-select__popover \{[^}]*--var-ui-select-itemfocusedbackground:/);
    expect(css).toMatch(/\.var-ui-select__item\[data-hovered\][^{]*\{[^}]*background-color:/);
  });
});
