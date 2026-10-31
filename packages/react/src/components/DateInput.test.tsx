import { CalendarDate } from '@internationalized/date';
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { DateInput } from './DateInput';
import { stubNativePopover } from '../test/nativeOverlayStubs';

stubNativePopover();

describe('DateInput', () => {
  it('renders the label', () => {
    render(
      <IconProvider icons={{}}>
        <DateInput label="Appointment date" />
      </IconProvider>,
    );
    expect(screen.getByText('Appointment date')).toBeTruthy();
  });

  it('renders segmented month/day/year entry', () => {
    render(
      <IconProvider icons={{}}>
        <DateInput label="Appointment date" />
      </IconProvider>,
    );
    expect(screen.getByText('mm')).toBeTruthy();
    expect(screen.getByText('dd')).toBeTruthy();
    expect(screen.getByText('yyyy')).toBeTruthy();
  });

  it('shows the pre-filled segments for a controlled value', () => {
    render(
      <IconProvider icons={{}}>
        <DateInput
          label="Appointment date"
          value={new CalendarDate(2026, 7, 15)}
          onValueChange={() => {}}
        />
      </IconProvider>,
    );
    expect(screen.getByText('7')).toBeTruthy();
    expect(screen.getByText('15')).toBeTruthy();
    expect(screen.getByText('2026')).toBeTruthy();
  });

  it('opens a popover calendar grid via the trigger button', async () => {
    render(
      <IconProvider icons={{}}>
        <DateInput
          label="Appointment date"
          value={new CalendarDate(2026, 7, 15)}
          onValueChange={() => {}}
        />
      </IconProvider>,
    );

    const trigger = screen.getByRole('button');
    await userEvent.click(trigger);

    expect(await screen.findByRole('grid')).toBeTruthy();
    expect(screen.getAllByRole('button', { name: /15/ }).length).toBeGreaterThan(0);
  });
});
