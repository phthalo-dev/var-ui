import { NumberInput } from '@var-ui/react';

export default function Preview() {
  return (
    <NumberInput
      label="Quantity"
      defaultValue={1}
      min={0}
      max={10}
      step={1}
      description="Between 0 and 10"
    />
  );
}
