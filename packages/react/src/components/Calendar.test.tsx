import { CalendarDate } from '@internationalized/date';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calendar } from './Calendar';

const focusedJuly2026 = new CalendarDate(2026, 7, 15);

describe('Calendar', () => {
  it('renders a heading with the visible month and year', () => {
    render(<Calendar aria-label="Appointment date" defaultFocusedValue={focusedJuly2026} />);
    expect(screen.getByText('July 2026', { selector: 'h2' })).toBeTruthy();
  });

  it('renders a month grid of day cells', () => {
    render(<Calendar aria-label="Appointment date" defaultFocusedValue={focusedJuly2026} />);
    expect(screen.getByRole('grid')).toBeTruthy();
    // A month grid always has at least four full weeks of cells rendered.
    expect(screen.getAllByRole('gridcell').length).toBeGreaterThanOrEqual(28);
    expect(screen.getByText('15')).toBeTruthy();
  });

  it('fires onValueChange with the selected date when a day cell is clicked', async () => {
    const onChange = vi.fn();
    render(
      <Calendar
        aria-label="Appointment date"
        defaultFocusedValue={focusedJuly2026}
        onValueChange={onChange}
      />,
    );
    await userEvent.click(screen.getByText('20'));
    expect(onChange).toHaveBeenCalledTimes(1);
    const selected = onChange.mock.calls[0]?.[0] as CalendarDate;
    expect(selected.day).toBe(20);
    expect(selected.month).toBe(7);
    expect(selected.year).toBe(2026);
  });

  it('reflects a controlled value as the selected cell', () => {
    render(
      <Calendar aria-label="Appointment date" value={focusedJuly2026} onValueChange={() => {}} />,
    );
    const selectedCell = screen.getByText('15').closest('[role="button"]');
    expect(selectedCell?.getAttribute('aria-label')).toContain('selected');
  });
});
