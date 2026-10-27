import type { JSX, ReactNode, Ref } from 'react';
import { useContext } from 'react';
import type { Key, Selection } from 'react-aria-components';
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

export type ColorModeToggleProps = {
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
  className?: string;
  /** Accessible name for the control group. @default 'Color mode' */
  'aria-label'?: string;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

const MODE_META: Record<ColorMode, { label: string; icon: IconName }> = {
  light: { label: 'Light', icon: 'colorModeLight' },
  dark: { label: 'Dark', icon: 'colorModeDark' },
  system: { label: 'System', icon: 'colorModeSystem' },
};

function modeLabel(mode: ColorMode, appearance: ColorModeToggleAppearance): ReactNode {
  const meta = MODE_META[mode];
  const icon = <Icon name={meta.icon} />;
  if (appearance === 'labels') return meta.label;
  if (appearance === 'iconsAndLabels') {
    return (
      <>
        {icon} {meta.label}
      </>
    );
  }
  return icon;
}

function buildOptions(
  modes: ColorMode[],
  appearance: ColorModeToggleAppearance,
): SegmentedControlOption[] {
  return modes.map((mode) => {
    const meta = MODE_META[mode];
    return {
      id: mode,
      label: modeLabel(mode, appearance),
      ...(appearance === 'icons' ? { 'aria-label': meta.label } : {}),
    };
  });
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
  className,
  'aria-label': ariaLabel = 'Color mode',
  ref,
}: ColorModeToggleProps): JSX.Element {
  const { colorMode, resolvedColorMode, setColorMode, colorModeReady } = useColorModeToggleState({
    colorMode: colorModeProp,
    onColorModeChange,
    resolvedColorMode: resolvedColorModeProp,
  });

  const modes: ColorMode[] = includeSystem ? ['light', 'dark', 'system'] : ['light', 'dark'];
  const selectedId: ColorMode =
    includeSystem || colorMode !== 'system' ? colorMode : resolvedColorMode;

  const onSelectionChange = (keys: Selection): void => {
    if (keys === 'all') return;
    const next = (keys as Set<Key>).values().next().value;
    if (next === 'light' || next === 'dark' || next === 'system') {
      setColorMode(next);
    }
  };

  return (
    <SegmentedControl
      aria-label={ariaLabel}
      className={className}
      ref={ref}
      options={buildOptions(modes, appearance)}
      // Avoid selecting `defaultColorMode` for one frame while `storageKey` hydrates —
      // SSR and the first client render both omit selection, then the real preference paints.
      selectedKeys={colorModeReady ? [selectedId] : []}
      selectionMode="single"
      size={size}
      onSelectionChange={onSelectionChange}
    />
  );
}
