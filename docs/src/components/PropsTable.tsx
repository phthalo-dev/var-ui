import type { ComponentPropsDoc } from '@/lib/extract-component-props';
import { proseContent } from '@var-ui/core';

type PropsTableProps = {
  /** Component slug from the registry, e.g. `button`. */
  slug: string;
  /** Props data loaded for the current page. */
  doc?: ComponentPropsDoc | null;
};

function PropRow({ prop }: { prop: ComponentPropsDoc['props'][number] }) {
  return (
    <tr>
      <td>
        <code>{prop.name}</code>
        {prop.required ? null : (
          <>
            {' '}
            <span aria-hidden="true">?</span>
          </>
        )}
      </td>
      <td>
        <code>{prop.type}</code>
      </td>
      <td>{prop.default ? <code>{prop.default}</code> : '—'}</td>
      <td>{prop.description ?? '—'}</td>
    </tr>
  );
}

function PropsTableSection({
  title,
  props,
  id,
  tableWrapClass,
  showTitle = true,
}: {
  title: string;
  props: ComponentPropsDoc['props'];
  id?: string;
  tableWrapClass: string;
  showTitle?: boolean;
}) {
  if (props.length === 0) {
    return null;
  }

  return (
    <>
      {showTitle ? <h3 id={id}>{title}</h3> : null}
      <div className={tableWrapClass}>
        <table>
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {props.map((prop) => (
              <PropRow key={prop.name} prop={prop} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function PropsTable({ slug, doc }: PropsTableProps) {
  const prose = proseContent();

  if (!doc) {
    return (
      <p>
        <em>
          No props data for <code>{slug}</code>. Run the docs dev server to regenerate props from
          TypeScript.
        </em>
      </p>
    );
  }

  const varUiProps = doc.props.filter((prop) => prop.source === 'var-ui');
  const reactAriaProps = doc.props.filter((prop) => prop.source === 'react-aria');
  const domProps = doc.props.filter((prop) => prop.source === 'dom' && prop.description);

  return (
    <>
      <PropsTableSection
        title="Props"
        props={varUiProps}
        tableWrapClass={prose.tableWrap.className}
      />
      {reactAriaProps.length > 0 ? (
        <PropsTableSection
          title="React Aria props"
          props={reactAriaProps}
          id="react-aria-props"
          tableWrapClass={prose.tableWrap.className}
        />
      ) : null}
      {domProps.length > 0 ? (
        <details>
          <summary>DOM props ({domProps.length})</summary>
          <PropsTableSection
            title="DOM props"
            props={domProps}
            id="dom-props"
            tableWrapClass={prose.tableWrap.className}
            showTitle={false}
          />
        </details>
      ) : null}
    </>
  );
}
