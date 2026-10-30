import { SegmentedControl } from '@var-ui/react';

export default function Preview() {
  return (
    <SegmentedControl
      defaultValue="list"
      options={[
        { value: 'list', label: 'List' },
        { value: 'grid', label: 'Grid' },
      ]}
    />
  );
}
