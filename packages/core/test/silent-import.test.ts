import { describe, expect, it, vi } from 'vite-plus/test';

/**
 * Importing `@var-ui/core` runs every recipe and token registration. Anything logged there is
 * printed by every Node process that imports the package (SSR, the docs config, the CLI), whoever
 * logs it (TypeStyles, our own code), so the import must stay silent.
 */
describe('importing @var-ui/core', () => {
  it('logs nothing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.resetModules();
    await import('../src/index');
    await import('../src/styles');
    const messages = [...warn.mock.calls, ...error.mock.calls, ...log.mock.calls].map(([msg]) =>
      String(msg),
    );
    warn.mockRestore();
    error.mockRestore();
    log.mockRestore();
    expect(messages).toEqual([]);
  });
});
