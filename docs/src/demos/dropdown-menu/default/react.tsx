import { Button, Menu } from '@var-ui/react';

export default function Preview() {
  return (
    <Menu.FromSections
      trigger={<Button>Actions</Button>}
      sections={[
        {
          items: [
            { id: 'edit', label: 'Edit' },
            { id: 'duplicate', label: 'Duplicate' },
          ],
        },
      ]}
    />
  );
}
