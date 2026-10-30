import type {
  ChangeEvent,
  ClipboardEvent,
  ComponentPropsWithRef,
  CSSProperties,
  JSX,
  KeyboardEvent,
  Ref,
} from 'react';
import { useCallback, useRef, useState } from 'react';
import { pinInput } from '@var-ui/core/components/pinInput';
import type { PinInputVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';
import type { FieldMeta } from './Field';
import { FieldFrame, useFieldFrame } from './FieldFrame';
import { useControlSize } from '../internal/controlSizeContext';

export type PinInputCharacters = 'numeric' | 'alphanumeric';

export type PinInputProps = Omit<
  ComponentPropsWithRef<'div'>,
  | 'defaultValue'
  | 'className'
  | 'style'
  | 'ref'
  | 'children'
  | 'role'
  | 'aria-labelledby'
  | 'aria-label'
> &
  FieldMeta & {
    /** Number of digit cells. @default 4 */
    length?: number;
    /** Controlled value — one character per cell, no separators. */
    value?: string;
    /** Initial value for uncontrolled usage. */
    defaultValue?: string;
    /** Called with the joined value whenever any cell changes. */
    onValueChange?: (value: string) => void;
    /** Called once when every cell is filled. */
    onComplete?: (value: string) => void;
    /** Accepted characters. @default 'numeric' */
    characters?: PinInputCharacters;
    size?: NonNullable<PinInputVariantProps['size']>;
    /** Marks the cells invalid; defaults to whether `errorMessage` is set. */
    invalid?: boolean;
    /** Disables every cell. */
    disabled?: boolean;
    /** Marks the cells required. */
    required?: boolean;
    autoFocus?: boolean;
    /** Name of a hidden input carrying the joined value, so the PIN is included in form submission. */
    name?: string;
    /** Accessible name when there is no visible `label`. */
    'aria-label'?: string;
    /**
     * Accessible name of each cell. Receives the zero-based cell index, the cell count and the
     * group's name (`aria-label` or `label`).
     * @default (index, length, groupLabel) => `${groupLabel}, digit ${index + 1} of ${length}`
     */
    getCellLabel?: (index: number, length: number, groupLabel: string | undefined) => string;
    /** Additional CSS class names merged onto the root element. */
    className?: string;
    /** Inline style for the root element. */
    style?: CSSProperties;
    /** Ref to the first cell's `<input>` element. */
    ref?: Ref<HTMLInputElement>;
  };

function defaultCellLabel(index: number, length: number, groupLabel: string | undefined): string {
  return groupLabel
    ? `${groupLabel}, digit ${index + 1} of ${length}`
    : `Digit ${index + 1} of ${length}`;
}

function normalizeChar(char: string, characters: PinInputCharacters): string | null {
  if (characters === 'numeric') {
    return /^\d$/.test(char) ? char : null;
  }
  return /^[a-zA-Z0-9]$/.test(char) ? char.toUpperCase() : null;
}

function charsFromValue(value: string, length: number, characters: PinInputCharacters): string[] {
  const cells = Array.from({ length }, () => '');
  let index = 0;
  for (const char of value) {
    if (index >= length) break;
    const normalized = normalizeChar(char, characters);
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
  onValueChange,
  onComplete,
  characters = 'numeric',
  size,
  invalid,
  disabled,
  required,
  autoFocus,
  name,
  getCellLabel = defaultCellLabel,
  className,
  style,
  'aria-label': ariaLabel,
  ref,
  id,
  'aria-describedby': userDescribedBy,
  ...rest
}: PinInputProps): JSX.Element {
  const contextSize = useControlSize();
  const p = pinInput({ size: size ?? contextSize ?? 'md' });
  const frame = useFieldFrame({
    description,
    errorMessage,
    invalid,
    id,
    describedBy: userDescribedBy,
  });
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const isControlled = controlledValue !== undefined;
  const [uncontrolledChars, setUncontrolledChars] = useState(() =>
    charsFromValue(defaultValue, length, characters),
  );

  const chars = isControlled
    ? charsFromValue(controlledValue, length, characters)
    : uncontrolledChars;

  const setChars = useCallback(
    (nextChars: string[]) => {
      const nextValue = valueFromChars(nextChars);
      if (!isControlled) {
        setUncontrolledChars(nextChars);
      }
      onValueChange?.(nextValue);
      if (nextValue.length === length && !nextChars.includes('')) {
        onComplete?.(nextValue);
      }
    },
    [isControlled, length, onValueChange, onComplete],
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
      const normalized = normalizeChar(char, characters);
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
    const normalized = normalizeChar(char, characters);
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
    <FieldFrame
      slots={p}
      frame={frame}
      label={label}
      description={description}
      errorMessage={errorMessage}
      className={className}
      style={style}
    >
      <div
        {...rest}
        {...mergeProps(p.group)}
        role="group"
        aria-labelledby={label ? frame.labelId : undefined}
        aria-label={label ? undefined : groupLabel}
        data-disabled={disabled ? true : undefined}
      >
        {chars.map((char, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
              if (index !== 0) return;
              if (typeof ref === 'function') ref(element);
              else if (ref) ref.current = element;
            }}
            {...mergeProps(p.cell)}
            id={index === 0 ? frame.controlId : undefined}
            type="text"
            inputMode={characters === 'numeric' ? 'numeric' : 'text'}
            pattern={characters === 'numeric' ? '[0-9]*' : undefined}
            maxLength={1}
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            aria-label={getCellLabel(index, length, groupLabel)}
            aria-required={required || undefined}
            aria-invalid={frame.controlProps['aria-invalid']}
            aria-describedby={frame.controlProps['aria-describedby']}
            value={char}
            disabled={disabled}
            autoFocus={autoFocus && index === 0 ? true : undefined}
            onChange={(event) => handleChange(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={(event) => handlePaste(index, event)}
            onFocus={(event) => event.currentTarget.select()}
          />
        ))}
      </div>
      {name ? (
        <input type="hidden" name={name} value={valueFromChars(chars)} disabled={disabled} />
      ) : null}
    </FieldFrame>
  );
}
