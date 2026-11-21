import type { DesignTokens } from '../types';

export const lineHeight = {
  tight: '1.25',
  normal: '1.5',
  relaxed: '1.625',
  /** 16/26 body, 19/28 lead, 44/48, 28/34 and 20/28 headings. */
  prose: {
    body: '1.625rem',
    lead: '1.75rem',
    h1: '3rem',
    h2: '2.125rem',
    h3: '1.75rem',
  },
} satisfies DesignTokens['lineHeight'];
