import { describe, expect, it } from 'vite-plus/test';
import { componentRegistry } from '../data/components';
import { getHtmlApiDoc } from './html-api-docs';

describe('html-api-docs', () => {
  it('documents button class and data attributes', () => {
    const doc = getHtmlApiDoc('button');
    expect(doc?.recipeName).toBe('button');
    expect(doc?.parts[0]?.className).toBe('var-ui-button');
    const names = doc?.parts[0]?.attributes.map((a) => a.name) ?? [];
    expect(names).toEqual(
      expect.arrayContaining(['data-tone', 'data-appearance', 'data-size', 'data-layout']),
    );
  });

  it('documents compound alert parts', () => {
    const doc = getHtmlApiDoc('alert');
    expect(doc?.parts.some((p) => p.part === 'root' && p.className === 'var-ui-alert')).toBe(true);
    expect(doc?.parts.some((p) => p.part === 'title')).toBe(true);
  });

  it('documents card string slot class names', () => {
    const doc = getHtmlApiDoc('card');
    expect(doc?.recipeName).toBe('card');
    expect(doc?.parts.some((p) => p.part === 'root' && p.className === 'var-ui-card')).toBe(true);
    expect(doc?.parts.some((p) => p.part === 'title' && p.className === 'var-ui-card__title')).toBe(
      true,
    );
  });

  it('documents carousel compound string slots', () => {
    const doc = getHtmlApiDoc('carousel');
    expect(doc?.parts.some((p) => p.part === 'viewport' && p.className?.includes('carousel'))).toBe(
      true,
    );
    expect(doc?.parts.some((p) => p.part === 'item')).toBe(true);
  });

  it('documents text block string parts', () => {
    const doc = getHtmlApiDoc('text');
    expect(doc?.recipeName).toBe('textBlock');
    expect(doc?.parts.length).toBeGreaterThan(0);
    expect(doc?.parts.some((p) => p.className?.includes('var-ui-text-block'))).toBe(true);
  });

  it('covers most component slugs with HTML class tables', () => {
    const slugs = componentRegistry.map((entry) => entry.slug);
    const withTable = slugs.filter((slug) => getHtmlApiDoc(slug) !== null);
    // Was 22/41 before string-slot handling; remaining gaps are export-name aliases.
    expect(withTable.length).toBeGreaterThanOrEqual(36);
  });

  it('returns null for unknown slugs', () => {
    expect(getHtmlApiDoc('not-a-real-component')).toBeNull();
  });
});
