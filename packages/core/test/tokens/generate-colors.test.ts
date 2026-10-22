import { describe, it, expect, vi, beforeEach, afterEach } from 'vite-plus/test';

const { mockContrastRatio } = vi.hoisted(() => ({
  mockContrastRatio: vi.fn<(colorA: string, colorB: string) => number>(),
}));

vi.mock('typestyles/color-scale', async (importOriginal) => {
  const actual = await importOriginal<typeof import('typestyles/color-scale')>();
  mockContrastRatio.mockImplementation(actual.contrastRatio);
  return {
    ...actual,
    contrastRatio: mockContrastRatio,
  };
});

import { palette } from '../../src/tokens/defaults/color/palette';
import { generateColors } from '../../src/tokens/generate-colors';
import type { ColorTokenPatch } from '../../src/tokens/types';

/** Snapshot of representative static palette steps. */
const PALETTE_BYTE_IDENTICAL_FIXTURE: Record<string, string> = {
  'sky-7': 'oklch(46.60% 0.126 238)',
  'neutral-1': 'oklch(98.01% 0 0)',
  'neutral-2': 'oklch(96.57% 0 0)',
  'red-7': 'oklch(46.60% 0.189 27)',
  'gray-1': 'oklch(98.01% 0.002 264)',
};

function isModeAwareLeaf(value: unknown): value is { light: string; dark: string } {
  return (
    !!value &&
    typeof value === 'object' &&
    'light' in value &&
    'dark' in value &&
    typeof (value as { light: unknown }).light === 'string' &&
    typeof (value as { dark: unknown }).dark === 'string'
  );
}

function assertModeAwareColorShape(values: ColorTokenPatch): void {
  expect(isModeAwareLeaf(values.background?.app)).toBe(true);
  expect(isModeAwareLeaf(values.background?.surface)).toBe(true);
  expect(isModeAwareLeaf(values.text?.primary)).toBe(true);
  expect(isModeAwareLeaf(values.text?.secondary)).toBe(true);
  expect(isModeAwareLeaf(values.tone?.accent?.background)).toBe(true);
  expect(isModeAwareLeaf(values.tone?.accent?.foreground)).toBe(true);
  expect(isModeAwareLeaf(values.border?.default)).toBe(true);
  expect(isModeAwareLeaf(values.overlay?.default)).toBe(true);
  expect(isModeAwareLeaf(values.link?.default)).toBe(true);
  expect(isModeAwareLeaf(values.code?.base)).toBe(true);
  expect(isModeAwareLeaf(values.code?.keyword)).toBe(true);
}

describe('palette extraction', () => {
  it('keeps representative static palette steps stable', () => {
    for (const [key, expected] of Object.entries(PALETTE_BYTE_IDENTICAL_FIXTURE)) {
      expect(palette[key as keyof typeof palette]).toBe(expected);
    }
  });
});

describe('generateColors', () => {
  beforeEach(async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const actual =
      await vi.importActual<typeof import('typestyles/color-scale')>('typestyles/color-scale');
    mockContrastRatio.mockImplementation(actual.contrastRatio);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('returns mode-aware color leaves for the default accent', () => {
    const theme = generateColors({ accent: '#0064E0' });
    assertModeAwareColorShape(theme);
    expect(theme).toMatchSnapshot();
  });

  it('returns themes for a saturated pink accent', () => {
    const theme = generateColors({ accent: '#FF1493' });
    assertModeAwareColorShape(theme);
    expect(theme).toMatchSnapshot();
  });

  it('clamps chroma for a near-gray accent', () => {
    const theme = generateColors({ accent: '#808080' });
    assertModeAwareColorShape(theme);
    expect(theme.tone!.accent!.foreground).toMatchObject({
      light: expect.stringMatching(/oklch\(/),
      dark: expect.stringMatching(/oklch\(/),
    });
    expect(theme).toMatchSnapshot();
  });

  it('warns when contrast validation fails', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockContrastRatio.mockReturnValue(3);
    generateColors({ accent: '#0064E0', contrast: 'standard' });
    expect(warn).toHaveBeenCalled();
    const messages = warn.mock.calls.map((call) => String(call[0]));
    expect(messages.some((msg) => msg.includes('generateColors'))).toBe(true);
  });

  it('stays silent for a known-good accent', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    generateColors({ accent: '#0064E0', contrast: 'standard' });
    expect(warn).not.toHaveBeenCalled();
  });
});
