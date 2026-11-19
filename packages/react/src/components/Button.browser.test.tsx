import { render } from '@testing-library/react';
import { userEvent } from 'vite-plus/test/browser';
import { describe, expect, test, vi } from 'vite-plus/test';
import { defaultIcons } from '@var-ui/icons';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { IconProvider } from '../icons';
import { Button } from './Button';
import { IconButton } from './IconButton';

const rect = (id: string) =>
  document.querySelector<HTMLElement>(`[data-testid="${id}"]`)!.getBoundingClientRect();

function Fixture({ onClick }: { onClick?: () => void }) {
  return (
    <DesignSystemProvider applyToDocument>
      <IconProvider icons={defaultIcons}>
        <div style={{ display: 'flex', gap: 8, padding: 40, alignItems: 'center' }}>
          <Button data-testid="xs" size="xs" onClick={onClick}>
            Edit
          </Button>
          <Button data-testid="sm" size="sm">
            Edit
          </Button>
          <IconButton data-testid="icon-xs" size="xs" icon="close" aria-label="Remove" />
        </div>
      </IconProvider>
    </DesignSystemProvider>
  );
}

describe('Button size="xs"', () => {
  test('renders a 20px box, smaller than sm', () => {
    render(<Fixture />);
    expect(rect('xs').height).toBeCloseTo(20, 0);
    expect(rect('xs').height).toBeLessThan(rect('sm').height);
    const icon = rect('icon-xs');
    expect(icon.width).toBeCloseTo(20, 0);
    expect(icon.height).toBeCloseTo(20, 0);
  });

  test('sizes the IconButton glyph with the xs icon token', () => {
    render(<Fixture />);
    const glyph = document.querySelector('[data-testid="icon-xs"] [data-size]')!;
    expect(glyph.getAttribute('data-size')).toBe('xs');
    expect(glyph.getBoundingClientRect().width).toBeCloseTo(12, 0);
  });

  test('grows the pointer target to 24px without changing layout', async () => {
    const onClick = vi.fn();
    render(<Fixture onClick={onClick} />);
    const box = rect('xs');
    // 1px above the visible box is still inside the 24px target.
    const hit = document.elementFromPoint(box.left + box.width / 2, box.top - 1);
    expect(hit?.closest('[data-testid="xs"]')).not.toBeNull();
    // 3px above is outside it.
    const miss = document.elementFromPoint(box.left + box.width / 2, box.top - 3);
    expect(miss?.closest('[data-testid="xs"]')).toBeNull();

    await userEvent.click(document.querySelector('[data-testid="xs"]')!, {
      position: { x: box.width / 2, y: -1 },
    });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('icon-only xs targets are 24px square', () => {
    render(<Fixture />);
    const box = rect('icon-xs');
    const left = document.elementFromPoint(box.left - 1, box.top + box.height / 2);
    expect(left?.closest('[data-testid="icon-xs"]')).not.toBeNull();
  });
});
