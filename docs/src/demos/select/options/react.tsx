import { Grid, Select } from '@var-ui/react';

const FRUIT_OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'plum', label: 'Plum' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
];

export default function Preview() {
  return (
    <Grid columns={2} gap="lg">
      <Select label="Fruit" options={FRUIT_OPTIONS} />
      <Select label="Favorite fruit" placeholder="Choose a fruit…" options={FRUIT_OPTIONS} />
    </Grid>
  );
}
