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
      <Dialog.Close aria-label="Close" />
    </Dialog.Header>
    <Dialog.Description>You are all caught up.</Dialog.Description>
    <Dialog.Actions>
      <Dialog.Close>
        <Button>Close</Button>
      </Dialog.Close>
    </Dialog.Actions>
  </Dialog.Popup>
</Dialog>`,
  astro: `---
// No @var-ui/astro Dialog — static core-recipe chrome (open state, non-interactive).
// Full open/close interaction is React-only (native <dialog> + showModal()).
import { button, dialog } from '@var-ui/core';

const d = dialog();
const trigger = button({});
const closeAction = button({});
---

<div style="display: grid; gap: 1rem">
  <button type="button" class:list={[trigger]} disabled>Open dialog</button>
  <dialog class:list={[d.popup]} open aria-labelledby="dialog-demo-title" style="position: relative; inset: auto; margin: 0 auto; min-height: 220px">
    <div class:list={[d.content]}>
      <div class:list={[d.header]}>
        <h2 id="dialog-demo-title" class:list={[d.heading]}>Icon close button</h2>
        <button type="button" class:list={[d.closeButton]} aria-label="Close" disabled>×</button>
      </div>
      <p class:list={[d.description]}>The dismiss control now uses the registry close glyph.</p>
      <button type="button" class:list={[closeAction]} disabled>Close</button>
    </div>
  </dialog>
</div>`,
  html: `<div style="display: grid; gap: 1rem"><button type="button" data-tone="neutral" data-appearance="subtle" data-size="md" data-layout="default" class="var-ui-button" disabled>Open dialog</button><dialog data-role="dialog" class="var-ui-dialog__popup" open aria-labelledby="dialog-demo-title" style="position: relative; inset: auto; margin: 0 auto; min-height: 220px"><div data-role="dialog" class="var-ui-dialog__content"><div data-role="dialog" class="var-ui-dialog__header"><h2 id="dialog-demo-title" data-role="dialog" class="var-ui-dialog__heading">Icon close button</h2><button type="button" data-role="dialog" class="var-ui-dialog__closeButton" aria-label="Close" disabled><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg></button></div><p data-role="dialog" class="var-ui-dialog__description">The dismiss control now uses the registry close glyph.</p><button type="button" data-tone="neutral" data-appearance="subtle" data-size="md" data-layout="default" class="var-ui-button" disabled>Close</button></div></dialog></div>`,
} satisfies DemoSnippets;
