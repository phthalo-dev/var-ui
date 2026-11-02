import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Menu, Menubar } from '@var-ui/react';

<Menubar aria-label="Editor">
  <Menubar.Menu label="File">
    <Menu.Item id="new">New</Menu.Item>
    <Menu.Item id="save" disabled>
      Save
    </Menu.Item>
    <Menu.Item id="export" disabled>
      Export…
    </Menu.Item>
  </Menubar.Menu>
  <Menubar.Menu label="Edit">
    <Menu.Item id="undo" disabled>
      Undo
    </Menu.Item>
    <Menu.Item id="paste">Paste</Menu.Item>
  </Menubar.Menu>
  <Menubar.Menu label="Plugins" disabled>
    <Menu.Item id="manage">Manage plugins</Menu.Item>
  </Menubar.Menu>
  <Menubar.Menu label="Help">
    <Menu.Item id="about">About</Menu.Item>
  </Menubar.Menu>
</Menubar>`,
  astro: `<!-- No Astro binding: Menubar holds client state, use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
