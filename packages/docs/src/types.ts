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
  /** Link text; the accessible name when `iconOnly`. */
  text: string;
  link: string;
  /**
   * Path prefix that selects this item. When several items match, only the longest prefix is
   * selected. Omit it for links that never select (an external GitHub link).
   */
  match?: string;
  /** Open in a new tab (`target="_blank"`, `rel="noopener noreferrer"`). */
  external?: boolean;
  /** Inline SVG markup rendered before the label (in the header only). */
  icon?: string;
  /** Show only `icon` in the header, with `text` as the accessible name. Requires `icon`. */
  iconOnly?: boolean;
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
