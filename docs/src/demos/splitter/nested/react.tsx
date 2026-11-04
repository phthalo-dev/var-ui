import { Splitter } from '@var-ui/react';

export default function Preview() {
  return (
    <Splitter defaultSizes={[30, 70]} style={{ height: '17.5rem' }}>
      <Splitter.Panel>
        <div style={{ padding: '0.75rem' }}>Files</div>
      </Splitter.Panel>
      <Splitter.Panel>
        <Splitter orientation="vertical" defaultSizes={[65, 35]} style={{ height: '100%' }}>
          <Splitter.Panel>
            <div style={{ padding: '0.75rem' }}>Editor</div>
          </Splitter.Panel>
          <Splitter.Panel>
            <div style={{ padding: '0.75rem' }}>Console</div>
          </Splitter.Panel>
        </Splitter>
      </Splitter.Panel>
    </Splitter>
  );
}
