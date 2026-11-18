import { designTokens as t, typestyles } from '@var-ui/core';

const belowSm = typestyles.breakpoint('sm', 'max');

const mono = {
  fontFamily: t.fontFamily.mono.var,
  fontSize: '0.8125rem',
  lineHeight: '1.25rem',
  fontWeight: t.fontWeight.normal.var,
  backgroundColor: 'transparent',
  padding: 0,
} as const;

/**
 * API reference table for component props: fixed column proportions (name / type / default /
 * description), plain mono name, type and default, and real inline code in descriptions. Below
 * 640px each prop becomes a stacked card: name and default on one line, then type, then text.
 */
export const docsPropsTable = typestyles.recipe({
  name: 'docs-props-table',
  layer: 'components',
  slots: [
    'root',
    'heading',
    'table',
    'head',
    'headCell',
    'row',
    'cell',
    'propName',
    'required',
    'type',
    'literal',
    'typeDetails',
    'defaultValue',
    'empty',
    'description',
    'more',
  ],
  styles: () => ({
    base: {
      root: {
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        [belowSm]: { overflowX: 'visible' },
      },
      heading: {
        margin: 0,
        marginBlock: `${t.space.xl.var} ${t.space.sm.var}`,
        fontFamily: t.fontFamily.display.var,
        fontSize: '1.25rem',
        lineHeight: '1.75rem',
        fontWeight: t.fontWeight.semibold.var,
        letterSpacing: '-0.01em',
        color: t.color.text.primary.var,
      },
      table: {
        width: '100%',
        tableLayout: 'fixed',
        borderCollapse: 'collapse',
        border: 'none',
        margin: 0,
        fontSize: t.fontSize.md.var,
        lineHeight: '1.375rem',
        color: t.color.text.primary.var,
        [belowSm]: {
          display: 'block',
          '& > tbody': { display: 'block' },
          '& > colgroup': { display: 'none' },
        },
      },
      head: {
        [belowSm]: { display: 'none' },
      },
      headCell: {
        paddingBlock: t.space.xs.var,
        paddingInline: `0 ${t.space.md.var}`,
        textAlign: 'start',
        fontSize: t.fontSize.xs.var,
        fontWeight: t.fontWeight.semibold.var,
        letterSpacing: t.letterSpacing.caps.var,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        color: t.color.text.secondary.var,
        backgroundColor: 'transparent',
        borderBlockEnd: `${t.borderWidth.default.var} solid ${t.color.border.default.var}`,
      },
      row: {
        [belowSm]: {
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto',
          columnGap: t.space.sm.var,
          rowGap: t.space.xxs.var,
          paddingBlock: t.space.md.var,
          borderBlockEnd: `${t.borderWidth.default.var} solid ${t.color.border.subtle.var}`,
        },
      },
      cell: {
        paddingBlock: t.space.sm.var,
        paddingInline: `0 ${t.space.md.var}`,
        verticalAlign: 'top',
        borderBlockEnd: `${t.borderWidth.default.var} solid ${t.color.border.subtle.var}`,
        '&:last-child': {
          paddingInlineEnd: 0,
        },
        [belowSm]: {
          display: 'block',
          padding: 0,
          border: 'none',
          minWidth: 0,
          '&[data-col="name"]': { gridColumn: '1', gridRow: '1' },
          '&[data-col="default"]': { gridColumn: '2', gridRow: '1', justifySelf: 'end' },
          '&[data-col="default"][data-empty]': { display: 'none' },
          '&[data-col="type"]': { gridColumn: '1 / -1' },
          '&[data-col="description"]': {
            gridColumn: '1 / -1',
            fontSize: t.fontSize.md.var,
            lineHeight: '1.25rem',
          },
        },
      },
      propName: {
        display: 'inline-flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: t.space.xs.var,
        ...mono,
        fontWeight: t.fontWeight.semibold.var,
        color: t.color.text.primary.var,
        whiteSpace: 'nowrap',
      },
      required: {
        display: 'inline-flex',
        alignItems: 'center',
        height: '1.125rem',
        paddingInline: '0.375rem',
        borderRadius: t.radius.full.var,
        fontFamily: t.fontFamily.body.var,
        fontSize: '0.6875rem',
        fontWeight: t.fontWeight.semibold.var,
        color: t.color.tone.danger.foreground.var,
        backgroundColor: `color-mix(in srgb, ${t.color.tone.danger.foreground.var} 10%, transparent)`,
      },
      // Types read as neutral code; only literal values pick up the accent.
      type: {
        ...mono,
        color: t.color.text.secondary.var,
        overflowWrap: 'anywhere',
      },
      literal: {
        color: t.color.code.keyword.var,
      },
      typeDetails: {
        '& > summary': {
          cursor: 'pointer',
          width: 'fit-content',
          fontSize: t.fontSize.sm.var,
          color: t.color.text.secondary.var,
          '&:hover': { color: t.color.text.primary.var },
        },
        '&[open] > summary': {
          marginBlockEnd: t.space.xxs.var,
        },
      },
      defaultValue: {
        ...mono,
        color: t.color.text.primary.var,
      },
      empty: {
        color: t.color.text.secondary.var,
        opacity: 0.7,
      },
      description: {
        color: t.color.text.primary.var,
        // Tables carry mono text only: no chip background in a dense grid.
        '& code': {
          fontFamily: t.fontFamily.mono.var,
          fontSize: '0.875em',
          backgroundColor: 'transparent',
          padding: 0,
        },
        '& p': { margin: 0 },
      },
      // "DOM props" disclosure attached under the table as its last row.
      more: {
        borderBlockStart: `${t.borderWidth.default.var} solid ${t.color.border.subtle.var}`,
        '& > summary': {
          display: 'flex',
          alignItems: 'center',
          gap: t.space.xs.var,
          cursor: 'pointer',
          paddingBlock: t.space.sm.var,
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.medium.var,
          color: t.color.text.secondary.var,
          '&:hover': { color: t.color.text.primary.var },
        },
      },
    },
  }),
});
