import { List } from '@var-ui/react';

export default function Preview() {
  return (
    <div style={{ width: '17.5rem' }}>
      <List header="Members">
        <List.Item label="Ada Lovelace" description="Admin" />
        <List.Item label="Grace Hopper" description="Editor" />
      </List>
    </div>
  );
}
