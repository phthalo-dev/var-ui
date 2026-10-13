import { cx } from 'typestyles';
import { breakpoint, typestyles } from '../runtime';

export type HiddenBreakpoint = 'sm' | 'md' | 'lg' | 'xl';
export type HiddenMap = Partial<Record<'base' | HiddenBreakpoint, boolean>>;

const HIDDEN_BREAKPOINTS = ['sm', 'md', 'lg', 'xl'] as const satisfies readonly HiddenBreakpoint[];
const layer = { layer: 'utilities' as const };

export function hiddenStyle(hide?: boolean | HiddenMap): Record<string, unknown> {
  if (hide === true) return { display: 'none' };
  if (hide === false || hide == null || Object.keys(hide).length === 0) {
    return { display: 'contents' };
  }
  const style: Record<string, unknown> = {};
  if ('base' in hide) {
    style.display = hide.base ? 'none' : 'contents';
  } else {
    style.display = 'contents';
  }
  for (const bp of HIDDEN_BREAKPOINTS) {
    if (bp in hide) {
      style[breakpoint(bp, 'min')] = { display: hide[bp] ? 'none' : 'contents' };
    }
  }
  return style;
}

const hiddenAlways = typestyles.style('hidden-always', { display: 'none' }, layer);
const hiddenBaseTrue = typestyles.style('hidden-base-true', { display: 'none' }, layer);
const hiddenBaseFalse = typestyles.style('hidden-base-false', { display: 'contents' }, layer);

const hiddenAt = {
  sm: {
    true: typestyles.style(
      'hidden-sm-true',
      { [breakpoint('sm', 'min')]: { display: 'none' } },
      layer,
    ),
    false: typestyles.style(
      'hidden-sm-false',
      { [breakpoint('sm', 'min')]: { display: 'contents' } },
      layer,
    ),
  },
  md: {
    true: typestyles.style(
      'hidden-md-true',
      { [breakpoint('md', 'min')]: { display: 'none' } },
      layer,
    ),
    false: typestyles.style(
      'hidden-md-false',
      { [breakpoint('md', 'min')]: { display: 'contents' } },
      layer,
    ),
  },
  lg: {
    true: typestyles.style(
      'hidden-lg-true',
      { [breakpoint('lg', 'min')]: { display: 'none' } },
      layer,
    ),
    false: typestyles.style(
      'hidden-lg-false',
      { [breakpoint('lg', 'min')]: { display: 'contents' } },
      layer,
    ),
  },
  xl: {
    true: typestyles.style(
      'hidden-xl-true',
      { [breakpoint('xl', 'min')]: { display: 'none' } },
      layer,
    ),
    false: typestyles.style(
      'hidden-xl-false',
      { [breakpoint('xl', 'min')]: { display: 'contents' } },
      layer,
    ),
  },
} as const;

export function hiddenClassName(options: { hide?: boolean | HiddenMap } = {}): string {
  const hide = options.hide;
  if (hide === true) return hiddenAlways;
  if (
    hide === false ||
    hide == null ||
    (typeof hide === 'object' && Object.keys(hide).length === 0)
  ) {
    return hiddenBaseFalse;
  }
  const classes: string[] = [];
  if ('base' in hide) {
    classes.push(hide.base ? hiddenBaseTrue : hiddenBaseFalse);
  } else {
    classes.push(hiddenBaseFalse);
  }
  for (const bp of HIDDEN_BREAKPOINTS) {
    if (bp in hide) {
      classes.push(hide[bp] ? hiddenAt[bp].true : hiddenAt[bp].false);
    }
  }
  return cx(...classes);
}
