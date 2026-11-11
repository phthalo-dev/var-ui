import { createElement, useEffect, type JSX } from 'react';
import { defaultIcons } from '@var-ui/icons';
import { DesignSystemProvider, IconProvider } from '@var-ui/react';
import { reactDemoMap } from '../demos/reactDemoMap';
import type { DemoId } from '../demos/types';

export type DemoE2DProps = {
  id: DemoId;
  direction?: 'ltr' | 'rtl';
  colorMode?: 'light' | 'dark' | 'system';
};

/**
 * Island for the `/e2d` gallery route: one docs demo wrapped in the design-system
 * providers, so the harness-driven browser suite can exercise demos outside the docs
 * page chrome (and honor `?direction=rtl` / `?colorMode=dark`).
 */
export default function DemoE2D({
  id,
  direction = 'ltr',
  colorMode = 'system',
}: DemoE2DProps): JSX.Element {
  // Hydration marker for the browser suite: SSR'd islands put the interactive button in
  // the HTML long before React attaches handlers, so specs wait for this attribute.
  useEffect(() => {
    document.documentElement.setAttribute('data-e2d-hydrated', '');
    return () => document.documentElement.removeAttribute('data-e2d-hydrated');
  }, []);

  const Preview = reactDemoMap[id];
  return (
    <DesignSystemProvider direction={direction} colorMode={colorMode}>
      <IconProvider icons={defaultIcons}>{createElement(Preview)}</IconProvider>
    </DesignSystemProvider>
  );
}
