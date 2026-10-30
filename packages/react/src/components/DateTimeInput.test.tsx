import { useState } from 'react';
import { CalendarDateTime } from '@internationalized/date';
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { DateTimeInput } from './DateTimeInput';

function ControlledDateTimeInput() {
  const [value, setValue] = useState<CalendarDateTime>(new CalendarDateTime(2026, 7, 15, 14, 30));
  return (
    <>
      <DateTimeInput label="Appointment" value={value} onValueChange={(v) => v && setValue(v)} />
      <output data-testid="value">{value.toString()}</output>
    </>
  );
}

describe('DateTimeInput', () => {
  it('renders the label', () => {
    render(
      <IconProvider icons={{}}>
        <DateTimeInput label="Appointment" />
      </IconProvider>,
    );
    expect(screen.getByText('Appointment')).toBeTruthy();
  });

  it('renders date segments (month/day/year) alongside time segments (hour/minute/AM-PM) by default', () => {
    render(
      <IconProvider icons={{}}>
        <DateTimeInput label="Appointment" />
      </IconProvider>,
    );
    // Date segments.
    expect(screen.getByRole('spinbutton', { name: /month/i })).toBeTruthy();
    expect(screen.getByRole('spinbutton', { name: /day/i })).toBeTruthy();
    expect(screen.getByRole('spinbutton', { name: /year/i })).toBeTruthy();
    // Time segments — present without explicitly passing `granularity`,
    // confirming the default of 'minute'.
    expect(screen.getByRole('spinbutton', { name: /hour/i })).toBeTruthy();
    expect(screen.getByRole('spinbutton', { name: /minute/i })).toBeTruthy();
    expect(screen.getByRole('spinbutton', { name: /AM\/PM/i })).toBeTruthy();
  });

  it('does not render a second granularity segment when granularity="day" is passed explicitly', () => {
    render(
      <IconProvider icons={{}}>
        <DateTimeInput label="Appointment" granularity="day" />
      </IconProvider>,
    );
    expect(screen.getByRole('spinbutton', { name: /month/i })).toBeTruthy();
    expect(screen.queryByRole('spinbutton', { name: /hour/i })).toBeNull();
  });

  it('shows the pre-filled segments for a controlled value', () => {
    render(
      <IconProvider icons={{}}>
        <DateTimeInput
          label="Appointment"
          value={new CalendarDateTime(2026, 7, 15, 14, 30)}
          onValueChange={() => {}}
        />
      </IconProvider>,
    );
    expect(screen.getByRole('spinbutton', { name: /month/i }).textContent).toBe('7');
    expect(screen.getByRole('spinbutton', { name: /day/i }).textContent).toBe('15');
    expect(screen.getByRole('spinbutton', { name: /year/i }).textContent).toBe('2026');
    expect(screen.getByRole('spinbutton', { name: /hour/i }).textContent).toBe('2');
    expect(screen.getByRole('spinbutton', { name: /minute/i }).textContent).toBe('30');
    expect(screen.getByRole('spinbutton', { name: /AM\/PM/i }).textContent).toBe('PM');
  });

  it('renders description when passed', () => {
    render(
      <IconProvider icons={{}}>
        <DateTimeInput label="Appointment" description="Local time" />
      </IconProvider>,
    );
    expect(screen.getByText('Local time')).toBeTruthy();
  });

  it('renders error message when passed', () => {
    render(
      <IconProvider icons={{}}>
        <DateTimeInput label="Appointment" errorMessage="Required" invalid />
      </IconProvider>,
    );
    expect(screen.getByText('Required')).toBeTruthy();
  });

  it('opens a popover calendar grid via the trigger button', async () => {
    render(
      <IconProvider icons={{}}>
        <ControlledDateTimeInput />
      </IconProvider>,
    );

    const trigger = screen.getByRole('button');
    await userEvent.click(trigger);

    expect(await screen.findByRole('grid')).toBeTruthy();
    expect(screen.getAllByRole('button', { name: /15/ }).length).toBeGreaterThan(0);
  });
});
