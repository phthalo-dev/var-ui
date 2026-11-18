import { Table } from '@var-ui/react';

export default function Preview() {
  return (
    <Table
      bordered
      highlightOnHover
      minWidth="40rem"
      caption="Recent runs"
      columns={[
        { key: 'run', header: 'Run', rowHeader: true },
        { key: 'branch', header: 'Branch' },
        { key: 'status', header: 'Status' },
        { key: 'duration', header: 'Duration', align: 'end' },
        { key: 'started', header: 'Started', align: 'end' },
      ]}
      data={[
        { run: '#1284', branch: 'main', status: 'Passed', duration: '4m 12s', started: '09:41' },
        {
          run: '#1283',
          branch: 'feat/table',
          status: 'Failed',
          duration: '2m 03s',
          started: '09:12',
        },
        { run: '#1282', branch: 'main', status: 'Passed', duration: '4m 08s', started: '08:57' },
      ]}
    />
  );
}
