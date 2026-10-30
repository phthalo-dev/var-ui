import { describe, expect, it, vi } from 'vite-plus/test';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { Drawer } from './Drawer';

describe('Drawer', () => {
  it('renders title and body when open', () => {
    render(
      <IconProvider icons={{}}>
        <Drawer open title="Settings" onOpenChange={() => {}}>
          <p>Drawer body</p>
        </Drawer>
      </IconProvider>,
    );

    expect(screen.getByText('Settings')).toBeTruthy();
    expect(screen.getByText('Drawer body')).toBeTruthy();
    expect(document.querySelector('[class*="var-ui-drawer"]')).toBeTruthy();
  });

  it('labels a compound drawer without a title via aria-label', () => {
    render(
      <IconProvider icons={{}}>
        <Drawer.Root open aria-label="Navigation drawer">
          <Drawer.Backdrop>
            <Drawer.Panel>
              <Drawer.Body>Navigation links</Drawer.Body>
            </Drawer.Panel>
          </Drawer.Backdrop>
        </Drawer.Root>
      </IconProvider>,
    );

    expect(screen.getByRole('dialog', { name: 'Navigation drawer' })).toBeTruthy();
    expect(screen.getByText('Navigation links')).toBeTruthy();
  });

  it('preserves a consumer onPointerDown handler on the backdrop', () => {
    const onPointerDown = vi.fn();
    render(
      <IconProvider icons={{}}>
        <Drawer open title="Settings" onPointerDown={onPointerDown}>
          Drawer body
        </Drawer>
      </IconProvider>,
    );

    const backdrop = document.querySelector('.var-ui-drawer__overlay');
    expect(backdrop).toBeTruthy();
    fireEvent.pointerDown(backdrop!);

    expect(onPointerDown).toHaveBeenCalledOnce();
  });

  it('dismisses when Close wraps a native button', async () => {
    render(
      <IconProvider icons={{}}>
        <Drawer.Root defaultOpen>
          <Drawer.Backdrop>
            <Drawer.Panel>
              <Drawer.Header>
                <Drawer.Title>Settings</Drawer.Title>
                <Drawer.Close>
                  <button type="button">Dismiss</button>
                </Drawer.Close>
              </Drawer.Header>
              <Drawer.Body>Drawer body</Drawer.Body>
            </Drawer.Panel>
          </Drawer.Backdrop>
        </Drawer.Root>
      </IconProvider>,
    );

    expect(screen.getByText('Settings')).toBeTruthy();
    await userEvent.click(screen.getByText('Dismiss'));
    await waitFor(() => expect(screen.queryByText('Settings')).toBeNull());
  });

  it('supports defaultOpen (uncontrolled) and closes through the close button', async () => {
    render(
      <IconProvider icons={{}}>
        <Drawer defaultOpen title="Settings">
          <p>Drawer body</p>
        </Drawer>
      </IconProvider>,
    );
    expect(screen.getByText('Drawer body')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByText('Drawer body')).toBeNull());
  });

  it('dismissable={false} keeps the drawer open on outside press', async () => {
    const onOpenChange = vi.fn();
    render(
      <IconProvider icons={{}}>
        <Drawer open dismissable={false} title="Settings" onOpenChange={onOpenChange}>
          <p>Drawer body</p>
        </Drawer>
      </IconProvider>,
    );
    await userEvent.click(document.body);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByText('Drawer body')).toBeTruthy();
  });
});
