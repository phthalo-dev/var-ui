import { Icon, List } from '@var-ui/react';

export default function Preview() {
  return (
    <div style={{ width: '18.75rem' }}>
      <List header="Shortcuts" hasDividers>
        <List.Item
          label="Search"
          description="Find anything"
          startContent={<Icon name="search" size="sm" />}
        />
        <List.Item
          label="Recent"
          description="Opened today"
          startContent={<Icon name="clock" size="sm" />}
        />
        <List.Item
          label="Tools"
          description="Extensions"
          startContent={<Icon name="wrench" size="sm" />}
        />
      </List>
    </div>
  );
}
