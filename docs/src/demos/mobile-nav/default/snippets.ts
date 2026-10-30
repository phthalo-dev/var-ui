import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { MobileNav } from '@var-ui/react';

<MobileNav open={open} onOpenChange={setOpen} header="Menu">
  <SideNav.Item label="Home" href="/" />
</MobileNav>`,
  astro: `---
import { MobileNav, MobileNavToggle, SideNavItem } from '@var-ui/astro';
---
<div data-var-ui-mobile-nav-provider>
  <MobileNavToggle />
  <MobileNav header="Menu">
    <SideNavItem label="Home" href="/" />
  </MobileNav>
</div>`,
  html: `<div data-var-ui-mobile-nav>…</div>`,
} satisfies DemoSnippets;
