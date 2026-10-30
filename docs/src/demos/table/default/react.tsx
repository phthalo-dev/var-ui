import { Table } from '@var-ui/react';

export default function Preview() {
  return (
    <Table
      columns={[
        { key: 'name', header: 'Name', rowHeader: true },
        { key: 'role', header: 'Role' },
      ]}
      data={[
        { name: 'Ada', role: 'Admin' },
        { name: 'Grace', role: 'Editor' },
      ]}
    />
  );
}
