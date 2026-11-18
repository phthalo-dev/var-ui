import type { ReactNode } from 'react';

/** Wrap one glyph's inner SVG markup as a React element (24×24 grid unless `size` says otherwise). */
export function glyphFromInnerHtml(innerHtml: string, size = 24): ReactNode {
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: innerHtml }}
    />
  );
}
