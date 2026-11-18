import { describe, expect, it } from 'vite-plus/test';
import { clampWords } from './clamp-words';

describe('clampWords', () => {
  it('keeps short text as is', () => {
    expect(clampWords('Triggers an action.', 40)).toBe('Triggers an action.');
  });

  it('cuts on a word boundary and trims trailing punctuation', () => {
    expect(clampWords('Action menu namespace — compound Trigger parts', 24)).toBe(
      'Action menu namespace…',
    );
  });
});
