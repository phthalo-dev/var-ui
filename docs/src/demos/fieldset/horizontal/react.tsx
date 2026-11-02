import { Checkbox, Fieldset } from '@var-ui/react';

export default function Preview() {
  return (
    <Fieldset legend="Days" orientation="horizontal" gap="lg">
      <Checkbox>Mon</Checkbox>
      <Checkbox>Tue</Checkbox>
      <Checkbox>Wed</Checkbox>
    </Fieldset>
  );
}
