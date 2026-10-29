import type { ComponentPropsWithRef, JSX, ReactNode, Ref } from 'react';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ToggleButton as AriaToggleButton,
  ToggleButtonGroup as AriaToggleButtonGroup,
  type ToggleButtonGroupProps as RACToggleButtonGroupProps,
  type ToggleButtonProps as RACToggleButtonProps,
} from 'react-aria-components';
import { segmentedControl } from '@var-ui/core/components/segmentedControl';
import { toggleButton } from '@var-ui/core/components/toggleButton';
import type { SegmentedControlVariantProps, ToggleButtonVariantProps } from '@var-ui/core';
import { observeSegmentedControlIndicator } from '@var-ui/core/components/indicators/segmented-control';
import { mergeProps } from 'typestyles';
import { mergeRefs } from '../internal/mergeRefs';
import { useControlSize } from '../internal/controlSizeContext';
import { pickRacDroppedDomProps, racRenderWithExtras } from '../internal/racDomProps';

export type SegmentedControlOption = {
  id: string;
  label: ReactNode;
  /** Accessible name when `label` is not plain text (e.g. icon-only segments). */
  'aria-label'?: string;
};

export type SegmentedControlProps = Omit<RACToggleButtonGroupProps, 'children' | 'className'> &
  Omit<
    ComponentPropsWithRef<'div'>,
    keyof RACToggleButtonGroupProps | 'className' | 'children' | 'style'
  > & {
    /** Segment definitions rendered as toggle buttons. */
    options: SegmentedControlOption[];
    className?: string;
    /** Control density. Falls back to the surrounding control size, then `md`. */
    size?: NonNullable<SegmentedControlVariantProps['size']>;
    /**
     * Ref to the `role="group"` element. A segmented control has no single native control, so
     * this is the nearest real element; each segment is a toggle button.
     */
    ref?: Ref<HTMLDivElement>;
  };

/**
 * Single-select segmented control built on `ToggleButtonGroup`.
 *
 * ```tsx
 * <SegmentedControl options={[{ id: 'list', label: 'List' }, { id: 'grid', label: 'Grid' }]} />
 * ```
 */
export function SegmentedControl({
  options,
  className,
  size,
  selectionMode = 'single',
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  ref,
  ...props
}: SegmentedControlProps): JSX.Element {
  const contextSize = useControlSize();
  const s = segmentedControl({ size: size ?? contextSize ?? 'md' });
  const t = toggleButton({ segmented: true });
  const rootRef = useRef<HTMLDivElement>(null);
  const setRoot = useMemo(() => mergeRefs(rootRef, ref), [ref]);
  const isControlled = selectedKeys !== undefined;
  const [uncontrolledKeys, setUncontrolledKeys] = useState(
    defaultSelectedKeys ?? (options[0] ? [options[0].id] : []),
  );
  const activeKeys = isControlled ? selectedKeys : uncontrolledKeys;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    return observeSegmentedControlIndicator(root);
  }, [activeKeys, options]);

  return (
    <AriaToggleButtonGroup
      {...props}
      ref={setRoot}
      selectionMode={selectionMode}
      selectedKeys={selectedKeys}
      defaultSelectedKeys={defaultSelectedKeys}
      onSelectionChange={(keys) => {
        if (!isControlled) {
          setUncontrolledKeys([...keys]);
        }
        onSelectionChange?.(keys);
      }}
      {...mergeProps(s.root, className)}
    >
      {options.map((option) => (
        <AriaToggleButton
          key={option.id}
          id={option.id}
          aria-label={option['aria-label']}
          {...mergeProps(t)}
        >
          {option.label}
        </AriaToggleButton>
      ))}
    </AriaToggleButtonGroup>
  );
}

export type ToggleButtonProps = Omit<RACToggleButtonProps, 'className'> &
  Omit<
    ComponentPropsWithRef<'button'>,
    keyof RACToggleButtonProps | 'className' | 'children' | 'style'
  > & {
    /** Additional CSS class names merged onto the root element. */
    className?: string;
    size?: NonNullable<ToggleButtonVariantProps['size']>;
    /** Ref to the underlying `<button>` element. */
    ref?: Ref<HTMLButtonElement>;
  };

/** Standalone toggle button for toolbars and filters. */
export function ToggleButton({
  className,
  size = 'md',
  children,
  ref,
  ...props
}: ToggleButtonProps): JSX.Element {
  const t = toggleButton({ size });
  const extras = pickRacDroppedDomProps(props);
  return (
    <AriaToggleButton
      {...(props as RACToggleButtonProps)}
      {...mergeProps(t, className)}
      render={
        racRenderWithExtras(
          'button',
          extras,
          (props as RACToggleButtonProps).render as never,
        ) as never
      }
      ref={ref}
    >
      {children}
    </AriaToggleButton>
  );
}
