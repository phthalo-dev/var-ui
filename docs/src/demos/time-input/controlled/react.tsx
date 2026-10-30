import { Time } from '@internationalized/date';
import { TimeInput } from '@var-ui/react';
import { useState } from 'react';

export default function Preview() {
  const [value, setValue] = useState(new Time(9, 30));

  return (
    <TimeInput
      label="Start"
      value={value}
      onValueChange={(next) => {
        if (next) setValue(next);
      }}
    />
  );
}
