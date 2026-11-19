import { describe, expect, it, vi } from 'vite-plus/test';

/**
 * Importing `@var-ui/core` runs every recipe and token registration. Anything TypeStyles warns
 * about there is printed by every Node process that imports the package (SSR, the docs config, the
 * CLI), so the import must stay silent.
 */
describe('importing @var-ui/core', () => {
  it('logs no TypeStyles warnings', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.resetModules();
    await import('../src/index');
    await import('../src/styles');
    const messages = warn.mock.calls
      .map(([msg]) => String(msg))
      .filter((m) => m.includes('typestyles'));
    warn.mockRestore();
    expect(messages).toEqual([]);
  });
});
