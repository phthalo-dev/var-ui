import type { IconName } from '@var-ui/core';
export type SidebarItem = {
  text: string;
  link: string;
};

export type SidebarSection = {
  title: string;
  items: readonly SidebarItem[];
};

export type TopNavItem = {
  text: string;
  link: string;
  match: string;
};

export type DocsSearchItem = {
  id: string;
  title: string;
  /** Muted one-line subtitle under the title (also searched). */
  meta?: string;
  keywords?: string[];
  /** Section headings (h2/h3) in the page: searched, and a heading match becomes the subtitle. */
  headings?: string[];
  group?: string;
  /** Leading type icon (e.g. `page`, `component`, `palette`). */
  icon?: IconName;
};

export type DocsBrand = {
  heading: string;
  href: string;
};
