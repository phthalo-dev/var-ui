import { CalendarDate, type DateValue } from '@internationalized/date';
import { DateRangeInput } from '@var-ui/react';
import { useState } from 'react';
import type { RangeValue } from 'react-aria-components';

export default function Preview() {
  const [value, setValue] = useState<RangeValue<DateValue>>({
    start: new CalendarDate(2026, 8, 10),
    end: new CalendarDate(2026, 8, 20),
  });

  return (
    <DateRangeInput
      label="Trip"
      value={value}
      onValueChange={(next) => {
        if (next) setValue(next);
      }}
    />
  );
}
