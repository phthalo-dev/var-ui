import { render } from '@testing-library/react';
import { describe, expect, test } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { Bleed } from './Bleed';

describe('Bleed (#199)', () => {
  function Frame({ align }: { align?: 'content' | 'edge' }) {
    return (
      <div
        data-testid="frame"
        style={{
          containerType: 'inline-size',
          width: 600,
          paddingInline: 24,
          boxSizing: 'content-box',
        }}
      >
        <div data-testid="column" style={{ maxWidth: 300, marginInline: 'auto' }}>
          <Bleed gutter="24px" align={align} data-testid="band">
            <div data-testid="inner">band</div>
          </Bleed>
        </div>
      </div>
    );
  }
  const rect = (id: string) =>
    document.querySelector(`[data-testid="${id}"]`)!.getBoundingClientRect();

  test('spans the frame edge to edge (padding included); content stays on the column', () => {
    render(<Frame />);
    const frame = rect('frame');
    const band = rect('band');
    expect(Math.round(band.left)).toBe(Math.round(frame.left));
    expect(Math.round(band.right)).toBe(Math.round(frame.right));
    const column = rect('column');
    const inner = rect('inner');
    expect(Math.round(inner.left)).toBe(Math.round(column.left));
    expect(Math.round(inner.right)).toBe(Math.round(column.right));
  });

  test('align="edge" lets the content bleed too', () => {
    render(<Frame align="edge" />);
    expect(Math.round(rect('inner').left)).toBe(Math.round(rect('frame').left));
  });
});
