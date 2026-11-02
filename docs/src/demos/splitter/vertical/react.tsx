import { Splitter } from '@var-ui/react';

export default function Preview() {
  return (
    <Splitter orientation="vertical" defaultSizes={[60, 40]} style={{ height: 260 }}>
      <Splitter.Panel>
        <div style={{ padding: 12 }}>Editor</div>
      </Splitter.Panel>
      <Splitter.Panel minSize={15}>
        <div style={{ padding: 12 }}>Terminal</div>
      </Splitter.Panel>
    </Splitter>
  );
}
