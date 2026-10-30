import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Accordion } from '@var-ui/react';

<Accordion type="single" defaultValue={['billing']}>
  <Accordion.Item id="billing">
    <Accordion.Trigger>Billing</Accordion.Trigger>
    <Accordion.Panel>…</Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item id="shipping">
    <Accordion.Trigger>Shipping</Accordion.Trigger>
    <Accordion.Panel>…</Accordion.Panel>
  </Accordion.Item>
</Accordion>`,
  astro: `---
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from '@var-ui/astro';
---

<Accordion type="single">
  <AccordionItem id="billing" defaultExpanded>
    <AccordionTrigger>Billing</AccordionTrigger>
    <AccordionPanel>…</AccordionPanel>
  </AccordionItem>
</Accordion>`,
  html: `<div class="var-ui-accordion-group">…</div>`,
} satisfies DemoSnippets;
