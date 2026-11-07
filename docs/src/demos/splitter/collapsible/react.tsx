import { Splitter } from '@var-ui/react';
import { useState } from 'react';

export default function Preview() {
  const [sizes, setSizes] = useState([25, 75]);

  return (
    <div style={{ display: 'grid', gap: '0.5rem' }}>
      <Splitter sizes={sizes} onSizesChange={setSizes} style={{ height: '12.5rem' }}>
        <Splitter.Panel collapsible minSize={15}>
          <div style={{ padding: '0.75rem' }}>
            Sidebar. Press Enter on the divider to collapse it.
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{ padding: '0.75rem' }}>Content</div>
        </Splitter.Panel>
      </Splitter>
      <span>Sidebar: {sizes[0]}%</span>
    </div>
  );
}
