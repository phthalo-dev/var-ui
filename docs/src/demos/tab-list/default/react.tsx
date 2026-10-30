import { TabList } from '@var-ui/react';
import { useState } from 'react';

export default function Preview() {
  const [tab, setTab] = useState('overview');
  return (
    <TabList value={tab} onValueChange={setTab} label="Sections">
      <TabList.Tab value="overview" label="Overview" />
      <TabList.Tab value="activity" label="Activity" />
    </TabList>
  );
}
