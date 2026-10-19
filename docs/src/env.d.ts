/// <reference types="astro/client" />

declare module 'virtual:var-docs/config' {
  const config: import('@var-ui/docs').VarDocsConfig;
  export default config;
}

declare module 'virtual:var-docs/components/Layout' {
  const Layout: (props: Record<string, unknown>) => unknown;
  export default Layout;
}

declare module 'virtual:var-docs/mdx-components' {
  export const ColorSwatches: unknown;
  export const CssVariableReference: unknown;
  export const ShadowSwatches: unknown;
}

/** Populated by `lib/homepage-preload-plugin.ts` after a build; empty on a cold cache. */
declare module 'virtual:homepage-preloads' {
  const preloads: string[];
  export default preloads;
}

declare module '*.astro' {
  const Component: import('astro').AstroComponentFactory;
  export default Component;
}

declare namespace App {
  interface Locals {
    framework: import('@var-ui/docs-components/framework').DocsFramework;
    varDocsRoute?: {
      collection: string;
      id: string;
      pathname: string;
      title: string;
      description?: string;
      template: 'guide' | 'splash';
    };
  }
}
