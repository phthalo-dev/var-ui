import { describe, expect, it } from 'vite-plus/test';
import { getAstroComponentDoc, hasAstroBinding } from './astro-component-docs';

describe('astro-component-docs', () => {
  it('detects Astro bindings by slug', () => {
    expect(hasAstroBinding('button')).toBe(true);
    expect(hasAstroBinding('empty-state')).toBe(true);
    expect(hasAstroBinding('dialog')).toBe(false);
    expect(hasAstroBinding('chat-message')).toBe(false);
  });

  it('extracts Button Props and default slot from the recipe schema', () => {
    const doc = getAstroComponentDoc('button');
    expect(doc?.componentName).toBe('Button');
    expect(doc?.props.map((p) => p.name)).toEqual(
      expect.arrayContaining(['tone', 'appearance', 'size', 'className', 'type', 'disabled']),
    );
    expect(doc?.props.find((p) => p.name === 'intent')).toBeUndefined();
    expect(doc?.props.find((p) => p.name === 'size')?.type).toBe("'sm' | 'md' | 'lg'");
    expect(doc?.props.find((p) => p.name === 'elevated')?.type).toBe('boolean');
    expect(doc?.slots.some((s) => s.name === 'default')).toBe(true);
  });

  it('reads avatar size options from the shared size axis', () => {
    const doc = getAstroComponentDoc('avatar');
    expect(doc?.props.find((p) => p.name === 'size')?.type).toBe(
      "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
    );
  });

  it('extracts EmptyState named slots', () => {
    const doc = getAstroComponentDoc('empty-state');
    expect(doc?.slots.map((s) => s.name).sort()).toEqual(['action', 'icon'].sort());
    expect(doc?.props.find((p) => p.name === 'title')?.required).toBe(true);
  });
});
