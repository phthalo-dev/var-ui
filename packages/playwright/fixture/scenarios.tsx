import type { JSX } from 'react';
import { Button, Checkbox, Dialog, Select, TextField } from '@var-ui/react';

/**
 * Minimal renderings of the M1 components, one scenario per URL (`/?case=<key>`, see
 * main.tsx). Keep each scenario as close to a docs demo as possible: they are what the
 * harnesses (and later the docs-site suite) are written against.
 */

export function ButtonDefault(): JSX.Element {
  return <Button onClick={() => {}}>Run query</Button>;
}

export function ButtonDisabled(): JSX.Element {
  return (
    <Button disabled onClick={() => {}}>
      Run query
    </Button>
  );
}

export function ButtonsMultiple(): JSX.Element {
  return (
    <>
      <Button onClick={() => {}}>Save draft</Button>
      <Button onClick={() => {}} disabled>
        Delete
      </Button>
    </>
  );
}

export function CheckboxDefault(): JSX.Element {
  return <Checkbox onCheckedChange={() => {}}>Email updates</Checkbox>;
}

export function CheckboxChecked(): JSX.Element {
  return (
    <Checkbox defaultChecked onCheckedChange={() => {}}>
      Email updates
    </Checkbox>
  );
}

export function CheckboxDisabled(): JSX.Element {
  return (
    <Checkbox disabled onCheckedChange={() => {}}>
      Email updates
    </Checkbox>
  );
}

export function TextFieldDefault(): JSX.Element {
  return <TextField label="Project name" description="Shown in the sidebar." />;
}

export function TextFieldDisabled(): JSX.Element {
  return <TextField label="Project name" disabled />;
}

// `validationBehavior="aria"` renders the error immediately, so the harness can assert it
// deterministically without simulating a submit.
export function TextFieldError(): JSX.Element {
  return (
    <TextField
      label="Project name"
      invalid
      errorMessage="A project name is required."
      validationBehavior="aria"
    />
  );
}

export function DialogDefault(): JSX.Element {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Open</Button>
      </Dialog.Trigger>
      <Dialog.Popup>
        <Dialog.Title>Confirm order</Dialog.Title>
        <Dialog.Description>You are ordering 2 items.</Dialog.Description>
        <Dialog.Actions>
          <Dialog.Close>
            <Button>Cancel</Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button>Confirm</Button>
          </Dialog.Close>
        </Dialog.Actions>
      </Dialog.Popup>
    </Dialog.Root>
  );
}

export function DialogAlert(): JSX.Element {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Remove item</Button>
      </Dialog.Trigger>
      <Dialog.Popup role="alertdialog">
        <Dialog.Title>Remove item?</Dialog.Title>
        <Dialog.Description>This cannot be undone.</Dialog.Description>
        <Dialog.Actions>
          <Dialog.Close>
            <Button>Cancel</Button>
          </Dialog.Close>
        </Dialog.Actions>
      </Dialog.Popup>
    </Dialog.Root>
  );
}

/** The default `Dialog.Close` chrome (no child): the `aria-label="Close"` icon button. */
export function DialogCloseChrome(): JSX.Element {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Open</Button>
      </Dialog.Trigger>
      <Dialog.Popup>
        <Dialog.Title>Settings</Dialog.Title>
        <Dialog.Close />
      </Dialog.Popup>
    </Dialog.Root>
  );
}

const regionOptions = [
  { value: 'eu-west-1', label: 'EU (Ireland)' },
  { value: 'eu-central-1', label: 'EU (Frankfurt)' },
  { value: 'us-east-1', label: 'US (Virginia)', disabled: true },
];

export function SelectDefault(): JSX.Element {
  return <Select label="Region" placeholder="Pick a region" options={regionOptions} />;
}

export function SelectPrefilled(): JSX.Element {
  return <Select label="Region" options={regionOptions} defaultValue="eu-central-1" />;
}

export const scenarios = {
  'button-default': ButtonDefault,
  'button-disabled': ButtonDisabled,
  'buttons-multiple': ButtonsMultiple,
  'checkbox-default': CheckboxDefault,
  'checkbox-checked': CheckboxChecked,
  'checkbox-disabled': CheckboxDisabled,
  'textfield-default': TextFieldDefault,
  'textfield-disabled': TextFieldDisabled,
  'textfield-error': TextFieldError,
  'dialog-default': DialogDefault,
  'dialog-alertdialog': DialogAlert,
  'dialog-close-chrome': DialogCloseChrome,
  'select-default': SelectDefault,
  'select-prefilled': SelectPrefilled,
} satisfies Record<string, () => JSX.Element>;
