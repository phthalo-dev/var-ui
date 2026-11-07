import { Splitter } from '@var-ui/react';

export default function Preview() {
  return (
    <Splitter orientation="vertical" defaultSizes={[60, 40]} style={{ height: '16.25rem' }}>
      <Splitter.Panel>
        <div style={{ padding: '0.75rem' }}>Editor</div>
      </Splitter.Panel>
      <Splitter.Panel minSize={15}>
        <div style={{ padding: '0.75rem' }}>Terminal</div>
      </Splitter.Panel>
    </Splitter>
  );
}
