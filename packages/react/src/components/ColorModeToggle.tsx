import type { ComponentPropsWithRef, JSX, ReactNode } from 'react';
import { useContext } from 'react';
import type { ControlSize, IconName } from '@var-ui/core';
import {
  ColorModeContext,
  type ColorMode,
  type ResolvedColorMode,
  useResolvedColorMode,
} from '../colorMode';
import { Icon } from '../icons';
import { SegmentedControl, type SegmentedControlOption } from './SegmentedControl';

export type ColorModeToggleAppearance = 'icons' | 'labels' | 'iconsAndLabels';

export type ColorModeToggleProps = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'onChange' | 'color'
> & {
  /**
   * When true, includes a System segment alongside Light and Dark.
   * @default false
   */
  includeSystem?: boolean;
  /**
   * How each segment is labeled.
   * @default 'icons'
   */
  appearance?: ColorModeToggleAppearance;
  /** Controlled color mode. Pair with `onColorModeChange` to opt out of context. */
  colorMode?: ColorMode;
  /** Controlled change handler. Pair with `colorMode` to opt out of context. */
  onColorModeChange?: (colorMode: ColorMode) => void;
  /**
   * Controlled resolved mode (light/dark). Used when `includeSystem` is false and the
   * preference is `'system'`. Defaults to media-query resolution when omitted.
   */
  resolvedColorMode?: ResolvedColorMode;
  size?: ControlSize;
  /**
   * Text of each segment (visible with `labels`, the accessible name with `icons`).
   * @default { light: 'Light', dark: 'Dark', system: 'System' }
   */
  labels?: Partial<Record<ColorMode, string>>;
  /** Accessible name for the control group. @default 'Color mode' */
  'aria-label'?: string;
};

const MODE_ICONS: Record<ColorMode, IconName> = {
  light: 'colorModeLight',
  dark: 'colorModeDark',
  system: 'colorModeSystem',
};

const DEFAULT_LABELS: Record<ColorMode, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

function modeLabel(
  mode: ColorMode,
  appearance: ColorModeToggleAppearance,
  text: string,
): ReactNode {
  const icon = <Icon name={MODE_ICONS[mode]} />;
  if (appearance === 'labels') return text;
  if (appearance === 'iconsAndLabels') {
    return (
      <>
        {icon} {text}
      </>
    );
  }
  return icon;
}

function buildOptions(
  modes: ColorMode[],
  appearance: ColorModeToggleAppearance,
  labels: Record<ColorMode, string>,
): SegmentedControlOption[] {
  return modes.map((mode) => ({
    value: mode,
    label: modeLabel(mode, appearance, labels[mode]),
    ...(appearance === 'icons' ? { 'aria-label': labels[mode] } : {}),
  }));
}

function useColorModeToggleState({
  colorMode: colorModeProp,
  onColorModeChange,
  resolvedColorMode: resolvedColorModeProp,
}: Pick<ColorModeToggleProps, 'colorMode' | 'onColorModeChange' | 'resolvedColorMode'>): {
  colorMode: ColorMode;
  resolvedColorMode: ResolvedColorMode;
  setColorMode: (colorMode: ColorMode) => void;
  colorModeReady: boolean;
} {
  const ctx = useContext(ColorModeContext);
  const isFullyControlled = colorModeProp !== undefined && onColorModeChange !== undefined;
  const colorMode = (colorModeProp ?? ctx?.colorMode ?? 'light') as ColorMode;
  const resolvedFromMedia = useResolvedColorMode(colorMode);
  const resolvedColorMode = resolvedColorModeProp ?? resolvedFromMedia;

  if (!isFullyControlled && !ctx) {
    throw new Error(
      'ColorModeToggle must be used inside DesignSystemProvider, or pass both colorMode and onColorModeChange',
    );
  }

  const setColorMode = onColorModeChange ?? ctx!.setColorMode;
  // Controlled usage is always ready; context without storageKey is ready from the first render.
  const colorModeReady = isFullyControlled ? true : (ctx?.colorModeReady ?? true);
  return { colorMode, resolvedColorMode, setColorMode, colorModeReady };
}

/**
 * Segmented light/dark (and optionally system) color-mode control.
 *
 * Uses {@link DesignSystemProvider} / `useColorMode` by default. Pass both
 * `colorMode` and `onColorModeChange` to drive it yourself (e.g. in tests).
 *
 * ```tsx
 * <ColorModeToggle />
 * <ColorModeToggle includeSystem />
 * <ColorModeToggle appearance="labels" />
 * ```
 */
export function ColorModeToggle({
  includeSystem = false,
  appearance = 'icons',
  colorMode: colorModeProp,
  onColorModeChange,
  resolvedColorMode: resolvedColorModeProp,
  size = 'md',
  labels,
  className,
  'aria-label': ariaLabel = 'Color mode',
  ref,
  ...rest
}: ColorModeToggleProps): JSX.Element {
  const { colorMode, resolvedColorMode, setColorMode, colorModeReady } = useColorModeToggleState({
    colorMode: colorModeProp,
    onColorModeChange,
    resolvedColorMode: resolvedColorModeProp,
  });

  const modes: ColorMode[] = includeSystem ? ['light', 'dark', 'system'] : ['light', 'dark'];
  const selectedId: ColorMode =
    includeSystem || colorMode !== 'system' ? colorMode : resolvedColorMode;

  const onValueChange = (next: string | null): void => {
    if (next === 'light' || next === 'dark' || next === 'system') {
      setColorMode(next);
    }
  };

  return (
    <SegmentedControl
      {...(rest as object)}
      aria-label={ariaLabel}
      className={className}
      ref={ref}
      options={buildOptions(modes, appearance, { ...DEFAULT_LABELS, ...labels })}
      // Avoid selecting `defaultColorMode` for one frame while `storageKey` hydrates —
      // SSR and the first client render both omit selection, then the real preference paints.
      value={colorModeReady ? selectedId : null}
      size={size}
      onValueChange={onValueChange}
    />
  );
}
