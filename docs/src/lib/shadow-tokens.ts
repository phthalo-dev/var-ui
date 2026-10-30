import { designTokens, tokenValues } from '@var-ui/core';
import { formatCssVarName } from './color-tokens';

export type ShadowSwatch = {
  group: 'box';
  token: string;
  cssVar: string;
  defaultValue: string;
};

type TokenRef = { var: string };

function isTokenRef(value: unknown): value is TokenRef {
  return Boolean(value && typeof value === 'object' && 'var' in value);
}

function walkShadowTokens(
  values: Record<string, unknown>,
  refs: Record<string, unknown>,
  path: string[] = [],
): ShadowSwatch[] {
  const results: ShadowSwatch[] = [];

  for (const [key, value] of Object.entries(values)) {
    const ref = refs[key];

    if (typeof value === 'string' && isTokenRef(ref)) {
      const tokenPath = [...path, key].join('.');
      results.push({
        group: 'box',
        token: `shadow.${tokenPath}`,
        cssVar: ref.var,
        defaultValue: value,
      });
      continue;
    }

    if (value && typeof value === 'object' && ref && typeof ref === 'object') {
      results.push(
        ...walkShadowTokens(value as Record<string, unknown>, ref as Record<string, unknown>, [
          ...path,
          key,
        ]),
      );
    }
  }

  return results;
}

export function getShadowSwatches(): ShadowSwatch[] {
  return walkShadowTokens(
    tokenValues.shadow as Record<string, unknown>,
    designTokens.shadow as Record<string, unknown>,
  );
}

export function groupShadowSwatches(
  swatches: ShadowSwatch[],
): Map<ShadowSwatch['group'], ShadowSwatch[]> {
  const groups = new Map<ShadowSwatch['group'], ShadowSwatch[]>();

  for (const swatch of swatches) {
    const items = groups.get(swatch.group) ?? [];
    items.push(swatch);
    groups.set(swatch.group, items);
  }

  return groups;
}

export { formatCssVarName };
