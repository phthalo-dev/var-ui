import type { ThemePlaygroundState } from './themePlaygroundState';
import type { ShowcaseThemeId } from '@/themes/presets';
import { buildExportTokens, formatTokensLiteral, hasTokenOverrides } from './themePlaygroundTokens';

const PRESET_EXPORTS: Record<
  Exclude<ShowcaseThemeId, 'default'>,
  { preset: string; name: string }
> = {
  forest: { preset: 'forestPreset', name: 'forest' },
  rose: { preset: 'rosePreset', name: 'rose' },
  amber: { preset: 'amberPreset', name: 'amber' },
  'ai-glow': { preset: 'aiGlowPreset', name: 'ai-glow' },
  'new-wave': { preset: 'newWavePreset', name: 'new-wave' },
  'windows-95': { preset: 'windows95Preset', name: 'windows-95' },
  'classic-system': { preset: 'classicSystemPreset', name: 'classic-system' },
};

function exportThemeName(presetId: ShowcaseThemeId): string {
  if (presetId === 'default') return 'my-theme';
  return PRESET_EXPORTS[presetId].name;
}

function exportConstName(presetId: ShowcaseThemeId): string {
  const name = exportThemeName(presetId);
  return `${name.replace(/-/g, '')}Theme`;
}

export function generateThemeCode(state: ThemePlaygroundState): {
  code: string;
  language: string;
  filename: string;
} {
  const tokens = buildExportTokens(state);
  const overrides = hasTokenOverrides(state);

  if (state.presetId === 'default' && !overrides) {
    return {
      code: `import { defaultThemeClassName } from '@var-ui/core';

// Default theme is registered when you import '@var-ui/core'.
// Apply to your app root:
export const themeClassName = defaultThemeClassName;`,
      language: 'ts',
      filename: 'theme.ts',
    };
  }

  const themeName = exportThemeName(state.presetId);
  const constName = exportConstName(state.presetId);

  if (state.presetId === 'default') {
    const tokensLiteral = formatTokensLiteral(tokens);
    return {
      code: `import { createDesignTheme } from '@var-ui/core';

export const ${constName} = createDesignTheme({
  name: '${themeName}',
  tokens: ${tokensLiteral},
});`,
      language: 'ts',
      filename: 'theme.ts',
    };
  }

  const entry = PRESET_EXPORTS[state.presetId];
  const importPath = `./themes/${entry.name}`;
  const configLines = [`  name: '${entry.name}',`, `  from: ${entry.preset},`];
  if (tokens) {
    configLines.push(`  tokens: ${formatTokensLiteral(tokens)},`);
  }

  return {
    code: `import { createDesignTheme } from '@var-ui/core';
import { ${entry.preset} } from '${importPath}';

export const ${constName} = createDesignTheme({
${configLines.join('\n')}
});`,
    language: 'ts',
    filename: 'theme.ts',
  };
}
