import { ResizeHandle } from '@var-ui/react';
import { useState } from 'react';

export default function Preview() {
  const [width, setWidth] = useState(200);
  return (
    <div
      style={{
        display: 'flex',
        height: 80,
        width: 320,
        border: '1px solid var(--var-ui-color-border-subtle)',
      }}
    >
      <div style={{ width, overflow: 'hidden', padding: 8 }}>Sidebar ({width}px)</div>
      <ResizeHandle
        value={width}
        minValue={120}
        maxValue={280}
        onValueChange={setWidth}
        aria-label="Resize sidebar"
      />
      <div style={{ flex: 1, padding: 8 }}>Main</div>
    </div>
  );
}
