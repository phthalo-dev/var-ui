import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import '../src/styles';
import { checkbox } from '../src/components/checkbox';
import { chip } from '../src/components/chip';
import { colorPicker } from '../src/components/colorPicker';
import { button } from '../src/components/button';

describe('P4 sweep (accordionGroup..combobox)', () => {
  it('emits forced-colors rules for checkbox, chip, button and picker swatches', () => {
    checkbox({});
    chip({});
    button({});
    colorPicker({});
    const css = getRegisteredCss();
    expect(css).toMatch(/forced-colors: active[\s\S]*?Highlight/);
    expect(css).toMatch(/forced-color-adjust: none/);
    expect(css).toMatch(/GrayText/);
  });

  it('button no longer carries time literals', () => {
    button({});
    expect(getRegisteredCss()).not.toMatch(/background-color 140ms/);
  });
});
