/// <reference types="astro/client" />

declare module '*.astro' {
  const Component: import('astro').AstroComponentFactory;
  export default Component;
}

declare namespace App {
  interface Locals {
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
