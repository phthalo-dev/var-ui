import { render } from '@testing-library/react';
import { useState } from 'react';
import { userEvent } from 'vite-plus/test/browser';
import { afterEach, describe, expect, test, vi } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { IconProvider } from '../icons';
import { raf } from '../test/browser';
import { SideNav } from './SideNav';

const Wrap = ({ children }: { children: React.ReactNode }) => (
  <DesignSystemProvider>
    <IconProvider icons={{}}>{children}</IconProvider>
  </DesignSystemProvider>
);
const details = (title: string) =>
  [...document.querySelectorAll('details')].find((d) =>
    d.querySelector('summary')?.textContent?.includes(title),
  )!;
const summary = (title: string) => details(title).querySelector('summary')!;
const toggled = async () => {
  await raf();
  await raf();
};

afterEach(() => localStorage.clear());

describe('SideNav.Section open state (#200)', () => {
  test('controlled: onOpenChange reports the toggle, and the prop decides', async () => {
    const onOpenChange = vi.fn();
    function Controlled({ accept }: { accept: boolean }) {
      const [open, setOpen] = useState(true);
      return (
        <SideNav>
          <SideNav.Section
            title="Guides"
            collapsible
            open={open}
            onOpenChange={(next) => {
              onOpenChange(next);
              if (accept) setOpen(next);
            }}
          >
            <SideNav.Item label="Intro" href="#intro" />
          </SideNav.Section>
        </SideNav>
      );
    }
    const { rerender } = render(
      <Wrap>
        <Controlled accept />
      </Wrap>,
    );
    await userEvent.click(summary('Guides'));
    await toggled();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(details('Guides').open).toBe(false);

    rerender(
      <Wrap>
        <Controlled accept={false} />
      </Wrap>,
    );
    await userEvent.click(summary('Guides'));
    await toggled();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    // The parent ignored the change, so the section stays closed.
    expect(details('Guides').open).toBe(false);
  });

  test('persistKey remembers sections across mounts; the current page section stays open', async () => {
    const nav = () => (
      <Wrap>
        <SideNav persistKey="test-nav">
          <SideNav.Section title="Guides" collapsible>
            <SideNav.Item label="Intro" href="#intro" />
          </SideNav.Section>
          <SideNav.Section title="API" collapsible>
            <SideNav.Item label="Button" href="#button" selected />
          </SideNav.Section>
        </SideNav>
      </Wrap>
    );
    const first = render(nav());
    await userEvent.click(summary('Guides'));
    await userEvent.click(summary('API'));
    await toggled();
    expect(JSON.parse(localStorage.getItem('test-nav')!)).toEqual({ Guides: false, API: false });
    first.unmount();

    render(nav());
    await toggled();
    expect(details('Guides').open).toBe(false);
    // Holds `aria-current="page"`: opened whatever was stored.
    expect(details('API').open).toBe(true);
  });
});
