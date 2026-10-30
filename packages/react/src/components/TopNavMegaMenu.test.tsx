import { describe, expect, it, vi } from 'vite-plus/test';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import type { OverlayOpenChangeHandler } from '../overlays';
import { TopNavMegaMenu } from './TopNavMegaMenu';

function wrap(props: Partial<React.ComponentProps<typeof TopNavMegaMenu>> = {}) {
  return render(
    <IconProvider icons={{}}>
      <TopNavMegaMenu label="Products" openDelay={0} closeDelay={0} {...props}>
        <p>Panel content</p>
      </TopNavMegaMenu>
      <button type="button">Elsewhere</button>
    </IconProvider>,
  );
}

const last = (h: ReturnType<typeof vi.fn<OverlayOpenChangeHandler>>) => {
  const call = h.mock.calls[h.mock.calls.length - 1]!;
  return [call[0], call[1].reason];
};

describe('TopNavMegaMenu', () => {
  it('honors defaultOpen', () => {
    wrap({ defaultOpen: true });
    expect(screen.getByText('Panel content')).toBeTruthy();
  });

  it('reports trigger-press on click and toggles', () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    wrap({ onOpenChange });
    const trigger = screen.getByRole('button', { name: 'Products' });
    fireEvent.click(trigger);
    expect(last(onOpenChange)).toEqual([true, 'trigger-press']);
    expect(screen.getByText('Panel content')).toBeTruthy();
    fireEvent.click(trigger);
    expect(last(onOpenChange)).toEqual([false, 'trigger-press']);
  });

  it('reports hover for pointer enter and leave', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    wrap({ onOpenChange });
    const trigger = screen.getByRole('button', { name: 'Products' });
    fireEvent.mouseEnter(trigger);
    await waitFor(() => expect(last(onOpenChange)).toEqual([true, 'hover']));
    fireEvent.mouseLeave(trigger);
    await waitFor(() => expect(last(onOpenChange)).toEqual([false, 'hover']));
  });

  it('reports focus on keyboard focus', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    wrap({ onOpenChange });
    await userEvent.tab();
    await waitFor(() => expect(last(onOpenChange)).toEqual([true, 'focus']));
  });

  it('reports escape-key and outside-press', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    wrap({ defaultOpen: true, onOpenChange });
    fireEvent.keyDown(screen.getByText('Panel content'), { key: 'Escape' });
    expect(last(onOpenChange)).toEqual([false, 'escape-key']);
    await waitFor(() => expect(screen.queryByText('Panel content')).toBeNull());
  });

  it('reports outside-press', () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    wrap({ defaultOpen: true, onOpenChange });
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Elsewhere' }));
    expect(last(onOpenChange)).toEqual([false, 'outside-press']);
  });

  it('details.cancel() keeps it open', () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>((_n, d) => d.cancel());
    wrap({ defaultOpen: true, onOpenChange });
    fireEvent.keyDown(screen.getByText('Panel content'), { key: 'Escape' });
    expect(screen.getByText('Panel content')).toBeTruthy();
  });

  it('controlled: open wins until the parent updates it', () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    wrap({ open: false, onOpenChange });
    fireEvent.click(screen.getByRole('button', { name: 'Products' }));
    expect(last(onOpenChange)).toEqual([true, 'trigger-press']);
    expect(screen.queryByText('Panel content')).toBeNull();
  });

  it('renders no extra display:contents wrapper beyond the megaRoot', () => {
    const { container } = wrap({ defaultOpen: true });
    expect(container.querySelectorAll('[style*="display: contents"]').length).toBe(0);
  });
});
