import { createRoot } from 'react-dom/client';
import { Button, Checkbox, DesignSystemProvider, Field, Select, TextField } from '@var-ui/react';

const options = [
  { id: 'a', label: 'Option A' },
  { id: 'b', label: 'Option B' },
];

createRoot(document.getElementById('root')!).render(
  <DesignSystemProvider>
    <Field label="Name">
      <TextField placeholder="Your name" />
    </Field>
    <Field label="Role">
      <Select options={options} placeholder="Choose one" />
    </Field>
    <Checkbox>Subscribe</Checkbox>
    <Button tone="accent" appearance="filled">
      Submit
    </Button>
  </DesignSystemProvider>,
);
