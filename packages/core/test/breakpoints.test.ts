import { describe, expect, it } from 'vite-plus/test';
import { appShellMobileBreakpointQueries } from '../src/components/breakpoints';

describe('appShellMobileBreakpointQueries', () => {
  it('derives max-width matchMedia conditions from TypeStyles breakpoints', () => {
    expect(appShellMobileBreakpointQueries).toEqual({
      sm: '(max-width: 40rem)',
      md: '(max-width: 48rem)',
      lg: '(max-width: 64rem)',
      none: 'not all',
    });
  });
});
