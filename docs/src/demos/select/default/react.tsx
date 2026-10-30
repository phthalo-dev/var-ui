import { Select } from '@var-ui/react';

export default function Preview() {
  return (
    <Select
      label="Fruit"
      options={[
        { value: 'apple', label: 'Apple' },
        { value: 'plum', label: 'Plum' },
      ]}
    />
  );
}
