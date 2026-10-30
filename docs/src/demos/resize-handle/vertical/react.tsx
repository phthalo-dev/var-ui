import { ResizeHandle } from '@var-ui/react';
import { useState } from 'react';

export default function Preview() {
  const [height, setHeight] = useState(100);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 200,
        width: 280,
        border: '1px solid var(--var-ui-color-border-subtle)',
      }}
    >
      <div style={{ height, overflow: 'hidden', padding: 8 }}>Top ({height}px)</div>
      <ResizeHandle
        direction="vertical"
        value={height}
        minValue={60}
        maxValue={160}
        onValueChange={setHeight}
        aria-label="Resize panels"
      />
      <div style={{ flex: 1, padding: 8 }}>Bottom</div>
    </div>
  );
}
