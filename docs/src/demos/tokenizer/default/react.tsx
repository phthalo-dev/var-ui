import { Tokenizer } from '@var-ui/react';
import { useState } from 'react';

const options = [
  { value: 'alpha', label: 'Alpha' },
  { value: 'beta', label: 'Beta' },
  { value: 'gamma', label: 'Gamma' },
];

export default function Preview() {
  const [value, setValue] = useState<string[]>([]);
  return <Tokenizer label="Tags" options={options} value={value} onValueChange={setValue} />;
}
