import { describe, expect, it } from 'vite-plus/test';
import { iconNameList } from '../../src/icons/iconNames';

describe('icon system (core)', () => {
  it('ships every semantic icon name', () => {
    expect([...iconNameList].sort()).toEqual(
      [
        'check',
        'chevronDown',
        'chevronLeft',
        'chevronRight',
        'close',
        'copy',
        'error',
        'info',
        'search',
        'success',
        'warning',
        'arrowDown',
        'arrowUp',
        'arrowsUpDown',
        'stop',
        'wrench',
        'clock',
        'menu',
        'moreHorizontal',
        'colorModeLight',
        'colorModeDark',
        'colorModeSystem',
        'eye',
        'eyeOff',
        'video',
      ].sort(),
    );
  });
});
