import { categoryLabel } from '../category-labels';
import { DOM_PROPS_NOTE_PREFIX } from '../props-note';
import type { Catalog, ComponentRecord, PropRow } from '../types';

export type FormatComponentOptions = {
  json: boolean;
  // Show every inherited HTML/ARIA/DOM attribute, not just the component's own
  // props (#130).
  allProps?: boolean;
};

export function unknownComponentMessage(query: string): string {
  return `Unknown component "${query}". Run \`var-ui component --list\`.\n`;
}

export function listComponents(catalog: Catalog): string {
  if (catalog.components.length === 0) {
    return '';
  }
  return `${catalog.components
    .map(
      (record) =>
        `${record.name}\t${record.slug}\t${categoryLabel(record.category)}\t${record.description}`,
    )
    .join('\n')}\n`;
}

export function formatComponent(record: ComponentRecord, options: FormatComponentOptions): string {
  const allProps = options.allProps === true;

  if (options.json) {
    const props = allProps ? record.props : ownProps(record.props);
    return `${JSON.stringify({ ...record, props }, null, 2)}\n`;
  }

  const body = stripLeadingHeading(record.markdown);
  const markdown = allProps ? withAllProps(body, record.props) : body;
  const output = `# ${record.name}\n\n${record.importLine}\n\n${markdown}`;
  return output.endsWith('\n') ? output : `${output}\n`;
}

function ownProps(props: PropRow[]): PropRow[] {
  return props.filter((prop) => prop.source !== 'dom');
}

const PROPS_TABLE_HEADER = '| Name | Type | Required | Default | Description |';
// Full table (header, separator, then every contiguous row) baked into the
// markdown by renderPropsTable in @var-ui/docs.
const PROPS_TABLE_RE =
  /^\| Name \| Type \| Required \| Default \| Description \|\n\|[^\n]*\n(?:\|[^\n]*\n)*/gm;
// Catalog generation appends a one-line pointer to `--all-props` under the
// table; drop it when the full list is being printed right here.
const DOM_PROPS_NOTE_RE = new RegExp(`^${escapeRegExp(DOM_PROPS_NOTE_PREFIX)}[^\\n]*\\n?`, 'gm');

function withAllProps(markdown: string, props: PropRow[]): string {
  if (props.length === 0) {
    return markdown;
  }
  const table = renderPropsTable(props);
  const withoutNote = markdown.replace(DOM_PROPS_NOTE_RE, '');
  if (withoutNote.includes(PROPS_TABLE_HEADER)) {
    return withoutNote.replace(PROPS_TABLE_RE, `${table}\n`);
  }
  // Markdown without an inlined table (e.g. catalogs generated before the
  // table was baked in): print the full list as its own section.
  return `${withoutNote}\n\n## All props\n\n${table}\n`;
}

function renderPropsTable(rows: PropRow[]): string {
  if (rows.length === 0) {
    return '';
  }
  const lines = rows.map(
    (row) =>
      `| ${escapeTableCell(row.name)} | ${escapeTableCell(row.type)} | ${row.required ? 'yes' : 'no'} | ${escapeTableCell(row.default ?? '')} | ${escapeTableCell(row.description ?? '')} |`,
  );
  return [PROPS_TABLE_HEADER, '| --- | --- | --- | --- | --- |', ...lines].join('\n');
}

function escapeTableCell(value: string): string {
  return value.replace(/\r?\n/g, ' ').replace(/\|/g, '\\|');
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function stripLeadingHeading(markdown: string): string {
  return markdown.replace(/^\s*#[^\n]*\n?/, '').replace(/^\s+/, '');
}
