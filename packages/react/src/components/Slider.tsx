import { useImperativeHandle, useRef, type JSX, type Ref } from 'react';
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

export type SliderProps = Omit<RACSliderProps, 'children'> &
  FieldMeta & {
    /** Name of the thumb's native `<input type="range">`, so the value is included in form submission. */
    name?: string;
    /** Show the current value beside the label. @default true */
    showOutput?: boolean;
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
  'aria-describedby': describedBy,
  ...props
}: SliderProps): JSX.Element {
  const s = slider();
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);
  const frame = useFieldFrame({ description, errorMessage, describedBy });
  return (
    <AriaSlider
      {...props}
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
