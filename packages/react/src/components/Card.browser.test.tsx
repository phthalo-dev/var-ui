import { render } from '@testing-library/react';
import { userEvent } from 'vite-plus/test/browser';
import { describe, expect, test, vi } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { Card } from './Card';

describe('pressable Card (#143)', () => {
  test('a click anywhere on the card presses it; an inner link still works on its own', async () => {
    const onClick = vi.fn();
    const onLink = vi.fn((e: React.MouseEvent) => e.preventDefault());
    render(
      <DesignSystemProvider>
        <Card
          title="Memory"
          description="Saved Tuesday"
          onClick={onClick}
          data-testid="card"
          style={{ width: 300 }}
        >
          <a href="#x" onClick={onLink}>
            Source
          </a>
        </Card>
      </DesignSystemProvider>,
    );
    const card = document.querySelector<HTMLElement>('[data-testid="card"]')!;
    const r = card.getBoundingClientRect();
    // Bottom-right corner, far from the title text.
    await userEvent.click(card, { position: { x: r.width - 8, y: r.height - 8 } });
    expect(onClick).toHaveBeenCalledTimes(1);
    await userEvent.click(document.querySelector('a')!);
    expect(onLink).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
