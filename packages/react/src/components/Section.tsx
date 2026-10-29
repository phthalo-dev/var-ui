import type { ComponentPropsWithRef, JSX } from 'react';
import { section } from '@var-ui/core/components/section';
import { mergeProps } from 'typestyles';

export type SectionProps = ComponentPropsWithRef<'section'> & {
  /** Optional heading rendered inside the section. */
  title?: string;
  /** Semantic level of the title heading. @default 2 */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
};

/**
 * Bordered surface region with an optional heading.
 *
 * ```tsx
 * <Section title="Feedback">{demos}</Section>
 * ```
 */
export function Section({
  title,
  headingLevel = 2,
  className,
  children,
  ref,
  ...props
}: SectionProps): JSX.Element {
  const s = section();
  const Heading = `h${headingLevel}` as const;
  return (
    <section {...props} {...mergeProps(s.root, className)} ref={ref}>
      {title ? <Heading {...mergeProps(s.title)}>{title}</Heading> : null}
      {children}
    </section>
  );
}
