import { describe, expect, it } from 'vite-plus/test';
import { figtreeGrotesk, groteskMono } from '../../src/fonts';

const srcs = (preset: ReturnType<typeof groteskMono>) => preset.fonts.map((face) => face.src);

describe('font presets (#247)', () => {
  it('default to self-hosted files under /fonts/', () => {
    expect(srcs(groteskMono())).toEqual([
      "url('/fonts/space-grotesk-latin.woff2') format('woff2')",
      "url('/fonts/jetbrains-mono-latin.woff2') format('woff2')",
    ]);
  });

  it('take a baseUrl, with or without a trailing slash', () => {
    for (const baseUrl of ['/assets/fonts', '/assets/fonts/']) {
      expect(srcs(figtreeGrotesk({ baseUrl }))).toEqual([
        "url('/assets/fonts/figtree-latin.woff2') format('woff2')",
        "url('/assets/fonts/space-grotesk-latin.woff2') format('woff2')",
        "url('/assets/fonts/jetbrains-mono-latin.woff2') format('woff2')",
      ]);
    }
    expect(srcs(groteskMono({ baseUrl: 'https://cdn.example.com/f/' }))[0]).toBe(
      "url('https://cdn.example.com/f/space-grotesk-latin.woff2') format('woff2')",
    );
  });

  it('pair each face with a fontFamily stack', () => {
    expect(groteskMono().tokens.fontFamily).toEqual({
      body: '"Space Grotesk", ui-sans-serif, system-ui, sans-serif',
      mono: '"JetBrains Mono", ui-monospace, monospace',
    });
  });
});
