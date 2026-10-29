import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type JSX,
  type KeyboardEvent,
  type MouseEvent,
  type Ref,
} from 'react';
import { fileInput } from '@var-ui/core';
import { Icon } from '../icons';
import { mergeProps } from 'typestyles';

export type FileInputProps = {
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
  /** Comma-separated list of accepted `.ext`, `type/*`, or exact mime types (matches the HTML `accept` attribute). */
  accept?: string;
  /** Allow selecting/dropping more than one file. */
  multiple?: boolean;
  /** Maximum size per file, in bytes. Oversized files are rejected. */
  maxSize?: number;
  /** Maximum number of files accepted when `multiple`. Extra files are rejected. */
  maxFiles?: number;
  /** Disables the dropzone: blocks click, keyboard activation, and drop. */
  isDisabled?: boolean;
  /** Name applied to the underlying `<input type="file">` for native form submission. */
  name?: string;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /** Ref to the underlying root `<div>` element. */
  ref?: Ref<HTMLDivElement>;
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
};

function validateFiles(
  files: File[],
  { accept, maxSize, maxFiles }: ValidateOptions,
): { valid: File[]; error: string | null } {
  let valid = files;
  let error: string | null = null;

  if (accept) {
    const rejected = valid.find((file) => !matchesAccept(file, accept));
    if (rejected && !error) {
      error = `${rejected.name} is not an accepted file type.`;
    }
    valid = valid.filter((file) => matchesAccept(file, accept));
  }

  if (maxSize !== undefined) {
    const rejected = valid.find((file) => file.size > maxSize);
    if (rejected && !error) {
      error = `${rejected.name} exceeds the maximum size of ${formatSize(maxSize)}.`;
    }
    valid = valid.filter((file) => file.size <= maxSize);
  }

  if (maxFiles !== undefined && valid.length > maxFiles) {
    if (!error) {
      error = `Only ${maxFiles} file${maxFiles === 1 ? '' : 's'} allowed.`;
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
  name,
  className,
  ref,
}: FileInputProps): JSX.Element {
  const fi = fileInput();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  const inputId = useId();
  const labelId = `${inputId}-label`;
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;

  const resolvedError = errorMessage ?? internalError ?? undefined;
  const describedBy =
    [description ? descriptionId : null, resolvedError ? errorId : null]
      .filter(Boolean)
      .join(' ') || undefined;

  const fileNameDisplay = Array.isArray(value)
    ? value.length === 1
      ? value[0].name
      : value.length > 1
        ? `${value.length} files selected`
        : ''
    : (value?.name ?? '');
  const hasValue = fileNameDisplay !== '';
  const placeholderLabel = multiple ? 'Choose files' : 'Choose file';

  function processFiles(selected: File[]) {
    if (isDisabled || selected.length === 0) return;
    const candidates = multiple ? selected : selected.slice(0, 1);
    const { valid, error } = validateFiles(candidates, {
      accept,
      maxSize,
      maxFiles: multiple ? maxFiles : undefined,
    });
    setInternalError(error);
    if (valid.length === 0) return;
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
    processFiles(files);
  }

  function handleClear(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    if (isDisabled) return;
    setInternalError(null);
    onChange(null);
  }

  return (
    <div {...mergeProps(fi.root, className)} ref={ref}>
      <label {...mergeProps(fi.label)} id={labelId} htmlFor={inputId}>
        {label}
      </label>
      <div {...mergeProps(fi.frame)}>
        <div
          role="button"
          tabIndex={isDisabled ? -1 : 0}
          {...mergeProps(fi.dropzone)}
          data-drag-over={isDragOver || undefined}
          data-disabled={isDisabled || undefined}
          aria-disabled={isDisabled || undefined}
          aria-labelledby={labelId}
          aria-describedby={describedBy}
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
            ref={inputRef}
            id={inputId}
            type="file"
            name={name}
            tabIndex={-1}
            aria-hidden="true"
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
            aria-label={`Clear ${label}`}
            disabled={isDisabled}
            onClick={handleClear}
          >
            <Icon name="close" size="sm" />
          </button>
        ) : null}
      </div>
      {description ? (
        <p {...mergeProps(fi.description)} id={descriptionId}>
          {description}
        </p>
      ) : null}
      {resolvedError ? (
        <p {...mergeProps(fi.error)} id={errorId} role="alert">
          {resolvedError}
        </p>
      ) : null}
    </div>
  );
}
