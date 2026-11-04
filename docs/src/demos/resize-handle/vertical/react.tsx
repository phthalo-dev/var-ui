import { ResizeHandle } from '@var-ui/react';
import { useState } from 'react';

export default function Preview() {
  const [height, setHeight] = useState(100);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '12.5rem',
        width: '17.5rem',
        border: '0.0625rem solid var(--var-ui-color-border-subtle)',
      }}
    >
      <div style={{ height, overflow: 'hidden', padding: '0.5rem' }}>Top ({height}px)</div>
      <ResizeHandle
        orientation="vertical"
        value={height}
        minValue={60}
        maxValue={160}
        onValueChange={setHeight}
        aria-label="Resize panels"
      />
      <div style={{ flex: 1, padding: '0.5rem' }}>Bottom</div>
    </div>
  );
}
