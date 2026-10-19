import { Button, Menu } from '@var-ui/react';

export default function Preview() {
  return (
    <Menu.FromSections
      trigger={<Button>File</Button>}
      sections={[
        {
          label: 'Edit',
          items: [
            { id: 'cut', label: 'Cut', shortcut: '⌘X' },
            { id: 'copy', label: 'Copy', shortcut: '⌘C' },
            { id: 'paste', label: 'Paste', shortcut: '⌘V' },
          ],
        },
        {
          label: 'Danger zone',
          items: [
            { id: 'archive', label: 'Archive' },
            { id: 'delete', label: 'Delete…', danger: true },
          ],
        },
      ]}
    />
  );
}
