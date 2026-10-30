import { designTokens as t } from '../tokens';

type Speed = keyof Pick<typeof t.duration, 'fast' | 'medium' | 'slow'>;
type Curve = keyof typeof t.easing;

/**
 * `transition` value for a property list the `t.transition.*` tokens do not cover, built from the
 * duration and easing tokens so it collapses under reduced motion like they do.
 *
 * ```ts
 * transition: transitionOf(['transform', 'width'], 'slow', 'emphasized')
 * ```
 */
export function transitionOf(
  properties: string | readonly string[],
  speed: Speed = 'medium',
  curve: Curve = 'standard',
): string {
  const list = typeof properties === 'string' ? [properties] : properties;
  return list
    .map((property) => `${property} ${t.duration[speed].var} ${t.easing[curve].var}`)
    .join(', ');
}
