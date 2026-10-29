import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { matchesHotkey } from './commandPaletteHotkey';

function key(init: KeyboardEventInit) {
  return new KeyboardEvent('keydown', { key: 'k', ...init });
}

describe('matchesHotkey mod', () => {
  afterEach(() => vi.restoreAllMocks());

  it('uses Ctrl on non-Apple platforms', () => {
    vi.spyOn(navigator, 'platform', 'get').mockReturnValue('Win32');
    expect(matchesHotkey(key({ ctrlKey: true }), 'mod+k')).toBe(true);
    expect(matchesHotkey(key({ metaKey: true }), 'mod+k')).toBe(false);
  });

  it('uses Meta on Apple platforms and rejects Ctrl', () => {
    vi.spyOn(navigator, 'platform', 'get').mockReturnValue('MacIntel');
    expect(matchesHotkey(key({ metaKey: true }), 'mod+k')).toBe(true);
    expect(matchesHotkey(key({ ctrlKey: true }), 'mod+k')).toBe(false);
  });
});
