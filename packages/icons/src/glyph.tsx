import type { ReactNode } from 'react';

/** Wrap one glyph's inner SVG markup as a React element. */
export function glyphFromInnerHtml(innerHtml: string): ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
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
