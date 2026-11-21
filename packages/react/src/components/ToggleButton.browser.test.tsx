import { render } from '@testing-library/react';
import { userEvent } from 'vite-plus/test/browser';
import { describe, expect, test } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { settled } from '../test/browser';
import { ToggleButton } from './SegmentedControl';

/** Any CSS colour (oklch, color-mix, …) to sRGB 0–255 channels, via a 1×1 canvas. */
function rgb(color: string): [number, number, number] {
  const ctx = document.createElement('canvas').getContext('2d')!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r!, g!, b!];
}

function contrast(a: string, b: string): number {
  const lum = (c: string) => {
    const [r, g, b] = rgb(c).map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
}

describe('ToggleButton (real browser)', () => {
  test.each(['light', 'dark'] as const)(
    'selected + hover keeps a readable label in %s mode',
    async (mode) => {
      document.documentElement.setAttribute('data-color-mode', mode);
      const { getByRole } = render(
        <DesignSystemProvider applyToDocument>
          <div style={{ padding: 40 }}>
            <ToggleButton defaultSelected>Bold</ToggleButton>
          </div>
        </DesignSystemProvider>,
      );
      const button = getByRole('button', { name: 'Bold' });
      await userEvent.hover(button);
      await settled(button);
      const cs = getComputedStyle(button);
      expect(contrast(cs.color, cs.backgroundColor)).toBeGreaterThanOrEqual(4.5);
      document.documentElement.removeAttribute('data-color-mode');
    },
  );
});
