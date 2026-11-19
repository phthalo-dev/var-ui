import { getRegisteredCss } from 'typestyles';
import { listDesignTokens, type ModeAwareTokenValue } from '@var-ui/core';

export type CssVariableEntry = {
  /** Dot path for design tokens (e.g. `space.md`, `color.tone.accent.foreground`). */
  tokenPath: string;
  cssVar: string;
  defaultValue?: string;
};

export type CssVariableGroup = {
  namespace: string;
  label: string;
  entries: CssVariableEntry[];
};

export type TokenReferenceRow = {
  id: string;
  kind: 'design' | 'component';
  namespace: string;
  tokenPath: string;
  cssVar: string;
  defaultValue: string | null;
};

const DESIGN_TOKEN_NAMESPACE_LABELS: Record<string, string> = {
  space: 'Space',
  size: 'Size',
  opacity: 'Opacity',
  letterSpacing: 'Letter spacing',
  radius: 'Radius',
  borderWidth: 'Border width',
  fontFamily: 'Font family',
  fontSize: 'Font size',
  fontWeight: 'Font weight',
  lineHeight: 'Line height',
  shadow: 'Shadow',
  duration: 'Duration',
  easing: 'Easing',
  transition: 'Transition',
  breakpoint: 'Breakpoint',
  zIndex: 'Z-index',
  stroke: 'Stroke',
  color: 'Color',
};

const COMPONENT_NAMESPACE_LABELS: Record<string, string> = {
  'docs-prose': 'Prose (docs)',
};

function formatModeAwareColorDefault(value: ModeAwareTokenValue): string {
  const light = value.light != null ? String(value.light) : undefined;
  const dark = value.dark != null ? String(value.dark) : undefined;
  if (light && dark && light !== dark) return `${light} / ${dark}`;
  return light ?? dark ?? '';
}

export function formatCssVarName(cssVar: string): string {
  return cssVar.replace(/^var\((.+)\)$/, '$1');
}

function groupEntries(
  entries: CssVariableEntry[],
  labelMap: Record<string, string>,
): CssVariableGroup[] {
  const groups = new Map<string, CssVariableEntry[]>();

  for (const entry of entries) {
    const namespace = entry.tokenPath.split('.')[0] ?? 'other';
    const items = groups.get(namespace) ?? [];
    items.push(entry);
    groups.set(namespace, items);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([namespace, groupEntries]) => ({
      namespace,
      label: labelMap[namespace] ?? namespace,
      entries: groupEntries.sort((a, b) => a.tokenPath.localeCompare(b.tokenPath)),
    }));
}

/** Built-in design tokens (`listDesignTokens` from core), grouped by namespace. */
export function getDesignTokenVariables(): CssVariableGroup[] {
  const entries = listDesignTokens().map((token) => ({
    tokenPath: token.path,
    cssVar: token.cssVar,
    defaultValue:
      typeof token.value === 'object'
        ? formatModeAwareColorDefault(token.value)
        : String(token.value),
  }));
  return groupEntries(entries, DESIGN_TOKEN_NAMESPACE_LABELS);
}

/** Flat rows for interactive token tables (design + component variables). */
export function flattenTokenReferenceRows(): TokenReferenceRow[] {
  const designRows = getDesignTokenVariables().flatMap((group) =>
    group.entries.map((entry) => ({
      id: `design:${entry.tokenPath}`,
      kind: 'design' as const,
      namespace: group.label,
      tokenPath: entry.tokenPath,
      cssVar: entry.cssVar,
      defaultValue: entry.defaultValue ?? null,
    })),
  );

  const componentRows = getComponentCssVariables().flatMap((group) =>
    group.entries.map((entry) => ({
      id: `component:${group.namespace}:${entry.tokenPath}`,
      kind: 'component' as const,
      namespace: group.label,
      tokenPath: entry.tokenPath,
      cssVar: entry.cssVar,
      defaultValue: entry.defaultValue ?? null,
    })),
  );

  return [...designRows, ...componentRows];
}

function extractCssVarNames(css: string): string[] {
  return [...new Set(css.match(/--var-ui-[a-zA-Z0-9-]+/g) ?? [])].sort();
}

function extractComponentNamespaces(css: string): string[] {
  const namespaces = new Set<string>();

  for (const match of css.matchAll(/\.var-ui-([a-z0-9-]+)\s*\{[^}]*--var-ui-/g)) {
    namespaces.add(match[1]);
  }

  return [...namespaces].sort((a, b) => b.length - a.length);
}

function componentNamespaceForVar(varName: string, namespaces: readonly string[]): string {
  for (const namespace of namespaces) {
    const prefix = `--var-ui-${namespace}`;
    if (varName === prefix || varName.startsWith(`${prefix}`)) {
      return namespace;
    }
  }

  return 'other';
}

function componentVarLabel(namespace: string, cssVar: string): string {
  const prefix = `--var-ui-${namespace}`;
  const suffix = cssVar.startsWith(prefix) ? cssVar.slice(prefix.length) : cssVar;
  return suffix.replace(/^-/, '') || namespace;
}

/** Component-scoped CSS variables registered by recipes (`c.vars()`). */
export function getComponentCssVariables(): CssVariableGroup[] {
  const css = getRegisteredCss();
  const designVarSet = new Set(listDesignTokens().map((token) => token.cssVar));
  const componentVars = extractCssVarNames(css).filter((varName) => !designVarSet.has(varName));
  const namespaces = extractComponentNamespaces(css);

  const groups = new Map<string, CssVariableEntry[]>();

  for (const cssVar of componentVars) {
    const namespace = componentNamespaceForVar(cssVar, namespaces);
    const entry: CssVariableEntry = {
      tokenPath: componentVarLabel(namespace, cssVar),
      cssVar,
    };
    const items = groups.get(namespace) ?? [];
    items.push(entry);
    groups.set(namespace, items);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([namespace, entries]) => ({
      namespace,
      label: COMPONENT_NAMESPACE_LABELS[namespace] ?? namespace,
      entries: entries.sort((a, b) => a.cssVar.localeCompare(b.cssVar)),
    }));
}
