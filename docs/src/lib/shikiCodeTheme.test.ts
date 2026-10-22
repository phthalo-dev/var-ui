import { describe, expect, it } from 'vite-plus/test';
import { designTokens as t } from '@var-ui/core';
import { designTokenShikiTheme } from '@var-ui/docs/shiki';

describe('designTokenShikiTheme', () => {
  it('references semantic color.code CSS variables', () => {
    expect(designTokenShikiTheme.colors['editor.foreground']).toBe(t.color.code.base.var);
    expect(
      designTokenShikiTheme.tokenColors.some(
        (rule) => rule.settings.foreground === t.color.code.keyword.var,
      ),
    ).toBe(true);
    expect(
      designTokenShikiTheme.tokenColors.some(
        (rule) => rule.settings.foreground === t.color.code.string.var,
      ),
    ).toBe(true);
  });

  it('maps diff tokens to addition/deletion colors', () => {
    const addition = designTokenShikiTheme.tokenColors.find(
      (rule) => Array.isArray(rule.scope) && rule.scope.includes('markup.inserted'),
    );
    expect(addition?.settings.foreground).toBe(t.color.code.addition.var);
    expect(addition?.settings.background).toBe(t.color.code.additionBackground.var);
  });
});
