import { isRTL } from 'react-aria-components';

export type Direction = 'ltr' | 'rtl';

export const RTL_I18N_FALLBACK_LOCALE = 'ar';
/** Reset locale for an explicit LTR island so nested providers do not inherit a parent RTL I18nProvider. */
export const LTR_I18N_FALLBACK_LOCALE = 'en-US';

export function resolveDirection(options: { direction?: Direction; locale?: string }): Direction {
  if (options.direction) return options.direction;
  if (options.locale && isRTL(options.locale)) return 'rtl';
  return 'ltr';
}

export function resolveI18nProviderLocale(options: {
  direction: Direction;
  /** Unresolved `direction` prop — distinguishes explicit `ltr` from the default. */
  directionProp?: Direction;
  locale?: string;
}): string | undefined {
  if (options.locale) return options.locale;
  if (options.direction === 'rtl') return RTL_I18N_FALLBACK_LOCALE;
  if (options.directionProp === 'ltr') return LTR_I18N_FALLBACK_LOCALE;
  return undefined;
}
