import { Splitter } from '@var-ui/react';

export default function Preview() {
  return (
    <Splitter autoSaveId="docs-splitter-demo" defaultSizes={[40, 60]} style={{ height: 200 }}>
      <Splitter.Panel>
        <div style={{ padding: 12 }}>Resize me, then reload the page.</div>
      </Splitter.Panel>
      <Splitter.Panel>
        <div style={{ padding: 12 }}>The sizes are saved in localStorage.</div>
      </Splitter.Panel>
    </Splitter>
  );
}
