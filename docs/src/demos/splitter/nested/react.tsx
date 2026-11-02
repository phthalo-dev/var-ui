import { Splitter } from '@var-ui/react';

export default function Preview() {
  return (
    <Splitter defaultSizes={[30, 70]} style={{ height: 280 }}>
      <Splitter.Panel>
        <div style={{ padding: 12 }}>Files</div>
      </Splitter.Panel>
      <Splitter.Panel>
        <Splitter orientation="vertical" defaultSizes={[65, 35]} style={{ height: '100%' }}>
          <Splitter.Panel>
            <div style={{ padding: 12 }}>Editor</div>
          </Splitter.Panel>
          <Splitter.Panel>
            <div style={{ padding: 12 }}>Console</div>
          </Splitter.Panel>
        </Splitter>
      </Splitter.Panel>
    </Splitter>
  );
}
