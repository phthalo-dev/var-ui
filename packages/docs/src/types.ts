import type { IconName } from '@var-ui/core';
import type { getEntry } from 'astro:content';
import type { MarkdownHeading } from 'astro';

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
  /** Destination URL. Also used as the stable item id when `href` is not provided. */
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
  /**
   * Explicit destination URL. When set, it is used for the result link and `id` is used only as
   * the stable item key (e.g. for the "Recent" group).
   */
  href?: string;
};

export type DocsBrand = {
  heading: string;
  href: string;
};

export type VarDocsRoute = {
  collection: string;
  id: string;
  pathname: string;
  title: string;
  description?: string;
  template: 'guide' | 'splash';
};

export type DocsGuideLayoutProps = {
  title: string;
  showToc?: boolean;
  eyebrow: string;
  entry: Awaited<ReturnType<typeof getEntry>>;
  headings: MarkdownHeading[];
  varDocsRoute: VarDocsRoute;
};
