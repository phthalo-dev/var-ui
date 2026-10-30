import { CalendarDate } from '@internationalized/date';
import { Calendar } from '@var-ui/react';
import { useState } from 'react';

export default function Preview() {
  const [value, setValue] = useState(new CalendarDate(2026, 8, 12));
  return <Calendar aria-label="Pick a day" value={value} onValueChange={setValue} />;
}
