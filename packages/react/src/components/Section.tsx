import type { HTMLAttributes, JSX, Ref } from 'react';
import { section } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type SectionProps = HTMLAttributes<HTMLElement> & {
  /** Optional heading rendered as an h2 inside the section. */
  title?: string;
  /** Ref to the underlying `<section>` element. */
  ref?: Ref<HTMLElement>;
};

/**
 * Bordered surface region with an optional heading.
 *
 * ```tsx
 * <Section title="Feedback">{demos}</Section>
 * ```
 */
export function Section({ title, className, children, ref, ...props }: SectionProps): JSX.Element {
  const s = section();
  return (
    <section {...props} {...mergeProps(s.root, className)} ref={ref}>
      {title ? <h2 {...mergeProps(s.title)}>{title}</h2> : null}
      {children}
    </section>
  );
}
