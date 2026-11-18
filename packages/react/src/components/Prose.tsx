import {
  isValidElement,
  type ComponentPropsWithRef,
  type CSSProperties,
  type JSX,
  type ReactElement,
  type ReactNode,
} from 'react';
import { prose } from '@var-ui/core/components/prose';
import type { Density } from '@var-ui/core';
import { mergeProps } from 'typestyles';
import { Code } from './Code';
import { CodeBlock } from './CodeBlock';
import { Link } from './Link';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  type TableColumnAlign,
} from './Table';

export type ProseProps = ComponentPropsWithRef<'div'> & {
  /**
   * Vertical rhythm and heading scale. `compact` for chat bubbles and cards, `balanced` for
   * panels, `spacious` for reading views. Font size is inherited either way.
   * @default balanced
   */
  density?: Density;
};

/**
 * Rendered markdown or rich text in app UI. Styles the bare elements a markdown renderer emits,
 * relative to the surrounding font size, so it fits a chat bubble or a reading pane. Var UI
 * components inside keep their own styles. Pair with `proseComponents` to render code blocks,
 * links and tables as `CodeBlock`, `Link` and `Table`.
 *
 * ```tsx
 * <Prose density="compact">
 *   <Markdown components={proseComponents}>{message}</Markdown>
 * </Prose>
 * ```
 */
export function Prose({ density = 'balanced', className, ref, ...rest }: ProseProps): JSX.Element {
  return <div {...rest} {...mergeProps(prose({ density }), className)} ref={ref} />;
}

/**
 * Markdown renderers (react-markdown, MDX, `hast-util-to-jsx-runtime`) pass the source AST node
 * as `node`; it is not a DOM attribute.
 */
type Mapped<P> = P & { node?: unknown };

function withoutNode<P extends object>({ node: _node, ...props }: Mapped<P>): P {
  return props as P;
}

function textOf(children: ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(textOf).join('');
  if (isValidElement<{ children?: ReactNode }>(children)) return textOf(children.props.children);
  return '';
}

/** `text-align` from markdown's column alignment (`| :--: |`), as a Table column `align`. */
function alignOf(style: CSSProperties | undefined): TableColumnAlign | undefined {
  switch (style?.textAlign) {
    case 'center':
      return 'center';
    case 'right':
    case 'end':
      return 'end';
    default:
      return undefined;
  }
}

function withoutTextAlign(style: CSSProperties | undefined): CSSProperties | undefined {
  if (style?.textAlign == null) return style;
  const { textAlign: _textAlign, ...rest } = style;
  return Object.keys(rest).length > 0 ? rest : undefined;
}

/** A fenced block: `<pre><code class="language-ts">…</code></pre>` becomes a `CodeBlock`. */
function ProsePre(props: Mapped<ComponentPropsWithRef<'pre'>>): JSX.Element {
  const { children, className, style, id } = withoutNode(props);
  const code = isValidElement<{ className?: string; children?: ReactNode }>(children)
    ? (children as ReactElement<{ className?: string; children?: ReactNode }>)
    : null;
  const language = code?.props.className
    ?.split(/\s+/)
    .find((name) => name.startsWith('language-'))
    ?.slice('language-'.length);
  return (
    <CodeBlock
      id={id}
      className={className}
      style={style}
      code={textOf(code ? code.props.children : children).replace(/\n$/, '')}
      language={language}
    />
  );
}

function ProseCode(props: Mapped<ComponentPropsWithRef<'code'>>): JSX.Element {
  return <Code {...withoutNode(props)} />;
}

function ProseLink(props: Mapped<ComponentPropsWithRef<'a'>>): JSX.Element {
  return <Link {...withoutNode(props)} />;
}

function ProseTable(props: Mapped<ComponentPropsWithRef<'table'>>): JSX.Element {
  // Compact cells match the inherited, usually small, prose text.
  return <Table density="compact" {...withoutNode(props)} />;
}

function ProseTableHeader(props: Mapped<ComponentPropsWithRef<'thead'>>): JSX.Element {
  return <TableHeader {...withoutNode(props)} />;
}

function ProseTableBody(props: Mapped<ComponentPropsWithRef<'tbody'>>): JSX.Element {
  return <TableBody {...withoutNode(props)} />;
}

function ProseTableRow(props: Mapped<ComponentPropsWithRef<'tr'>>): JSX.Element {
  return <TableRow {...withoutNode(props)} />;
}

function ProseTableColumn(props: Mapped<ComponentPropsWithRef<'th'>>): JSX.Element {
  const { style, align: _align, ...rest } = withoutNode(props);
  return <TableColumn {...rest} align={alignOf(style)} style={withoutTextAlign(style)} />;
}

function ProseTableCell(props: Mapped<ComponentPropsWithRef<'td'>>): JSX.Element {
  const { style, align: _align, ...rest } = withoutNode(props);
  return <TableCell {...rest} align={alignOf(style)} style={withoutTextAlign(style)} />;
}

/**
 * Element-to-component map for markdown renderers that take a `components` prop
 * (react-markdown, MDX). Fenced code becomes a `CodeBlock` (language from `language-*`, with a
 * copy button), inline code a `Code`, links a `Link` (so `RouterProvider` routing applies) and
 * GFM tables a compact `Table` with column alignment. Spread it to override single entries:
 * `{ ...proseComponents, a: MyLink }`. Everything else stays a bare element styled by `Prose`.
 */
export const proseComponents = {
  pre: ProsePre,
  code: ProseCode,
  a: ProseLink,
  table: ProseTable,
  thead: ProseTableHeader,
  tbody: ProseTableBody,
  tr: ProseTableRow,
  th: ProseTableColumn,
  td: ProseTableCell,
} as const;
