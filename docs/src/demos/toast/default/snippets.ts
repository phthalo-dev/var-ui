import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, ToastProvider, toast, useToast } from '@var-ui/react';

function NotifyButton() {
  const { add } = useToast();
  return <Button onClick={() => add({ tone: 'success', title: 'Saved' })}>Save</Button>;
}

<ToastProvider>
  <NotifyButton />
</ToastProvider>

// Imperative API (requires ToastProvider mounted)
toast.show({ tone: 'info', title: 'Hello' });
toast.update(id, { title: 'Updated' });
toast.dismiss(id);`,
  astro: `---
import { ToastRegion } from '@var-ui/astro';
---

<ToastRegion placement="bottom-end" />

<script>
  import { toast } from '@var-ui/astro';

  toast.show({ tone: 'success', title: 'Saved', description: 'Your draft was stored.' });
</script>`,
  html: `<div class="var-ui-toast" role="status">…</div>`,
} satisfies DemoSnippets;
