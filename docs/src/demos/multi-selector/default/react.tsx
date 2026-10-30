import { MultiSelector } from '@var-ui/react';
import { useState } from 'react';

const options = [
  { value: 'eng', label: 'Engineering' },
  { value: 'design', label: 'Design' },
  { value: 'ops', label: 'Ops' },
];

export default function Preview() {
  const [value, setValue] = useState<string[]>(['eng']);
  return <MultiSelector label="Teams" options={options} value={value} onValueChange={setValue} />;
}
