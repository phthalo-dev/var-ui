import { Checkbox, Fieldset } from '@var-ui/react';

export default function Preview() {
  return (
    <Fieldset legend="Notifications" description="Choose how we reach you.">
      <Checkbox defaultChecked>Email</Checkbox>
      <Checkbox>SMS</Checkbox>
      <Checkbox>Push</Checkbox>
    </Fieldset>
  );
}
