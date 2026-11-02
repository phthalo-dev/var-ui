import { Checkbox, Fieldset } from '@var-ui/react';

export default function Preview() {
  return (
    <Fieldset legend="Interests" errorMessage="Pick at least one topic.">
      <Checkbox>Design</Checkbox>
      <Checkbox>Engineering</Checkbox>
      <Checkbox>Research</Checkbox>
    </Fieldset>
  );
}
