import type { ComponentPropsWithoutRef, JSX, Ref } from 'react';
import { useMemo } from 'react';
import { codeBlock } from '@var-ui/core/components/codeBlock';
import { codeBlockMarkup, type CodeBlockAttributes } from '@var-ui/core/components/codeBlockMarkup';
import type { CodeBlockVariantProps } from '@var-ui/core';
import { recipeVars, styleVars } from '@var-ui/core/components/styleVars';
import { useCopy } from '../hooks/useCopy';
import { Icon } from '../icons';
import { mergeProps } from 'typestyles';

export type { CodeBlockVariant } from '@var-ui/core';

const codeBlockVars = recipeVars(codeBlock);

const COPY_ICONS = { idle: 'copy', copied: 'check', error: 'error' } as const;

type DiffLineTone = 'added' | 'deleted' | 'hunk';

/** Unified-diff line classification for `variant="diff"` line painting. */
function classifyDiffLine(line: string): DiffLineTone | undefined {
  if (line.startsWith('@@')) return 'hunk';
  if (line.startsWith('+') && !line.startsWith('+++')) return 'added';
  if (line.startsWith('-') && !line.startsWith('---')) return 'deleted';
  return undefined;
}

/** `codeBlockMarkup` attributes as React props (`class` is `className`). */
function reactProps({ class: className, ...rest }: CodeBlockAttributes): Record<string, unknown> {
  return { className, ...rest };
}

export type CodeBlockProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> &
  CodeBlockVariantProps & {
    /** Source code string to display and copy. */
    code: string;
    /** Language tag shown in the header (e.g. `tsx`, `bash`). */
    language?: string;
    /** Pre-highlighted HTML for the code body. Pair with `codeClassName` from your highlighter. */
    codeHtml?: string;
    /** Classes for the highlighted `<code>` element (e.g. `hljs language-tsx`). */
    codeClassName?: string;
    /** Pre-highlighted HTML per line when `showLineNumbers` is enabled. */
    lineHtml?: string[];
    /** Optional filename shown in the header. */
    filename?: string;
    /** Whether to show the copy-to-clipboard button. @default true */
    copyable?: boolean;
    /** Wrap long lines instead of horizontal scrolling. @default false */
    wrapLongLines?: boolean;
    /** Show line numbers in a gutter column. @default false */
    showLineNumbers?: boolean;
    /** 1-based line numbers to highlight. */
    highlightedLines?: number[];
    /** Scroll cap for the code body — any CSS length (`maxLines`-style scrolling). */
    maxHeight?: string;
    /** Copy button's accessible name before a copy. Same prop as `CopyButton`. @default Copy code */
    copyLabel?: string;
    /** Name after a successful copy, also announced to screen readers. @default Copied */
    copiedLabel?: string;
    /** Name after a failed copy, also shown and announced beside the button. @default Copy failed */
    errorLabel?: string;
    /** Called with the code after a successful copy. Same as `CopyButton`'s. */
    onCopied?: (value: string) => void;
    /** Called when the clipboard write fails (permission denied, insecure context). */
    onCopyError?: (error: Error, value: string) => void;
    /** Ref to the root element: a `<div>`, or a `<code>` for the `inline` variant. */
    ref?: Ref<HTMLElement>;
  };

export function CodeBlock({
  code,
  language,
  codeHtml,
  codeClassName: highlightedCodeClassName,
  lineHtml,
  filename,
  className,
  copyable = true,
  variant = 'default',
  wrapLongLines = false,
  showLineNumbers = false,
  highlightedLines = [],
  maxHeight,
  copyLabel = 'Copy code',
  copiedLabel = 'Copied',
  errorLabel = 'Copy failed',
  onCopied,
  onCopyError,
  ref,
  ...rest
}: CodeBlockProps): JSX.Element {
  const cb = codeBlock({ variant });

  const { copied, error, copy } = useCopy({ onCopied, onCopyError });
  const copyState = error ? 'error' : copied ? 'copied' : 'idle';
  const label = { idle: copyLabel, copied: copiedLabel, error: errorLabel }[copyState];

  const highlightedSet = useMemo(() => new Set(highlightedLines), [highlightedLines]);
  const lines = useMemo(() => code.replace(/\n$/, '').split('\n'), [code]);
  const terminal = variant === 'terminal';
  const inline = variant === 'inline';
  const diff = variant === 'diff';
  const useHighlightedHtml = Boolean(codeHtml || lineHtml) && !terminal;

  if (inline) {
    return (
      <code
        {...(rest as ComponentPropsWithoutRef<'code'>)}
        {...mergeProps(cb.root, cb.code.className, className)}
        ref={ref}
        data-codeblock
      >
        {code}
      </code>
    );
  }

  // Same structure as Astro and the docs Shiki transformer (#194). React drives the copy button
  // itself, so it takes only its class from the markup, not the script hooks.
  const m = codeBlockMarkup({ code, language, filename, variant, copyable });
  return (
    <div
      {...rest}
      {...reactProps(m.root)}
      className={mergeProps(m.root.class, className).className}
      ref={ref as Ref<HTMLDivElement>}
    >
      <div {...reactProps(m.header)}>
        <div {...reactProps(m.title)}>
          {m.filename ? (
            <span {...reactProps(m.filename.attributes)}>{m.filename.text}</span>
          ) : null}
          {m.language ? (
            <span {...reactProps(m.language.attributes)}>{m.language.text}</span>
          ) : null}
        </div>
        {m.actions && m.copyButton && m.feedback ? (
          <div {...reactProps(m.actions)}>
            <button
              type="button"
              className={m.copyButton.class}
              data-copied={copied || undefined}
              data-error={error ? true : undefined}
              onClick={() => void copy(code)}
              aria-label={label}
            >
              <span data-codeblock-copy-icon>
                <Icon name={COPY_ICONS[copyState]} size="sm" />
              </span>
            </button>
            {/* Announces the result; the recipe shows it only for errors (success has the check). */}
            <span
              {...reactProps(m.feedback)}
              data-tone={{ idle: undefined, copied: 'success', error: 'error' }[copyState]}
            >
              {copyState === 'idle' ? '' : label}
            </span>
          </div>
        ) : null}
      </div>

      <div {...reactProps(m.body)} style={styleVars([[codeBlockVars.maxHeight, maxHeight]])}>
        <pre {...reactProps(m.pre)} data-wrap={wrapLongLines || undefined}>
          {showLineNumbers ? (
            <code {...mergeProps(cb.code)} data-line-numbers={showLineNumbers || undefined}>
              {lines.map((line, index) => {
                const lineNumber = index + 1;
                const lineContentHtml = lineHtml?.[index];
                return (
                  <span
                    key={lineNumber}
                    {...mergeProps(cb.line)}
                    data-highlighted={highlightedSet.has(lineNumber) || undefined}
                    data-line-tone={diff ? classifyDiffLine(line) : undefined}
                  >
                    <span {...mergeProps(cb.lineNumber)} aria-hidden="true">
                      {lineNumber}
                    </span>
                    <span
                      {...mergeProps(cb.lineContent)}
                      {...(lineContentHtml
                        ? { dangerouslySetInnerHTML: { __html: lineContentHtml } }
                        : { children: line || ' ' })}
                    />
                  </span>
                );
              })}
            </code>
          ) : diff ? (
            <code {...mergeProps(cb.code)}>
              {lines.map((line, index) => (
                <span key={index} {...mergeProps(cb.line)} data-line-tone={classifyDiffLine(line)}>
                  <span {...mergeProps(cb.lineContent)}>{line || ' '}</span>
                </span>
              ))}
            </code>
          ) : useHighlightedHtml ? (
            <code
              {...mergeProps(cb.code, highlightedCodeClassName)}
              dangerouslySetInnerHTML={{ __html: codeHtml! }}
            />
          ) : (
            // React escapes text itself; escaping here too showed `&lt;` instead of `<`.
            <code {...mergeProps(cb.code)}>{code}</code>
          )}
        </pre>
      </div>
    </div>
  );
}
