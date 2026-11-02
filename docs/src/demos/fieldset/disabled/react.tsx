import { Checkbox, Fieldset, TextField } from '@var-ui/react';

export default function Preview() {
  return (
    <Fieldset legend="Billing address" description="Locked while the plan is archived." disabled>
      <TextField label="Street" />
      <Checkbox>Same as shipping</Checkbox>
    </Fieldset>
  );
}
