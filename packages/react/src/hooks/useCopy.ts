import { useCallback, useEffect, useRef, useState } from 'react';

export type UseCopyOptions = {
  /** Milliseconds before `copied` / `error` reset. @default 2000 */
  timeout?: number;
  /** Called with the copied text after a successful write (a "Copied" toast, analytics). */
  onCopied?: (value: string) => void;
  /** Called when the clipboard write fails (permission denied, insecure context). */
  onCopyError?: (error: Error, value: string) => void;
};

export type UseCopyResult = {
  /** Whether the last copy attempt succeeded within the timeout window. */
  copied: boolean;
  /** Error from the last failed copy attempt, until the timeout resets it. */
  error: Error | null;
  /** Write `value` to the clipboard. */
  copy: (value: string) => Promise<void>;
  /** Reset copied/error state without copying. */
  reset: () => void;
};

/**
 * Clipboard copy state machine. Pair with `CopyButton` or wire to any control.
 */
export function useCopy({
  timeout = 2000,
  onCopied,
  onCopyError,
}: UseCopyOptions = {}): UseCopyResult {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Latest callbacks without re-creating `copy` (callers pass inline functions).
  const callbacksRef = useRef({ onCopied, onCopyError });
  callbacksRef.current = { onCopied, onCopyError };

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setCopied(false);
    setError(null);
  }, [clearTimer]);

  const copy = useCallback(
    async (value: string) => {
      clearTimer();
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setError(null);
        timerRef.current = setTimeout(() => {
          setCopied(false);
          timerRef.current = null;
        }, timeout);
      } catch (cause) {
        const copyError = cause instanceof Error ? cause : new Error('Copy failed');
        setCopied(false);
        setError(copyError);
        timerRef.current = setTimeout(() => {
          setError(null);
          timerRef.current = null;
        }, timeout);
        callbacksRef.current.onCopyError?.(copyError, value);
        return;
      }
      callbacksRef.current.onCopied?.(value);
    },
    [clearTimer, timeout],
  );

  return { copied, error, copy, reset };
}
