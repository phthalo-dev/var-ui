import { Menu } from '@var-ui/react';

export default function Preview() {
  return (
    <Menu.ContextMenu
      sections={[
        {
          label: 'Edit',
          items: [
            { id: 'rename', label: 'Rename' },
            { id: 'duplicate', label: 'Duplicate' },
          ],
        },
        {
          label: 'Clipboard',
          items: [
            { id: 'copy', label: 'Copy' },
            { id: 'paste', label: 'Paste' },
            { id: 'delete', label: 'Delete', danger: true },
          ],
        },
      ]}
    >
      <div
        style={{
          padding: '2rem',
          minWidth: '13.75rem',
          border: '0.0625rem solid var(--var-ui-color-border-subtle)',
          borderRadius: '0.5rem',
          background: 'var(--var-ui-color-surface-raised)',
        }}
      >
        Project card — right-click for actions
      </div>
    </Menu.ContextMenu>
  );
}
