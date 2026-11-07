import { Menu } from '@var-ui/react';

export default function Preview() {
  return (
    <Menu.ContextMenu
      sections={[
        {
          items: [
            { id: 'copy', label: 'Copy' },
            { id: 'paste', label: 'Paste' },
          ],
        },
      ]}
    >
      <div
        style={{
          padding: '1.5rem',
          border: '0.0625rem dashed var(--var-ui-color-border-subtle)',
          borderRadius: '0.5rem',
        }}
      >
        Right-click me
      </div>
    </Menu.ContextMenu>
  );
}
