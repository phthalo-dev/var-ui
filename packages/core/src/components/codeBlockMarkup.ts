import { codeBlock, codeLanguageLabel, type CodeBlockVariantProps } from './codeBlock';

/** DOM attributes for one code-block part: `class` plus `data-*` / `aria-*` / native attributes. */
export type CodeBlockAttributes = { class: string } & Record<string, string | undefined>;

export type CodeBlockMarkupOptions = {
  /**
   * The source. Only written to the copy button (`data-var-ui-code`) with `embedCode`; otherwise
   * `initCodeBlockCopy` copies the text of the block's visible `pre code`, so the source is not
   * in the HTML twice.
   */
  code?: string;
  /**
   * Put `code` on the copy button. Needed only when the `pre code` text is not the source, for
   * example with line numbers or per-line diff markup. @default false
   */
  embedCode?: boolean;
  /** Language id (`ts`, `bash`); shown as its label (`TypeScript`, `Shell`). */
  language?: string;
  filename?: string;
  variant?: Exclude<CodeBlockVariantProps['variant'], 'inline'>;
  /** Render the copy button and its status region. @default true */
  copyable?: boolean;
  copyLabel?: string;
  copiedLabel?: string;
  errorLabel?: string;
};

/** Every part of a block code block, in render order. Text parts carry their `text`. */
export type CodeBlockMarkup = {
  root: CodeBlockAttributes;
  header: CodeBlockAttributes;
  title: CodeBlockAttributes;
  filename: { attributes: CodeBlockAttributes; text: string } | null;
  language: { attributes: CodeBlockAttributes; text: string } | null;
  /** `null` when not copyable. */
  actions: CodeBlockAttributes | null;
  /** Wired by `initCodeBlockCopy` (`@var-ui/astro`) through `data-var-ui-code-copy`. */
  copyButton: (CodeBlockAttributes & { type: 'button' }) | null;
  /** Wrapper for the copy glyph (`@var-ui/icons/glyphs/copy`). */
  copyIcon: Record<string, string>;
  feedback: CodeBlockAttributes | null;
  body: CodeBlockAttributes;
  pre: CodeBlockAttributes;
  code: CodeBlockAttributes;
};

type Slot = { className: string; attrs?: Record<string, string> };

const attributes = (slot: Slot, extra: Record<string, string | undefined> = {}) =>
  ({ class: slot.className, ...slot.attrs, ...extra }) as CodeBlockAttributes;

/**
 * The structure of a code block (header with filename / language label and copy button, then the
 * `<pre><code>`) as plain attribute maps: one source of truth for the React and Astro
 * `CodeBlock`, the docs Shiki transformer and hand-written HTML. Fill `pre > code` yourself
 * (plain text or highlighted HTML).
 *
 * ```ts
 * const m = codeBlockMarkup({ code, language: 'ts' });
 * // <div {...m.root}><div {...m.header}>…</div><div {...m.body}><pre {...m.pre}><code {...m.code}>
 * ```
 */
export function codeBlockMarkup({
  code,
  embedCode = false,
  language,
  filename,
  variant = 'default',
  copyable = true,
  copyLabel = 'Copy code',
  copiedLabel = 'Copied',
  errorLabel = 'Copy failed',
}: CodeBlockMarkupOptions): CodeBlockMarkup {
  const cb = codeBlock({ variant });
  return {
    root: attributes(cb.root, { 'data-language': language || undefined }),
    header: attributes(cb.header),
    title: attributes(cb.title),
    filename: filename ? { attributes: attributes(cb.filename), text: filename } : null,
    language: language
      ? { attributes: attributes(cb.language), text: codeLanguageLabel(language) }
      : null,
    actions: copyable ? attributes(cb.actions) : null,
    copyButton: copyable
      ? {
          ...attributes(cb.copyButton, {
            'data-var-ui-code-copy': '',
            'data-var-ui-code':
              embedCode && code !== undefined ? code.replace(/\n$/, '') : undefined,
            'data-var-ui-copy-label': copyLabel,
            'data-var-ui-copied-label': copiedLabel,
            'data-var-ui-error-label': errorLabel,
            'aria-label': copyLabel,
          }),
          type: 'button',
        }
      : null,
    copyIcon: { 'data-codeblock-copy-icon': '' },
    feedback: copyable
      ? attributes(cb.feedback, {
          'data-var-ui-codeblock-feedback': '',
          role: 'status',
          'aria-live': 'polite',
        })
      : null,
    body: attributes(cb.body),
    pre: attributes(cb.pre),
    code: attributes(cb.code),
  };
}
