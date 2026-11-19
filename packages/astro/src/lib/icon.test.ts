import { describe, expect, it } from 'vite-plus/test';
import { svg as checkSvg } from '@var-ui/icons/glyphs/check';
import { iconMarkup } from './icon';

describe('iconMarkup', () => {
  it('resolves registry names and passes markup through', () => {
    expect(iconMarkup('check')).toBe(checkSvg);
    expect(iconMarkup({ svg: '<svg data-x></svg>' })).toBe('<svg data-x></svg>');
  });

  it('throws with the valid names on an unknown icon', () => {
    expect(() => iconMarkup('nope' as never)).toThrow(/Unknown icon "nope".*check/);
  });
});
