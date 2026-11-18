import { Fragment, type ReactNode } from 'react';
import type { ComponentPropsDoc } from '@/lib/extract-component-props';
import { commonPropDescriptions } from '@/lib/prop-descriptions';
import { docsPropsTable } from '@var-ui/docs/styles';
import { mergeProps } from '@var-ui/react';

type PropDoc = ComponentPropsDoc['props'][number];

type PropsTableProps = {
  /** Component slug from the registry, e.g. `button`. */
  slug: string;
  /** Props data loaded for the current page. */
  doc?: ComponentPropsDoc | null;
  /** Variant defaults from the component's core recipe, keyed by prop name. */
  recipeDefaults?: Record<string, string>;
};

/** Types past this length collapse behind a "Show type" disclosure. */
const LONG_TYPE = 90;

/** Optional props already say so; `| undefined` is noise in a reference table. */
function cleanType(type: string): string {
  return type.replace(/\s*\|\s*undefined\b/g, '').trim();
}

/** Tint string / number / boolean literals; the rest of a type stays neutral. */
function renderType(type: string, literalClass: string): ReactNode {
  return type.split(/("[^"]*"|'[^']*'|\b(?:true|false|\d+)\b)/g).map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className={literalClass}>
        {part}
      </span>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}

/** Render `backtick` spans in a plain-text description as inline code. */
function renderInline(text: string): ReactNode {
  return text
    .split(/(`[^`]+`)/g)
    .map((part, index) =>
      part.startsWith('`') && part.endsWith('`') && part.length > 2 ? (
        <code key={index}>{part.slice(1, -1)}</code>
      ) : (
        <Fragment key={index}>{part}</Fragment>
      ),
    );
}

function PropRow({
  prop,
  fallbackDefault,
  anchored,
}: {
  prop: PropDoc;
  fallbackDefault?: string;
  /** Give the row an `id` (`prop-<name>`) for the rail's jump-list. */
  anchored?: boolean;
}) {
  const s = docsPropsTable();
  const type = cleanType(prop.type);
  const defaultValue = prop.default ?? fallbackDefault;
  const description = prop.description ?? commonPropDescriptions[prop.name];
  return (
    <tr {...mergeProps(s.row)} id={anchored ? `prop-${prop.name}` : undefined}>
      <td {...mergeProps(s.cell)} data-col="name">
        <span {...mergeProps(s.propName)}>
          {prop.name}
          {prop.required ? <span {...mergeProps(s.required)}>Required</span> : null}
        </span>
      </td>
      <td {...mergeProps(s.cell)} data-col="type">
        {type.length > LONG_TYPE ? (
          <details {...mergeProps(s.typeDetails)}>
            <summary>Show type</summary>
            <code {...mergeProps(s.type)}>{renderType(type, s.literal.className)}</code>
          </details>
        ) : (
          <code {...mergeProps(s.type)}>{renderType(type, s.literal.className)}</code>
        )}
      </td>
      <td {...mergeProps(s.cell)} data-col="default" data-empty={defaultValue ? undefined : ''}>
        {defaultValue ? (
          <code {...mergeProps(s.defaultValue)}>
            {renderType(defaultValue, s.literal.className)}
          </code>
        ) : (
          <span {...mergeProps(s.empty)} aria-label="No default">
            –
          </span>
        )}
      </td>
      <td className={`${s.cell.className} ${s.description.className}`} data-col="description">
        {description ? (
          renderInline(description.replace(/\n/g, ' '))
        ) : (
          <span {...mergeProps(s.empty)}>–</span>
        )}
      </td>
    </tr>
  );
}

function PropsTableSection({
  title,
  props,
  id,
  recipeDefaults = {},
  footer,
  anchored = false,
}: {
  title?: string;
  props: PropDoc[];
  id?: string;
  recipeDefaults?: Record<string, string>;
  footer?: ReactNode;
  anchored?: boolean;
}) {
  const s = docsPropsTable();
  if (props.length === 0) {
    return null;
  }

  return (
    <section>
      {title ? (
        <h3 id={id} {...mergeProps(s.heading)}>
          {title}
        </h3>
      ) : null}
      <div {...mergeProps(s.root)}>
        <table {...mergeProps(s.table)}>
          <colgroup>
            <col style={{ width: '24%' }} />
            <col style={{ width: '32%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '30%' }} />
          </colgroup>
          <thead {...mergeProps(s.head)}>
            <tr>
              <th {...mergeProps(s.headCell)}>Prop</th>
              <th {...mergeProps(s.headCell)}>Type</th>
              <th {...mergeProps(s.headCell)}>Default</th>
              <th {...mergeProps(s.headCell)}>Description</th>
            </tr>
          </thead>
          <tbody>
            {props.map((prop) => (
              <PropRow
                key={prop.name}
                prop={prop}
                fallbackDefault={recipeDefaults[prop.name]}
                anchored={anchored}
              />
            ))}
          </tbody>
        </table>
      </div>
      {footer}
    </section>
  );
}

/** Recipe defaults arrive as `'md'`; show them in the Type column's quote style. */
function toTypeQuotes(defaults: Record<string, string> = {}): Record<string, string> {
  return Object.fromEntries(
    Object.entries(defaults).map(([key, value]) => [key, value.replace(/^'(.*)'$/, '"$1"')]),
  );
}

export function PropsTable({ slug, doc, recipeDefaults }: PropsTableProps) {
  const s = docsPropsTable();
  if (!doc) {
    return (
      <p>
        No props data for <code>{slug}</code>. Run the docs dev server to regenerate props from
        TypeScript.
      </p>
    );
  }

  const varUiProps = doc.props.filter((prop) => prop.source === 'var-ui');
  const reactAriaProps = doc.props.filter((prop) => prop.source === 'react-aria');
  const domProps = doc.props.filter((prop) => prop.source === 'dom' && prop.description);
  const domDisclosure =
    domProps.length > 0 ? (
      <details {...mergeProps(s.more)}>
        <summary>DOM props ({domProps.length})</summary>
        <PropsTableSection props={domProps} id="dom-props" />
      </details>
    ) : null;

  return (
    <>
      <PropsTableSection
        anchored
        props={varUiProps}
        recipeDefaults={toTypeQuotes(recipeDefaults)}
        footer={reactAriaProps.length > 0 ? null : domDisclosure}
      />
      {reactAriaProps.length > 0 ? (
        <PropsTableSection
          title="React Aria props"
          props={reactAriaProps}
          id="react-aria-props"
          footer={domDisclosure}
        />
      ) : null}
    </>
  );
}
