import { Table } from '@var-ui/react';

export default function Preview() {
  return (
    <Table
      striped
      density="compact"
      caption="Team roster"
      columns={[
        { key: 'name', header: 'Name', rowHeader: true },
        { key: 'role', header: 'Role' },
        { key: 'status', header: 'Status' },
      ]}
      data={[
        { name: 'Ada', role: 'Admin', status: 'Active' },
        { name: 'Grace', role: 'Editor', status: 'Active' },
        { name: 'Alan', role: 'Viewer', status: 'Invited' },
        { name: 'Katherine', role: 'Editor', status: 'Active' },
      ]}
    />
  );
}
