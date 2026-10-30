import { Combobox, IconProvider } from '@var-ui/react';

const FRUIT_OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'plum', label: 'Plum' },
  { value: 'orange', label: 'Orange' },
];

export default function Preview() {
  return (
    <IconProvider icons={{}}>
      <Combobox.Root aria-label="Favorite fruit" invalid>
        <Combobox.Label>Favorite fruit</Combobox.Label>
        <Combobox.Input placeholder="Search fruits…" clearable />
        <Combobox.Description>Pick a fruit from the list.</Combobox.Description>
        <Combobox.Error>Selection is required.</Combobox.Error>
        <Combobox.Popover>
          <Combobox.ListBox items={FRUIT_OPTIONS}>
            {(option) => (
              <Combobox.Item value={option.value} textValue={option.label}>
                {option.label}
              </Combobox.Item>
            )}
          </Combobox.ListBox>
        </Combobox.Popover>
      </Combobox.Root>
    </IconProvider>
  );
}
