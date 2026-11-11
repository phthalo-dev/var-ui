import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { checkbox } from '../../src/components/checkbox';
import { colorPicker } from '../../src/components/colorPicker';
import { dateInput } from '../../src/components/dateInput';
import { dateRangeInput } from '../../src/components/dateRangeInput';
import { dateTimeInput } from '../../src/components/dateTimeInput';
import { fileInput } from '../../src/components/fileInput';
import { multiSelector } from '../../src/components/multiSelector';
import { radio } from '../../src/components/radio';
import { slider } from '../../src/components/slider';
import { switchStyles } from '../../src/components/switch';
import { textAreaField } from '../../src/components/textAreaField';
import { timeInput } from '../../src/components/timeInput';
import { tokenizer } from '../../src/components/tokenizer';

const sizes = ['sm', 'md', 'lg'] as const;

/** Declarations of `.{selector}[data-size="{size}"]`. */
function rule(selector: string, size: string): string {
  const css = getRegisteredCss();
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`\\.${escaped}\\[data-size="${size}"\\]\\s*\\{([^}]*)\\}`));
  return match?.[1] ?? '';
}

describe('control size variants', () => {
  it.each([
    ['text-area-field__input', textAreaField],
    ['multiSelector__trigger', multiSelector],
    ['tokenizer__input', tokenizer],
    ['dateInput__segment', dateInput],
    ['dateRangeInput__segment', dateRangeInput],
    ['dateTimeInput__segment', dateTimeInput],
    ['timeInput__segment', timeInput],
  ] as const)('%s takes text-field type at each size', (slot, recipe) => {
    recipe();
    expect(rule(`var-ui-${slot}`, 'sm')).toMatch(/font-size:\s*var\(--var-ui-fontSize-sm\)/);
    expect(rule(`var-ui-${slot}`, 'md')).toMatch(/font-size:\s*var\(--var-ui-fontSize-md\)/);
    expect(rule(`var-ui-${slot}`, 'lg')).toMatch(/font-size:\s*var\(--var-ui-fontSize-lg\)/);
  });

  it.each([
    ['multiSelector__trigger', multiSelector],
    ['dateInput__group', dateInput],
    ['dateRangeInput__group', dateRangeInput],
    ['dateTimeInput__group', dateTimeInput],
    ['timeInput__group', timeInput],
  ] as const)('%s is a fixed-height control surface', (slot, recipe) => {
    recipe();
    for (const size of sizes) {
      expect(rule(`var-ui-${slot}`, size)).toMatch(
        new RegExp(`height:\\s*var\\(--var-ui-size-control-${size}\\)`),
      );
    }
  });

  it('tokenizer grows from the control height', () => {
    tokenizer();
    for (const size of sizes) {
      expect(rule('var-ui-tokenizer__group', size)).toMatch(
        new RegExp(`min-height:\\s*var\\(--var-ui-size-control-${size}\\)`),
      );
    }
  });

  it('checkbox and radio scale the indicator box, label and gap', () => {
    checkbox();
    radio();
    for (const size of sizes) {
      const box = new RegExp(`width:\\s*var\\(--var-ui-size-indicator-box-${size}\\)`);
      expect(rule('var-ui-checkbox__box', size)).toMatch(box);
      expect(rule('var-ui-radio__control', size)).toMatch(box);
    }
    expect(rule('var-ui-checkbox__label', 'lg')).toMatch(
      /font-size:\s*var\(--var-ui-fontSize-lg\)/,
    );
    expect(rule('var-ui-radio__item', 'sm')).toMatch(/gap:\s*var\(--var-ui-space-xxs\)/);
  });

  it('switch sizes the track and thumb from indicator tokens', () => {
    switchStyles();
    expect(rule('var-ui-switch', 'sm')).toMatch(/--var-ui-size-indicator-trackWidth-sm/);
    expect(rule('var-ui-switch', 'lg')).toMatch(/--var-ui-size-indicator-trackHeight-lg/);
    expect(rule('var-ui-switch', 'lg')).toMatch(/--var-ui-size-indicator-box-lg/);
  });

  it('slider sizes the thumb on the control row', () => {
    slider();
    expect(rule('var-ui-slider__control', 'sm')).toMatch(/--var-ui-size-icon-sm/);
    expect(rule('var-ui-slider__control', 'lg')).toMatch(/--var-ui-size-icon-lg/);
  });

  it('color picker and file input scale per size', () => {
    colorPicker();
    fileInput();
    expect(rule('var-ui-color-picker', 'sm')).not.toBe('');
    expect(rule('var-ui-color-picker', 'lg')).not.toBe('');
    expect(rule('var-ui-file-input__placeholderText', 'lg')).toMatch(
      /font-size:\s*var\(--var-ui-fontSize-md\)/,
    );
  });
});
