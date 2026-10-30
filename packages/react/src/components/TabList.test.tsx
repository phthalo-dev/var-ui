import { useState, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { LayerProvider } from '../layers/LayerProvider';
import { TabList } from './TabList';

function wrap(ui: ReactNode) {
  return render(
    <IconProvider icons={{}}>
      <LayerProvider>{ui}</LayerProvider>
    </IconProvider>,
  );
}

function ControlledTabList({
  onValueChange,
  orientation,
}: {
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}) {
  const [value, setValue] = useState('overview');
  return (
    <TabList
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValueChange?.(next);
      }}
      orientation={orientation}
      label="Sections"
    >
      <TabList.Tab value="overview" label="Overview" />
      <TabList.Tab value="activity" label="Activity" />
      <TabList.Tab value="reports" label="Reports" />
    </TabList>
  );
}

describe('TabList', () => {
  it('renders a nav landmark labeled from `label`', () => {
    wrap(<ControlledTabList />);
    expect(screen.getByRole('navigation', { name: 'Sections' })).toBeTruthy();
  });

  it('selects a tab on click, updating data-selected', async () => {
    wrap(<ControlledTabList />);
    const overview = screen.getByRole('button', { name: 'Overview' });
    const activity = screen.getByRole('button', { name: 'Activity' });
    expect(overview.hasAttribute('data-selected')).toBe(true);
    expect(activity.hasAttribute('data-selected')).toBe(false);

    await userEvent.click(activity);

    expect(activity.hasAttribute('data-selected')).toBe(true);
    expect(overview.hasAttribute('data-selected')).toBe(false);
  });

  it('renders href tabs as links with aria-current="page" when selected', () => {
    wrap(
      <TabList value="overview" label="Sections">
        <TabList.Tab value="overview" label="Overview" href="/overview" />
        <TabList.Tab value="activity" label="Activity" href="/activity" />
      </TabList>,
    );
    const overview = screen.getByRole('link', { name: 'Overview' });
    const activity = screen.getByRole('link', { name: 'Activity' });
    expect(overview.getAttribute('aria-current')).toBe('page');
    expect(activity.hasAttribute('aria-current')).toBe(false);
  });

  it('fires onValueChange when a TabList.Menu option is selected', async () => {
    const onValueChange = vi.fn();
    wrap(
      <TabList value="overview" onValueChange={onValueChange} label="Sections">
        <TabList.Tab value="overview" label="Overview" />
        <TabList.Menu
          label="More"
          options={[
            { value: 'settings', label: 'Settings' },
            { value: 'audit', label: 'Audit log' },
          ]}
        />
      </TabList>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'More' }));
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Audit log' }));

    expect(onValueChange).toHaveBeenCalledWith('audit');
  });

  it('moves focus to the next tab on ArrowRight, and wraps at the ends', async () => {
    wrap(<ControlledTabList />);
    const overview = screen.getByRole('button', { name: 'Overview' });
    const activity = screen.getByRole('button', { name: 'Activity' });
    const reports = screen.getByRole('button', { name: 'Reports' });

    overview.focus();
    expect(document.activeElement).toBe(overview);

    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(activity);

    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(reports);

    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(overview);

    await userEvent.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(reports);
  });

  it('uses ArrowUp/ArrowDown instead of ArrowLeft/ArrowRight when vertical', async () => {
    wrap(<ControlledTabList orientation="vertical" />);
    const overview = screen.getByRole('button', { name: 'Overview' });
    const activity = screen.getByRole('button', { name: 'Activity' });

    overview.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(activity);
  });

  it('jumps to the first/last tab on Home/End', async () => {
    wrap(<ControlledTabList />);
    const overview = screen.getByRole('button', { name: 'Overview' });
    const activity = screen.getByRole('button', { name: 'Activity' });
    const reports = screen.getByRole('button', { name: 'Reports' });

    activity.focus();
    await userEvent.keyboard('{End}');
    expect(document.activeElement).toBe(reports);

    await userEvent.keyboard('{Home}');
    expect(document.activeElement).toBe(overview);
  });

  it('only gives the selected tab tabIndex 0, roving the rest to -1', () => {
    wrap(<ControlledTabList />);
    const overview = screen.getByRole('button', { name: 'Overview' });
    const activity = screen.getByRole('button', { name: 'Activity' });
    expect(overview.tabIndex).toBe(0);
    expect(activity.tabIndex).toBe(-1);
  });

  it('sets data-layout, data-orientation, and data-has-divider on the root', () => {
    wrap(
      <TabList value="overview" layout="fill" hasDivider orientation="vertical" label="Sections">
        <TabList.Tab value="overview" label="Overview" />
      </TabList>,
    );
    const nav = screen.getByRole('navigation', { name: 'Sections' });
    expect(nav.getAttribute('data-layout')).toBe('fill');
    expect(nav.getAttribute('data-orientation')).toBe('vertical');
    expect(nav.hasAttribute('data-has-divider')).toBe(true);
  });
});
