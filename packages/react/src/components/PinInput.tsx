import type { ChangeEvent, ClipboardEvent, JSX, KeyboardEvent, Ref } from 'react';
import { useCallback, useId, useRef, useState } from 'react';
import { Label } from 'react-aria-components';
import { pinInput, type PinInputVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';
import type { FieldMeta } from './Field';

export type PinInputType = 'numeric' | 'alphanumeric';

export type PinInputProps = FieldMeta & {
  /** Number of digit cells. @default 4 */
  length?: number;
  /** Controlled value — one character per cell, no separators. */
  value?: string;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string;
  /** Called when any cell changes. */
  onChange?: (value: string) => void;
  /** Called once when every cell is filled. */
  onComplete?: (value: string) => void;
  /** Accepted characters. @default numeric */
  type?: PinInputType;
  size?: NonNullable<PinInputVariantProps['size']>;
  isDisabled?: boolean;
  isRequired?: boolean;
  autoFocus?: boolean;
  /** Name of a hidden input carrying the joined value, so the PIN is included in form submission. */
  name?: string;
  className?: string;
  'aria-label'?: string;
  /** Ref to the root `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

function normalizeChar(char: string, type: PinInputType): string | null {
  if (type === 'numeric') {
    return /^\d$/.test(char) ? char : null;
  }
  return /^[a-zA-Z0-9]$/.test(char) ? char.toUpperCase() : null;
}

function charsFromValue(value: string, length: number, type: PinInputType): string[] {
  const cells = Array.from({ length }, () => '');
  let index = 0;
  for (const char of value) {
    if (index >= length) break;
    const normalized = normalizeChar(char, type);
    if (normalized) {
      cells[index] = normalized;
      index += 1;
    }
  }
  return cells;
}

function valueFromChars(chars: string[]): string {
  return chars.join('');
}

export function PinInput({
  label,
  description,
  errorMessage,
  length = 4,
  value: controlledValue,
  defaultValue = '',
  onChange,
  onComplete,
  type = 'numeric',
  size = 'md',
  isDisabled,
  isRequired,
  autoFocus,
  name,
  className,
  'aria-label': ariaLabel,
  ref,
}: PinInputProps): JSX.Element {
  const p = pinInput({ size });
  const labelId = useId();
  const descriptionId = useId();
  const errorId = useId();
  const describedBy =
    [description ? descriptionId : null, errorMessage ? errorId : null].filter(Boolean).join(' ') ||
    undefined;
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const isControlled = controlledValue !== undefined;
  const [uncontrolledChars, setUncontrolledChars] = useState(() =>
    charsFromValue(defaultValue, length, type),
  );

  const chars = isControlled ? charsFromValue(controlledValue, length, type) : uncontrolledChars;

  const setChars = useCallback(
    (nextChars: string[]) => {
      const nextValue = valueFromChars(nextChars);
      if (!isControlled) {
        setUncontrolledChars(nextChars);
      }
      onChange?.(nextValue);
      if (nextValue.length === length && !nextChars.includes('')) {
        onComplete?.(nextValue);
      }
    },
    [isControlled, length, onChange, onComplete],
  );

  const focusCell = (index: number) => {
    const input = inputRefs.current[index];
    input?.focus();
    input?.select();
  };

  const updateCell = (index: number, char: string) => {
    const nextChars = [...chars];
    nextChars[index] = char;
    setChars(nextChars);
    if (char && index < length - 1) {
      focusCell(index + 1);
    }
  };

  const applyPastedValue = (index: number, pasted: string) => {
    const nextChars = [...chars];
    let cursor = index;
    for (const char of pasted) {
      if (cursor >= length) break;
      const normalized = normalizeChar(char, type);
      if (normalized) {
        nextChars[cursor] = normalized;
        cursor += 1;
      }
    }
    setChars(nextChars);
    focusCell(Math.min(cursor, length - 1));
  };

  const handleChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    if (!raw) {
      updateCell(index, '');
      return;
    }
    const char = raw[raw.length - 1] ?? '';
    const normalized = normalizeChar(char, type);
    if (normalized) {
      updateCell(index, normalized);
    } else {
      event.target.value = chars[index] ?? '';
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      if (chars[index]) {
        updateCell(index, '');
        return;
      }
      if (index > 0) {
        event.preventDefault();
        updateCell(index - 1, '');
        focusCell(index - 1);
      }
      return;
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      focusCell(index - 1);
      return;
    }

    if (event.key === 'ArrowRight' && index < length - 1) {
      event.preventDefault();
      focusCell(index + 1);
    }
  };

  const handlePaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    applyPastedValue(index, event.clipboardData.getData('text'));
  };

  const groupLabel = ariaLabel ?? label;

  return (
    <div {...mergeProps(p.root, className)} ref={ref}>
      {label ? (
        <Label {...mergeProps(p.label)} id={labelId}>
          {label}
        </Label>
      ) : null}
      <div
        {...mergeProps(p.group)}
        role="group"
        aria-labelledby={label ? labelId : undefined}
        aria-label={label ? undefined : groupLabel}
        data-disabled={isDisabled ? true : undefined}
      >
        {chars.map((char, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            {...mergeProps(p.cell)}
            type="text"
            inputMode={type === 'numeric' ? 'numeric' : 'text'}
            pattern={type === 'numeric' ? '[0-9]*' : undefined}
            maxLength={1}
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            aria-label={
              groupLabel
                ? `${groupLabel}, digit ${index + 1} of ${length}`
                : `Digit ${index + 1} of ${length}`
            }
            aria-required={isRequired || undefined}
            aria-invalid={errorMessage ? true : undefined}
            aria-describedby={describedBy}
            value={char}
            disabled={isDisabled}
            autoFocus={autoFocus && index === 0 ? true : undefined}
            onChange={(event) => handleChange(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={(event) => handlePaste(index, event)}
            onFocus={(event) => event.currentTarget.select()}
          />
        ))}
      </div>
      {name ? (
        <input type="hidden" name={name} value={valueFromChars(chars)} disabled={isDisabled} />
      ) : null}
      {description ? (
        <p {...mergeProps(p.description)} id={descriptionId}>
          {description}
        </p>
      ) : null}
      {errorMessage ? (
        <p {...mergeProps(p.error)} id={errorId}>
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
