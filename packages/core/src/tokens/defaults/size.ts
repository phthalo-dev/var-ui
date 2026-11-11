import type { DesignTokens } from '../types';

export const size = {
  control: { xs: '1.25rem', sm: '1.75rem', md: '2rem', lg: '2.25rem', xl: '3.5rem' },
  icon: { sm: '0.875rem', md: '1rem', lg: '1.25rem' },
  field: { minWidth: '15rem', minWidthCompact: '10rem' },
  panel: { xs: '12rem', sm: '17.5rem', md: '20rem', lg: '25rem', xl: '30rem', xxl: '35rem' },
  indicator: {
    box: { sm: '0.875rem', md: '1.125rem', lg: '1.375rem' },
    dot: { sm: '0.375rem', md: '0.5rem', lg: '0.625rem' },
    trackWidth: { sm: '2rem', md: '2.5rem', lg: '3rem' },
    trackHeight: { sm: '1.25rem', md: '1.5rem', lg: '1.75rem' },
  },
  media: { sm: '3rem', md: '4rem', lg: '6rem' },
  nav: { bar: '3.5rem' },
} satisfies DesignTokens['size'];
