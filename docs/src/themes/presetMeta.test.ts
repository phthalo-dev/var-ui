import { describe, expect, it } from 'vite-plus/test';
import { docsThemePresetMeta } from './presetMeta';
import { docsThemePresets } from './presets';

describe('docsThemePresetMeta', () => {
  it('matches the theme modules (ids, labels, class names, order)', () => {
    expect(
      docsThemePresetMeta.map(({ id, label, className }) => ({ id, label, className })),
    ).toEqual(docsThemePresets.map(({ id, label, className }) => ({ id, label, className })));
  });
});
