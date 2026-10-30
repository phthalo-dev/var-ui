import {
  useImperativeHandle,
  useRef,
  type ChangeEventHandler,
  type ComponentPropsWithRef,
  type CSSProperties,
  type JSX,
  type Ref,
} from 'react';
import {
  Label,
  Slider as AriaSlider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
  type SliderProps as RACSliderProps,
} from 'react-aria-components';
import { slider } from '@var-ui/core/components/slider';
import { mergeProps } from 'typestyles';
import type { FieldMeta } from './Field';
import { FieldFrameDescription, FieldFrameError, useFieldFrame } from './FieldFrame';
import { mergeRacClassName } from '../internal/racClassName';
import { pickRacDroppedDomProps, racRenderWithExtras } from '../internal/racDomProps';
import { toRacProps } from '../internal/racProps';

export type SliderProps = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'className' | 'style' | 'defaultValue' | 'onChange' | 'ref' | 'dir'
> &
  FieldMeta & {
    /** Controlled value. */
    value?: number;
    /** Initial value when uncontrolled. */
    defaultValue?: number;
    /** Called with the new value as the thumb moves. */
    onValueChange?: (value: number) => void;
    /** Called with the final value when the user stops dragging (or releases a key). */
    onValueCommit?: (value: number) => void;
    /**
     * Native change event from the thumb's `<input type="range">` (`event.target` is the input).
     * It is attached on the root in the capture phase, because react-aria stops `change` from
     * bubbling, so `event.currentTarget` is the root and the handler runs before `onValueChange`.
     */
    onChange?: ChangeEventHandler<HTMLInputElement>;
    /** Lowest value. @default 0 */
    min?: number;
    /** Highest value. @default 100 */
    max?: number;
    /** Step between values. @default 1 */
    step?: number;
    /** @default 'horizontal' */
    orientation?: 'horizontal' | 'vertical';
    /** Disables the slider. */
    disabled?: boolean;
    /** Number formatting for the value output. */
    formatOptions?: Intl.NumberFormatOptions;
    /** Name of the thumb's native `<input type="range">`, so the value is included in form submission. */
    name?: string;
    /** Show the current value beside the label. @default true */
    showOutput?: boolean;
    /** Classes for the root element. */
    className?: string;
    /** Inline style for the root element. */
    style?: CSSProperties;
    /** Ref to the thumb's native `<input type="range">` element. */
    ref?: Ref<HTMLInputElement>;
  };

/**
 * Single-thumb slider. `className`/`style` style the root; `ref` and `name`
 * reach the thumb's hidden range `<input>` (the slider has no single visible
 * native control). Other attributes (`data-*`, `aria-*`, `id`) go to the RAC
 * slider root, which is where react-aria expects them.
 */
export function Slider({
  label,
  description,
  errorMessage,
  className,
  showOutput = true,
  name,
  ref,
  onChange,
  value,
  defaultValue,
  onValueChange,
  disabled,
  min,
  max,
  onValueCommit,
  'aria-describedby': describedBy,
  ...props
}: SliderProps): JSX.Element {
  const s = slider();
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);
  const frame = useFieldFrame({ description, errorMessage, describedBy });
  return (
    <AriaSlider
      {...(props as Partial<RACSliderProps>)}
      {...toRacProps({ value, defaultValue, onValueChange, disabled })}
      minValue={min}
      maxValue={max}
      onChangeEnd={onValueCommit}
      render={
        racRenderWithExtras('div', {
          ...pickRacDroppedDomProps(props),
          ...(onChange ? { onChangeCapture: onChange } : {}),
        }) as never
      }
      aria-describedby={frame.controlProps['aria-describedby']}
      className={mergeRacClassName(s.root, className)}
    >
      {label ? (
        <Label {...mergeProps(s.label)}>
          <span>{label}</span>
          {showOutput ? <SliderOutput {...mergeProps(s.output)} /> : null}
        </Label>
      ) : null}
      <SliderTrack {...mergeProps(s.control)}>
        {({ state }) => (
          <>
            <div {...mergeProps(s.track)}>
              <div
                {...mergeProps(s.fill)}
                style={{ width: `${state.getThumbPercent(0) * 100}%` }}
              />
            </div>
            <SliderThumb
              {...mergeProps(s.thumb)}
              name={name}
              inputRef={inputRef}
              style={{
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </>
        )}
      </SliderTrack>
      <FieldFrameDescription slot={s.description} id={frame.descriptionId}>
        {description}
      </FieldFrameDescription>
      <FieldFrameError slot={s.error} id={frame.errorId}>
        {errorMessage}
      </FieldFrameError>
    </AriaSlider>
  );
}
