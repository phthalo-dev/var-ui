import { Splitter } from '@var-ui/react';

export default function Preview() {
  return (
    <Splitter defaultSizes={[20, 50, 30]} minSizes={[10, 20, 10]} style={{ height: 200 }}>
      <Splitter.Panel>
        <div style={{ padding: 12 }}>Navigation</div>
      </Splitter.Panel>
      <Splitter.Panel>
        <div style={{ padding: 12 }}>Editor</div>
      </Splitter.Panel>
      <Splitter.Panel>
        <div style={{ padding: 12 }}>Inspector</div>
      </Splitter.Panel>
    </Splitter>
  );
}
