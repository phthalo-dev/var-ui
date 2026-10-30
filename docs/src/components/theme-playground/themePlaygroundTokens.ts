import { designTokens, tokenValues } from '@var-ui/core';
import { generateGeometricScale } from 'typestyles/token-scale';
import { formatColorDefaultValue, formatCssVarName } from '@/lib/color-tokens';
import type {
  ThemePlaygroundColorOverrides,
  ThemePlaygroundSpacingPreset,
  ThemePlaygroundState,
  ThemePlaygroundTypography,
} from './themePlaygroundState';

export type PlaygroundColorField = {
  label: string;
  path: string;
  cssVar: string;
  defaultValue: string;
};

export const PLAYGROUND_COLOR_FIELDS: PlaygroundColorField[] = [
  {
    label: 'Accent',
    path: 'color.tone.accent.foreground',
    cssVar: designTokens.color.tone.accent.foreground.var,
    defaultValue: formatColorDefaultValue(tokenValues.color.tone.accent.foreground),
  },
  {
    label: 'Neutral',
    path: 'color.text.secondary',
    cssVar: designTokens.color.text.secondary.var,
    defaultValue: formatColorDefaultValue(tokenValues.color.text.secondary),
  },
  {
    label: 'Card',
    path: 'color.background.elevated',
    cssVar: designTokens.color.background.elevated.var,
    defaultValue: formatColorDefaultValue(tokenValues.color.background.elevated),
  },
  {
    label: 'Surface',
    path: 'color.background.surface',
    cssVar: designTokens.color.background.surface.var,
    defaultValue: formatColorDefaultValue(tokenValues.color.background.surface),
  },
  {
    label: 'Body',
    path: 'color.background.app',
    cssVar: designTokens.color.background.app.var,
    defaultValue: formatColorDefaultValue(tokenValues.color.background.app),
  },
  {
    label: 'Muted',
    path: 'color.background.muted',
    cssVar: designTokens.color.background.muted.var,
    defaultValue: formatColorDefaultValue(tokenValues.color.background.muted),
  },
  {
    label: 'Text primary',
    path: 'color.text.primary',
    cssVar: designTokens.color.text.primary.var,
    defaultValue: formatColorDefaultValue(tokenValues.color.text.primary),
  },
];

export const FONT_FAMILY_OPTIONS = [
  { value: 'body', label: 'Body' },
  { value: 'display', label: 'Display' },
  { value: 'mono', label: 'Mono' },
] as const;

export const TYPE_SCALE_OPTIONS = [
  { value: '1.125', label: '1.125 — Major second' },
  { value: '1.2', label: '1.200 — Minor third' },
  { value: '1.25', label: '1.250 — Major third' },
  { value: '1.333', label: '1.333 — Perfect fourth' },
] as const;

export const BASE_SIZE_OPTIONS = [
  { value: 'sm', label: 'S' },
  { value: 'md', label: 'M' },
  { value: 'lg', label: 'L' },
  { value: 'xl', label: 'XL' },
] as const;

export const SPACING_PRESET_OPTIONS = [
  { value: 'compact', label: 'Compact' },
  { value: 'default', label: 'Default' },
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'gigantic', label: 'Gigantic' },
] as const;

const BASE_SIZE_PX: Record<ThemePlaygroundTypography['baseSize'], number> = {
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
};

const TYPE_SCALE_RATIO: Record<ThemePlaygroundTypography['typeScale'], number> = {
  '1.125': 1.125,
  '1.2': 1.2,
  '1.25': 1.25,
  '1.333': 1.333,
};

const SPACING_MULTIPLIER: Record<Exclude<ThemePlaygroundSpacingPreset, 'default'>, number> = {
  compact: 0.75,
  comfortable: 1.25,
  gigantic: 1.5,
};

const FONT_SIZE_STEPS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;

const SPACE_STEPS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16, 20] as const;

function spaceStepToPx(value: (typeof tokenValues.space)[(typeof SPACE_STEPS)[number]]): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number.parseFloat(value);
  if (value && typeof value === 'object' && 'var' in value) {
    const tokenVar = (value as { var: unknown }).var;
    if (typeof tokenVar === 'string') return Number.parseFloat(tokenVar);
  }
  return Number.NaN;
}

export function buildFontSizeOverrideVars(
  typography: ThemePlaygroundTypography,
): Record<string, string> {
  const base = BASE_SIZE_PX[typography.baseSize];
  const ratio = TYPE_SCALE_RATIO[typography.typeScale];
  const scale = generateGeometricScale({ base, ratio, steps: [-2, -1, 0, 1, 2, 3, 4] });
  const vars: Record<string, string> = {};

  FONT_SIZE_STEPS.forEach((name, index) => {
    const cssVar = designTokens.fontSize[name].var;
    vars[formatCssVarName(cssVar)] = `${scale[index]}px`;
  });

  return vars;
}

export function buildFontFamilyOverrideVars(
  typography: ThemePlaygroundTypography,
): Record<string, string> {
  const vars: Record<string, string> = {};
  const heading = String(tokenValues.fontFamily[typography.headingFont]);
  const body = String(tokenValues.fontFamily[typography.bodyFont]);

  vars[formatCssVarName(designTokens.fontFamily.display.var)] = heading;
  vars[formatCssVarName(designTokens.fontFamily.body.var)] = body;

  return vars;
}

export function buildSpacingOverrideVars(
  preset: ThemePlaygroundSpacingPreset,
): Record<string, string> {
  if (preset === 'default') return {};

  const multiplier = SPACING_MULTIPLIER[preset];
  const vars: Record<string, string> = {};

  for (const step of SPACE_STEPS) {
    const value = tokenValues.space[step];
    const px = spaceStepToPx(value);
    if (Number.isNaN(px)) continue;
    const cssVar = designTokens.space[step].var;
    vars[formatCssVarName(cssVar)] = `${Math.round(px * multiplier)}px`;
  }

  return vars;
}

export function buildColorOverrideVars(
  colors: ThemePlaygroundColorOverrides,
): Record<string, string> {
  const vars: Record<string, string> = {};

  for (const field of PLAYGROUND_COLOR_FIELDS) {
    const value = colors[field.path];
    if (value) {
      vars[formatCssVarName(field.cssVar)] = value;
    }
  }

  return vars;
}

export function buildPreviewOverrideStyle(state: ThemePlaygroundState): Record<string, string> {
  return {
    colorScheme: 'inherit',
    ...buildColorOverrideVars(state.colors),
    ...buildFontFamilyOverrideVars(state.typography),
    ...buildFontSizeOverrideVars(state.typography),
    ...buildSpacingOverrideVars(state.spacingPreset),
  };
}

function isDefaultTypography(typography: ThemePlaygroundTypography): boolean {
  return (
    typography.headingFont === 'display' &&
    typography.bodyFont === 'body' &&
    typography.typeScale === '1.2' &&
    typography.baseSize === 'md'
  );
}

function nestTokenPath(path: string, value: string, root: Record<string, unknown>): void {
  const parts = path.split('.');
  let node = root;

  for (let index = 0; index < parts.length - 1; index += 1) {
    const key = parts[index];
    const next = node[key];
    if (!next || typeof next !== 'object') {
      node[key] = {};
    }
    node = node[key] as Record<string, unknown>;
  }

  node[parts[parts.length - 1]] = value;
}

export function buildExportTokens(
  state: ThemePlaygroundState,
): Record<string, unknown> | undefined {
  const tokens: Record<string, unknown> = {};

  if (Object.keys(state.colors).length > 0) {
    const color: Record<string, unknown> = {};
    for (const [path, value] of Object.entries(state.colors)) {
      nestTokenPath(path.replace(/^color\./, ''), value, color);
    }
    if (Object.keys(color).length > 0) {
      tokens.color = color;
    }
  }

  if (!isDefaultTypography(state.typography)) {
    tokens.fontFamily = {
      display: tokenValues.fontFamily[state.typography.headingFont],
      body: tokenValues.fontFamily[state.typography.bodyFont],
    };

    const fontSize: Record<string, string> = {};
    const base = BASE_SIZE_PX[state.typography.baseSize];
    const ratio = TYPE_SCALE_RATIO[state.typography.typeScale];
    const scale = generateGeometricScale({ base, ratio, steps: [-2, -1, 0, 1, 2, 3, 4] });
    FONT_SIZE_STEPS.forEach((name, index) => {
      fontSize[name] = `${scale[index]}px`;
    });
    tokens.fontSize = fontSize;
  }

  if (state.spacingPreset !== 'default') {
    const multiplier = SPACING_MULTIPLIER[state.spacingPreset];
    const space: Record<string, string> = {};
    for (const step of SPACE_STEPS) {
      const value = tokenValues.space[step];
      const px = spaceStepToPx(value);
      if (!Number.isNaN(px)) {
        space[step] = `${Math.round(px * multiplier)}px`;
      }
    }
    tokens.space = space;
  }

  return Object.keys(tokens).length > 0 ? tokens : undefined;
}

export function hasTokenOverrides(state: ThemePlaygroundState): boolean {
  return buildExportTokens(state) !== undefined;
}

export function formatTokensLiteral(value: unknown, indent = 2): string {
  const pad = ' '.repeat(indent);
  const innerPad = ' '.repeat(indent + 2);

  if (typeof value === 'string') {
    return `'${value.replace(/'/g, "\\'")}'`;
  }

  if (!value || typeof value !== 'object') {
    return String(value);
  }

  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length === 0) return '{}';

  const lines = entries.map(([key, child]) => {
    const formatted = formatTokensLiteral(child, indent + 2);
    const needsBlock = formatted.includes('\n');
    return needsBlock ? `${innerPad}${key}: ${formatted},` : `${innerPad}${key}: ${formatted},`;
  });

  return `{\n${lines.join('\n')}\n${pad}}`;
}
