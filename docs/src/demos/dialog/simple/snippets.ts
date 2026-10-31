import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, Dialog } from '@var-ui/react';

<Dialog>
  <Dialog.Trigger>
    <Button>Open dialog</Button>
  </Dialog.Trigger>
  <Dialog.Popup>
    <Dialog.Header>
      <Dialog.Title>Notifications</Dialog.Title>
      <Dialog.Close />
    </Dialog.Header>
    <Dialog.Description>You are all caught up.</Dialog.Description>
    <Dialog.Actions>
      <Dialog.Close>
        <Button>Close</Button>
      </Dialog.Close>
    </Dialog.Actions>
  </Dialog.Popup>
</Dialog>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
