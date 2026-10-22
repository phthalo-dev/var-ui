import type { HTMLAttributes, JSX } from 'react';
import { section } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type SectionProps = HTMLAttributes<HTMLElement> & {
  /** Optional heading rendered as an h2 inside the section. */
  title?: string;
};

/**
 * Bordered surface region with an optional heading.
 *
 * ```tsx
 * <Section title="Feedback">{demos}</Section>
 * ```
 */
export function Section({ title, className, children, ...props }: SectionProps): JSX.Element {
  const s = section();
  return (
    <section {...props} {...mergeProps(s.root, className)}>
      {title ? <h2 {...mergeProps(s.title)}>{title}</h2> : null}
      {children}
    </section>
  );
}
