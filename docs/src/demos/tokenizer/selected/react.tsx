import { Tokenizer } from '@var-ui/react';
import { useState } from 'react';

const options = [
  { value: 'alpha', label: 'Alpha' },
  { value: 'beta', label: 'Beta' },
  { value: 'gamma', label: 'Gamma' },
  { value: 'delta', label: 'Delta' },
];

export default function Preview() {
  const [value, setValue] = useState(['alpha', 'gamma']);

  return (
    <Tokenizer
      label="Tags"
      description="Start with a few tokens already selected"
      options={options}
      value={value}
      onValueChange={setValue}
    />
  );
}
