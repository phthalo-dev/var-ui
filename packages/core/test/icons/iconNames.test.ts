import { describe, expect, it } from 'vite-plus/test';
import { iconNameList } from '../../src/icons/iconNames';

// The list is checked against the glyphs themselves in `@var-ui/icons` (`generated.test.ts`).
describe('iconNameList', () => {
  it('has unique camelCase names', () => {
    expect(new Set(iconNameList).size).toBe(iconNameList.length);
    for (const name of iconNameList) expect(name).toMatch(/^[a-z][a-zA-Z0-9]*$/);
  });
});
