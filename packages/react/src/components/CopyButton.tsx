import type { JSX, ReactNode, Ref } from 'react';
import { copyButton } from '@var-ui/core/components/copyButton';
import { Icon } from '../icons';
import { useCopy } from '../hooks/useCopy';
import { combine } from 'typestyles';

export type CopyButtonRenderProps = {
  copied: boolean;
  copy: () => void;
  error: Error | null;
};

export type CopyButtonProps = {
  /** Text written to the clipboard when copy is triggered. */
  value: string;
  /** Milliseconds before the copied state resets. @default 2000 */
  timeout?: number;
  /** Custom render function; defaults to a styled icon button. */
  children?: (state: CopyButtonRenderProps) => ReactNode;
  /** Label for the default button when not copied. @default Copy */
  copyLabel?: string;
  /** Label for the default button after a successful copy. @default Copied */
  copiedLabel?: string;
  /** Label for the default button after a failed copy. @default Error */
  errorLabel?: string;
  className?: string;
  /** Ref to the underlying `<button>` element (default chrome only; not used with a `children` render function). */
  ref?: Ref<HTMLButtonElement>;
};

/**
 * Copy-to-clipboard control with render-prop or default button chrome.
 * Mantine `CopyButton` equivalent.
 */
export function CopyButton({
  value,
  timeout = 2000,
  children,
  copyLabel = 'Copy',
  copiedLabel = 'Copied',
  errorLabel = 'Error',
  className,
  ref,
}: CopyButtonProps): JSX.Element {
  const { copied, copy, error } = useCopy({ timeout });
  const cb = copyButton();

  const handleCopy = () => {
    void copy(value);
  };

  if (children) {
    return <>{children({ copied, copy: handleCopy, error })}</>;
  }

  const label = error ? errorLabel : copied ? copiedLabel : copyLabel;

  return (
    <button
      type="button"
      {...combine(
        cb.button,
        !copied && !error && cb.buttonIdle,
        copied && cb.buttonCopied,
        error && cb.buttonError,
        className,
      )}
      onClick={handleCopy}
      aria-label={label}
      ref={ref}
    >
      <Icon name={copied ? 'check' : error ? 'error' : 'copy'} size="sm" />
      {label}
    </button>
  );
}
