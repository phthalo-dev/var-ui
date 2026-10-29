import { mergeProps } from 'typestyles';

type ClassNameProp<R> = string | ((renderProps: R) => string) | undefined;

/**
 * Builds a RAC-compatible `className` (string or render-prop function) that
 * merges the recipe's root class with a caller-supplied `className`, which
 * may itself be a string or RAC's render-prop function form.
 */
export function mergeRacClassName<R>(
  recipeRoot: Parameters<typeof mergeProps>[0],
  className: ClassNameProp<R>,
): string | ((renderProps: R) => string) {
  if (typeof className === 'function') {
    return (renderProps) => mergeProps(recipeRoot, className(renderProps)).className ?? '';
  }
  return mergeProps(recipeRoot, className).className ?? '';
}
