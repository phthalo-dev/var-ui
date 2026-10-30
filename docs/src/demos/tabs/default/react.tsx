import { Tabs, Text } from '@var-ui/react';

export default function Preview() {
  return (
    <Tabs
      tabs={[
        { value: 'overview', label: 'Overview', content: <Text>First panel content.</Text> },
        { value: 'details', label: 'Details', content: <Text>Second panel content.</Text> },
      ]}
    />
  );
}
