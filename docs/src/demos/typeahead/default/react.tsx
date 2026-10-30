import { Typeahead, IconProvider } from '@var-ui/react';

const FRUIT_OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'plum', label: 'Plum' },
  { value: 'orange', label: 'Orange' },
];

export default function Preview() {
  return (
    <IconProvider icons={{}}>
      <Typeahead label="Fruit" options={FRUIT_OPTIONS} />
    </IconProvider>
  );
}
