import {
  useRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithRef,
  type CSSProperties,
  type DragEvent,
  type JSX,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import { fileInput } from '@var-ui/core/components/fileInput';
import { Icon } from '../icons';
import { mergeProps } from 'typestyles';
import { FieldFrame, useFieldFrame } from './FieldFrame';
import { useMergedRef } from '../overlays/useMergedRef';

export type FileInputProps = Omit<
  ComponentPropsWithRef<'input'>,
  | 'type'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'disabled'
  | 'children'
  | 'className'
  | 'style'
  | 'size'
> & {
  /** Visible label rendered above the dropzone. */
  label: string;
  /** Helper text shown below the control when there is no error. */
  description?: string;
  /** Validation message; when set, takes precedence over internally-derived validation errors. */
  errorMessage?: string;
  /** Selected file(s); `File[]` when `multiple`, otherwise a single `File` or `null`. */
  value: File | File[] | null;
  /** Called with the new selection, or `null` when cleared. */
  onChange: (files: File | File[] | null) => void;
  /** Maximum size per file, in bytes. Oversized files are rejected. */
  maxSize?: number;
  /** Maximum number of files accepted when `multiple`. Extra files are rejected. */
  maxFiles?: number;
  /** Disables the dropzone: blocks click, keyboard activation, and drop. */
  isDisabled?: boolean;
  /**
   * Text shown in the dropzone while nothing is selected.
   * @default 'Choose file' ('Choose files' when `multiple`)
   */
  chooseLabel?: string;
  /**
   * Accessible name of the clear button.
   * @default `Clear ${label}`
   */
  clearLabel?: string;
  /**
   * Summary shown when more than one file is selected.
   * @default (count) => `${count} files selected`
   */
  filesSelectedLabel?: (count: number) => string;
  /**
   * Error for a file that does not match `accept`.
   * @default (name) => `${name} is not an accepted file type.`
   */
  invalidTypeMessage?: (fileName: string) => string;
  /**
   * Error for a file over `maxSize`; `maxSize` is already formatted (e.g. `5.0 MB`).
   * @default (name, maxSize) => `${name} exceeds the maximum size of ${maxSize}.`
   */
  tooLargeMessage?: (fileName: string, maxSize: string) => string;
  /**
   * Error when more than `maxFiles` files are chosen.
   * @default (max) => `Only ${max} file(s) allowed.`
   */
  tooManyMessage?: (maxFiles: number) => string;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /** Inline style for the root element. */
  style?: CSSProperties;
};

function matchesAccept(file: File, accept: string): boolean {
  const patterns = accept
    .split(',')
    .map((pattern) => pattern.trim().toLowerCase())
    .filter(Boolean);
  if (patterns.length === 0) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return patterns.some((pattern) => {
    if (pattern.startsWith('.')) {
      return name.endsWith(pattern);
    }
    if (pattern.endsWith('/*')) {
      return type.startsWith(pattern.slice(0, -1));
    }
    return type === pattern;
  });
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type ValidateOptions = {
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  invalidTypeMessage: (fileName: string) => string;
  tooLargeMessage: (fileName: string, maxSize: string) => string;
  tooManyMessage: (maxFiles: number) => string;
};

/** Puts files into the native input so `FormData` and `form.reset()` see them (no-op without `DataTransfer`). */
function setNativeFiles(input: HTMLInputElement | null, files: File[]): void {
  if (!input || typeof DataTransfer === 'undefined') return;
  try {
    const transfer = new DataTransfer();
    for (const file of files) transfer.items.add(file);
    input.files = transfer.files;
  } catch {
    // Older browsers cannot assign `input.files`; the picker path still works.
  }
}

function validateFiles(
  files: File[],
  {
    accept,
    maxSize,
    maxFiles,
    invalidTypeMessage,
    tooLargeMessage,
    tooManyMessage,
  }: ValidateOptions,
): { valid: File[]; error: string | null } {
  let valid = files;
  let error: string | null = null;

  if (accept) {
    const rejected = valid.find((file) => !matchesAccept(file, accept));
    if (rejected && !error) {
      error = invalidTypeMessage(rejected.name);
    }
    valid = valid.filter((file) => matchesAccept(file, accept));
  }

  if (maxSize !== undefined) {
    const rejected = valid.find((file) => file.size > maxSize);
    if (rejected && !error) {
      error = tooLargeMessage(rejected.name, formatSize(maxSize));
    }
    valid = valid.filter((file) => file.size <= maxSize);
  }

  if (maxFiles !== undefined && valid.length > maxFiles) {
    if (!error) {
      error = tooManyMessage(maxFiles);
    }
    valid = valid.slice(0, maxFiles);
  }

  return { valid, error };
}

/**
 * File picker: click-to-browse or drag-and-drop dropzone with field chrome,
 * client-side `accept`/`maxSize`/`maxFiles` validation, and a clear control
 * once a file is selected.
 *
 * ```tsx
 * <FileInput
 *   label="Resume"
 *   value={file}
 *   onChange={setFile}
 *   accept=".pdf,.doc,.docx"
 *   maxSize={5 * 1024 * 1024}
 * />
 * ```
 */
export function FileInput({
  label,
  description,
  errorMessage,
  value,
  onChange,
  accept,
  multiple = false,
  maxSize,
  maxFiles,
  isDisabled = false,
  chooseLabel,
  clearLabel,
  filesSelectedLabel = (count) => `${count} files selected`,
  invalidTypeMessage = (name) => `${name} is not an accepted file type.`,
  tooLargeMessage = (name, size) => `${name} exceeds the maximum size of ${size}.`,
  tooManyMessage = (max) => `Only ${max} file${max === 1 ? '' : 's'} allowed.`,
  className,
  style,
  ref,
  ...rest
}: FileInputProps): JSX.Element {
  const fi = fileInput();
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRef(inputRef, ref);
  const [isDragOver, setIsDragOver] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  const resolvedError = errorMessage ?? internalError ?? undefined;
  const frame = useFieldFrame({
    description,
    errorMessage: resolvedError,
    id: rest.id,
    describedBy: rest['aria-describedby'],
  });

  const fileNameDisplay = Array.isArray(value)
    ? value.length === 1
      ? value[0].name
      : value.length > 1
        ? filesSelectedLabel(value.length)
        : ''
    : (value?.name ?? '');
  const hasValue = fileNameDisplay !== '';
  const placeholderLabel = chooseLabel ?? (multiple ? 'Choose files' : 'Choose file');

  function processFiles(selected: File[], fromDrop = false) {
    if (isDisabled || selected.length === 0) return;
    const candidates = multiple ? selected : selected.slice(0, 1);
    const { valid, error } = validateFiles(candidates, {
      accept,
      maxSize,
      maxFiles: multiple ? maxFiles : undefined,
      invalidTypeMessage,
      tooLargeMessage,
      tooManyMessage,
    });
    setInternalError(error);
    if (valid.length === 0) {
      if (!fromDrop && inputRef.current) inputRef.current.value = '';
      return;
    }
    // Dropped files never pass through the native input, and rejected picks should not
    // linger in it, so keep the input in sync with what was accepted.
    if (fromDrop || valid.length !== selected.length) setNativeFiles(inputRef.current, valid);
    onChange(multiple ? valid : (valid[0] ?? null));
  }

  function openPicker() {
    if (isDisabled) return;
    inputRef.current?.click();
  }

  function handleClick() {
    openPicker();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (isDisabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPicker();
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files ? Array.from(event.target.files) : [];
    processFiles(files);
  }

  function handleDragEnter(event: DragEvent<HTMLDivElement>) {
    if (isDisabled) return;
    event.preventDefault();
    setIsDragOver(true);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    if (isDisabled) return;
    event.preventDefault();
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    if (isDisabled) return;
    event.preventDefault();
    setIsDragOver(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragOver(false);
    if (isDisabled) return;
    const files = event.dataTransfer.files ? Array.from(event.dataTransfer.files) : [];
    processFiles(files, true);
  }

  function handleClear(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    if (isDisabled) return;
    setInternalError(null);
    if (inputRef.current) inputRef.current.value = '';
    onChange(null);
  }

  return (
    <FieldFrame
      slots={fi}
      frame={frame}
      label={label}
      description={description}
      errorMessage={resolvedError}
      errorRole="alert"
      className={className}
      style={style}
    >
      <div {...mergeProps(fi.frame)}>
        <div
          role="button"
          tabIndex={isDisabled ? -1 : 0}
          {...mergeProps(fi.dropzone)}
          data-drag-over={isDragOver || undefined}
          data-disabled={isDisabled || undefined}
          aria-disabled={isDisabled || undefined}
          aria-labelledby={frame.labelId}
          aria-describedby={frame.controlProps['aria-describedby']}
          aria-invalid={frame.controlProps['aria-invalid']}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <span {...mergeProps(fi.icon)}>
            <Icon name="arrowUp" />
          </span>
          {hasValue ? (
            <span {...mergeProps(fi.fileNameText)}>{fileNameDisplay}</span>
          ) : (
            <span {...mergeProps(fi.placeholderText)}>{placeholderLabel}</span>
          )}
          <input
            tabIndex={-1}
            {...rest}
            ref={mergedRef}
            id={frame.controlId}
            type="file"
            aria-hidden="true"
            aria-describedby={undefined}
            {...mergeProps(fi.hiddenInput)}
            accept={accept}
            multiple={multiple}
            disabled={isDisabled}
            onChange={handleInputChange}
          />
        </div>
        {hasValue ? (
          <button
            type="button"
            {...mergeProps(fi.clearButton)}
            aria-label={clearLabel ?? `Clear ${label}`}
            disabled={isDisabled}
            onClick={handleClear}
          >
            <Icon name="close" size="sm" />
          </button>
        ) : null}
      </div>
    </FieldFrame>
  );
}
