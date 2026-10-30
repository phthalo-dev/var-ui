import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { AlertDialog, Button } from '@var-ui/react';

<AlertDialog>
  <AlertDialog.Trigger>
    <Button>Delete</Button>
  </AlertDialog.Trigger>
  <AlertDialog.Popup>
    <AlertDialog.Header>
      <AlertDialog.Title>Delete item?</AlertDialog.Title>
    </AlertDialog.Header>
    <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>
    <AlertDialog.Actions>
      <AlertDialog.Close>
        <Button autoFocus>Cancel</Button>
      </AlertDialog.Close>
      <AlertDialog.Close>
        <Button tone="danger" appearance="filled" onClick={() => {}}>
          Delete
        </Button>
      </AlertDialog.Close>
    </AlertDialog.Actions>
  </AlertDialog.Popup>
</AlertDialog>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
