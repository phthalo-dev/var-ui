import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import '../../src/styles';
import { searchInput } from '../../src/components/searchInput';
import { breakpoint } from '../../src/runtime';

describe('searchInput command compact CSS', () => {
  it('collapses command-trigger chrome below the xl breakpoint', () => {
    searchInput({ variant: 'command' });
    const css = getRegisteredCss();
    const belowXl = breakpoint('xl', 'max');

    expect(css).toContain(belowXl);
    expect(css).toMatch(/aspect-ratio:\s*1\s*\/\s*1/);
    expect(css).toContain('.var-ui-search-input__triggerLabel');
    expect(css).toContain('.var-ui-search-input__shortcut');
  });
});
