import { CalendarDate } from '@internationalized/date';
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { DateRangeInput } from './DateRangeInput';
import { stubNativePopover } from '../test/nativeOverlayStubs';

stubNativePopover();

const value = {
  start: new CalendarDate(2024, 3, 10),
  end: new CalendarDate(2024, 3, 20),
};

describe('DateRangeInput', () => {
  it('renders the label', () => {
    render(
      <IconProvider icons={{}}>
        <DateRangeInput label="Trip dates" value={value} onValueChange={() => {}} />
      </IconProvider>,
    );
    expect(screen.getByText('Trip dates')).toBeTruthy();
  });

  it('renders both a start and end segment group', () => {
    render(
      <IconProvider icons={{}}>
        <DateRangeInput label="Trip dates" value={value} onValueChange={() => {}} />
      </IconProvider>,
    );
    // Each date is split into month/day/year segments; two groups means six
    // spinbutton-role segments total (three per date).
    const segments = screen.getAllByRole('spinbutton');
    expect(segments).toHaveLength(6);
    expect(screen.getByText('10')).toBeTruthy();
    expect(screen.getByText('20')).toBeTruthy();
  });

  it('opens the popover and shows a range calendar grid', async () => {
    render(
      <IconProvider icons={{}}>
        <DateRangeInput label="Trip dates" value={value} onValueChange={() => {}} />
      </IconProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: /calendar/i }));

    const grid = await screen.findByRole('grid');
    expect(grid).toBeTruthy();
    expect(screen.getAllByRole('button', { name: /next/i }).length).toBeGreaterThan(0);
  });
});
