import { atProperty, variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { density } from '../shared/variantAxes';

const tableDividers = variant.enum(['rows', 'columns', 'grid', 'none'], { default: 'rows' });
const tableTextOverflow = variant.enum(['wrap', 'truncate'], { default: 'wrap' });
const tableLayout = variant.enum(['auto', 'fixed'], { default: 'auto' });
const tableIsStriped = variant.boolean({ default: false });
const tableHasHover = variant.boolean({ default: false });
const tableStickyHeader = variant.boolean({ default: false });

/**
 * Presentational semantic `<table>` chrome for admin data grids. Pair with the
 * React `Table` compound, which drives variant data attributes and renders
 * dual API (compound children or `columns`/`data`). Sort, selection, and
 * pagination are caller-composed via `useTableSort` / `useTableSelection` /
 * `useTablePagination` — this recipe carries no interactive state.
 *
 * ```tsx
 * const s = table({ density: 'compact', dividers: 'rows', stickyHeader: true });
 * <div className={s.root.className}>
 *   <table className={s.table.className}>
 *     <thead className={s.header.className}>
 *       <tr className={s.row.className}>
 *         <th className={s.headerCell.className}>Name</th>
 *       </tr>
 *     </thead>
 *   </table>
 * </div>
 * ```
 */
export const table = typestyles.recipe({
  name: 'table',
  layer: 'components',
  slots: [
    'root',
    'table',
    'caption',
    'header',
    'headerCell',
    'resizeHandle',
    'body',
    'row',
    'cell',
    'footer',
    'empty',
    'sortButton',
    'column',
  ],
  variants: {
    density,
    dividers: tableDividers,
    striped: tableIsStriped,
    hasHover: tableHasHover,
    stickyHeader: tableStickyHeader,
    textOverflow: tableTextOverflow,
    layout: tableLayout,
  },
  vars: {
    headerBg: { ...atProperty.color, value: t.color.background.surface.var },
    headerColor: { ...atProperty.color, value: t.color.text.secondary.var },
    bodyColor: { ...atProperty.color, value: t.color.text.primary.var },
    captionColor: { ...atProperty.color, value: t.color.text.secondary.var },
    borderColor: { ...atProperty.color, value: t.color.border.default.var },
    stripeBg: { ...atProperty.color, value: t.color.background.subtle.var },
    hoverBg: { ...atProperty.color, value: t.color.background.elevated.var },
    cellPaddingY: { ...atProperty.length, value: t.space[2].var },
    cellPaddingX: { ...atProperty.length, value: t.space[3].var },
    columnWidth: { syntax: '*', value: 'auto' },
  },
  styles: ({ vars }) => {
    const rowDivider = {
      header: {
        borderBottomWidth: t.borderWidth.default.var,
        borderBottomStyle: 'solid',
        borderBottomColor: vars.borderColor.var,
      },
      row: {
        borderBottomWidth: t.borderWidth.default.var,
        borderBottomStyle: 'solid',
        borderBottomColor: vars.borderColor.var,
      },
      footer: {
        borderTopWidth: t.borderWidth.default.var,
        borderTopStyle: 'solid',
        borderTopColor: vars.borderColor.var,
      },
    };
    const columnDivider = {
      headerCell: {
        '&:not(:last-child)': {
          borderRightWidth: t.borderWidth.default.var,
          borderRightStyle: 'solid',
          borderRightColor: vars.borderColor.var,
        },
      },
      cell: {
        '&:not(:last-child)': {
          borderRightWidth: t.borderWidth.default.var,
          borderRightStyle: 'solid',
          borderRightColor: vars.borderColor.var,
        },
      },
    };
    return {
      base: {
        root: {
          position: 'relative',
          width: '100%',
          overflowX: 'auto',
        },
        table: {
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: t.fontSize.sm.var,
          color: vars.bodyColor.var,
        },
        caption: {
          captionSide: 'top',
          textAlign: 'left',
          padding: `${t.space[2].var} ${vars.cellPaddingX.var}`,
          fontSize: t.fontSize.sm.var,
          fontWeight: t.fontWeight.medium.var,
          color: vars.captionColor.var,
        },
        header: {},
        headerCell: {
          width: vars.columnWidth.var,
          position: 'relative',
          textAlign: 'left',
          fontWeight: t.fontWeight.semibold.var,
          fontSize: t.fontSize.sm.var,
          color: vars.headerColor.var,
          backgroundColor: vars.headerBg.var,
          padding: `${vars.cellPaddingY.var} ${vars.cellPaddingX.var}`,
          '&[data-align="center"]': { textAlign: 'center' },
          '&[data-align="end"]': { textAlign: 'right' },
        },
        resizeHandle: {
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'stretch',
          transform: 'translateX(50%)',
          zIndex: 2,
        },
        body: {},
        row: {},
        cell: {
          padding: `${vars.cellPaddingY.var} ${vars.cellPaddingX.var}`,
          color: vars.bodyColor.var,
          '&[data-align="center"]': { textAlign: 'center' },
          '&[data-align="end"]': { textAlign: 'right' },
        },
        footer: {
          fontWeight: t.fontWeight.medium.var,
          color: vars.headerColor.var,
        },
        empty: {
          padding: t.space[8].var,
          textAlign: 'center',
          color: vars.captionColor.var,
        },
        sortButton: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.space[1].var,
          background: 'none',
          border: 'none',
          padding: 0,
          margin: 0,
          font: 'inherit',
          color: 'inherit',
          cursor: 'pointer',
        },
        column: {
          width: vars.columnWidth.var,
        },
      },
      variants: {
        density: {
          compact: {
            headerCell: {
              [vars.cellPaddingY.name]: t.space[1].var,
              [vars.cellPaddingX.name]: t.space[2].var,
            },
            cell: {
              [vars.cellPaddingY.name]: t.space[1].var,
              [vars.cellPaddingX.name]: t.space[2].var,
            },
          },
          balanced: {},
          spacious: {
            headerCell: {
              [vars.cellPaddingY.name]: t.space[3].var,
              [vars.cellPaddingX.name]: t.space[4].var,
            },
            cell: {
              [vars.cellPaddingY.name]: t.space[3].var,
              [vars.cellPaddingX.name]: t.space[4].var,
            },
          },
        },
        dividers: {
          rows: rowDivider,
          columns: columnDivider,
          grid: { ...rowDivider, ...columnDivider },
          none: {},
        },
        striped: {
          true: { row: { '&:nth-of-type(even)': { backgroundColor: vars.stripeBg.var } } },
          false: {},
        },
        hasHover: {
          true: { row: { '&:hover': { backgroundColor: vars.hoverBg.var } } },
          false: {},
        },
        stickyHeader: {
          true: {
            headerCell: {
              position: 'sticky',
              top: 0,
              zIndex: 1,
              backgroundColor: vars.headerBg.var,
            },
          },
          false: {},
        },
        textOverflow: {
          wrap: {},
          truncate: {
            headerCell: {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 0,
            },
            cell: {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 0,
            },
          },
        },
        layout: {
          auto: {},
          fixed: { table: { tableLayout: 'fixed' } },
        },
      },
    };
  },
});

/** Visual props derived from the schema. */
export type TableVariantProps = RecipeVariants<typeof table>;
