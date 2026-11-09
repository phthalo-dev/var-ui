import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Menu, Menubar } from '@var-ui/react';

<Menubar aria-label="Application">
  <Menubar.Menu label="File">
    <Menu.Item id="new">New file</Menu.Item>
    <Menu.Submenu label="Open recent">
      <Menu.Item id="r1">report.md</Menu.Item>
      <Menu.Item id="r2">notes.txt</Menu.Item>
      <Menu.Separator />
      <Menu.Item id="clear">Clear list</Menu.Item>
    </Menu.Submenu>
    <Menu.Separator />
    <Menu.Item id="quit">Quit</Menu.Item>
  </Menubar.Menu>
  <Menubar.Menu label="Edit">
    <Menu.Item id="undo">Undo</Menu.Item>
    <Menu.Submenu label="Transform">
      <Menu.Item id="upper">Uppercase</Menu.Item>
      <Menu.Item id="lower">Lowercase</Menu.Item>
    </Menu.Submenu>
  </Menubar.Menu>
  <Menubar.Menu label="Help">
    <Menu.Item id="about">About</Menu.Item>
  </Menubar.Menu>
</Menubar>`,
  astro: `<!-- No Astro binding: Menubar holds client state, use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
