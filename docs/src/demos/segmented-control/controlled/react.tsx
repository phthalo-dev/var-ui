import { SegmentedControl } from '@var-ui/react';
import { useState } from 'react';

export default function Preview() {
  const [value, setValue] = useState<string | null>('list');

  return (
    <SegmentedControl
      value={value}
      onValueChange={setValue}
      options={[
        { value: 'list', label: 'List' },
        { value: 'grid', label: 'Grid' },
        { value: 'board', label: 'Board' },
      ]}
    />
  );
}
