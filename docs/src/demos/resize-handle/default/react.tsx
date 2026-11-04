import { ResizeHandle } from '@var-ui/react';
import { useState } from 'react';

export default function Preview() {
  const [width, setWidth] = useState(200);
  return (
    <div
      style={{
        display: 'flex',
        height: '5rem',
        width: '20rem',
        border: '0.0625rem solid var(--var-ui-color-border-subtle)',
      }}
    >
      <div style={{ width, overflow: 'hidden', padding: '0.5rem' }}>Sidebar ({width}px)</div>
      <ResizeHandle
        value={width}
        minValue={120}
        maxValue={280}
        onValueChange={setWidth}
        aria-label="Resize sidebar"
      />
      <div style={{ flex: 1, padding: '0.5rem' }}>Main</div>
    </div>
  );
}
