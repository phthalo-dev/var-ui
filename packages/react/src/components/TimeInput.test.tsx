import { useState } from 'react';
import { Time } from '@internationalized/date';
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { TimeInput } from './TimeInput';

function ControlledTimeInput() {
  const [value, setValue] = useState<Time>(new Time(14, 30));
  return (
    <>
      <TimeInput label="Start time" value={value} onValueChange={(v) => v && setValue(v)} />
      <output data-testid="value">{value.toString()}</output>
    </>
  );
}

describe('TimeInput', () => {
  it('renders the label', () => {
    render(<TimeInput label="Start time" />);
    expect(screen.getByText('Start time')).toBeTruthy();
  });

  it('renders hour, minute, and dayPeriod segments', () => {
    render(<TimeInput label="Start time" />);
    expect(screen.getByRole('spinbutton', { name: /hour/i })).toBeTruthy();
    expect(screen.getByRole('spinbutton', { name: /minute/i })).toBeTruthy();
    expect(screen.getByRole('spinbutton', { name: /AM\/PM/i })).toBeTruthy();
  });

  it('renders description when passed', () => {
    render(<TimeInput label="Start time" description="Use local time" />);
    expect(screen.getByText('Use local time')).toBeTruthy();
  });

  it('renders error message when passed', () => {
    render(<TimeInput label="Start time" errorMessage="Time is required" invalid />);
    expect(screen.getByText('Time is required')).toBeTruthy();
  });

  it('reflects a controlled value via the dayPeriod segment', () => {
    render(<ControlledTimeInput />);
    const dayPeriod = screen.getByRole('spinbutton', { name: /AM\/PM/i });
    expect(dayPeriod.textContent).toBe('PM');
    const hour = screen.getByRole('spinbutton', { name: /hour/i });
    expect(hour.textContent).toBe('2');
    const minute = screen.getByRole('spinbutton', { name: /minute/i });
    expect(minute.textContent).toBe('30');
  });
});
