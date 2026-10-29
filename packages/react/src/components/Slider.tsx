import type { JSX, Ref } from 'react';
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

export type SliderProps = Omit<RACSliderProps, 'className'> &
  FieldMeta & {
    className?: string;
    /** Show the current value beside the label. @default true */
    showOutput?: boolean;
    /** Ref to the underlying `<div>` element. */
    ref?: Ref<HTMLDivElement>;
  };

export function Slider({
  label,
  description,
  errorMessage,
  className,
  showOutput = true,
  ref,
  ...props
}: SliderProps): JSX.Element {
  const s = slider();
  return (
    <AriaSlider {...props} {...mergeProps(s.root, className)} ref={ref}>
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
              style={{
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </>
        )}
      </SliderTrack>
      {description ? <p {...mergeProps(s.description)}>{description}</p> : null}
      {errorMessage ? <p {...mergeProps(s.error)}>{errorMessage}</p> : null}
    </AriaSlider>
  );
}
