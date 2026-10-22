import type { ComponentAttrsResult } from 'typestyles';
import * as core from '@var-ui/core';

export type HtmlAttrDoc = {
  name: string;
  example?: string;
  description?: string;
};

export type HtmlPartDoc = {
  part: string;
  className?: string;
  attributes: HtmlAttrDoc[];
};

export type HtmlApiDoc = {
  recipeName: string;
  parts: HtmlPartDoc[];
  note?: string;
};

function slugToCamel(slug: string): string {
  return slug.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

function asAttrsResult(value: unknown): ComponentAttrsResult | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  if (typeof record.className === 'string' || record.attrs) {
    return value as ComponentAttrsResult;
  }
  return null;
}

function attrsFromResult(result: ComponentAttrsResult): HtmlAttrDoc[] {
  const attrs = (result.attrs ?? {}) as Record<string, string>;
  return Object.entries(attrs).map(([name, example]) => ({
    name,
    example: example === '' ? '(present)' : String(example),
    description: 'Recipe variant / state attribute from `@var-ui/core`.',
  }));
}

function partsFromRecipeResult(result: unknown): HtmlPartDoc[] {
  if (typeof result === 'string') {
    return [{ part: 'root', className: result, attributes: [] }];
  }

  const simple = asAttrsResult(result);
  if (simple) {
    return [
      {
        part: 'root',
        className: typeof simple.className === 'string' ? simple.className : String(simple),
        attributes: attrsFromResult(simple),
      },
    ];
  }

  if (!result || typeof result !== 'object') return [];

  const parts: HtmlPartDoc[] = [];
  for (const [part, value] of Object.entries(result as Record<string, unknown>)) {
    if (typeof value === 'string') {
      parts.push({ part, className: value, attributes: [] });
      continue;
    }

    const slot = asAttrsResult(value);
    if (!slot) continue;
    parts.push({
      part,
      className:
        typeof slot.className === 'string'
          ? slot.className
          : typeof slot.toString === 'function'
            ? String(slot)
            : undefined,
      attributes: attrsFromResult(slot),
    });
  }

  return parts;
}

function resolveRecipe(slug: string): { recipeName: string; result: unknown } | null {
  const camel = slugToCamel(slug);
  const candidates = [camel, slug];

  // Known aliases where export name ≠ slug camelCase
  if (slug === 'clickable-card') candidates.unshift('card');
  if (slug === 'text') candidates.unshift('textBlock');
  if (slug === 'link') {
    const link = (core as Record<string, unknown>).link;
    if (typeof link === 'string') {
      return {
        recipeName: 'link',
        result: { className: link, attrs: {} },
      };
    }
  }

  for (const name of candidates) {
    const recipe = (core as Record<string, unknown>)[name];
    if (typeof recipe !== 'function') continue;
    try {
      return { recipeName: name, result: recipe({}) };
    } catch {
      continue;
    }
  }

  return null;
}

/** Public class names / data attributes for HTML framework docs. */
export function getHtmlApiDoc(slug: string): HtmlApiDoc | null {
  const resolved = resolveRecipe(slug);
  if (!resolved) return null;

  const parts = partsFromRecipeResult(resolved.result).filter(
    (part) => part.className || part.attributes.length > 0,
  );

  if (parts.length === 0) return null;

  return {
    recipeName: resolved.recipeName,
    parts,
    note: 'Apply via `mergeProps(recipe(…))` or copy the class / data attributes onto your markup.',
  };
}
