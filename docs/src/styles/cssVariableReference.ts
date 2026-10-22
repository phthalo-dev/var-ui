import { designTokens as t, media, typestyles } from '@var-ui/core';

export const cssVariableReferenceStyles = typestyles.recipe({
  name: 'css-variable-reference',
  layer: 'components',
  slots: [
    'root',
    'section',
    'sectionTitle',
    'sectionDescription',
    'group',
    'groupTitle',
    'groupCount',
    'tableWrap',
    'table',
    'tokenCell',
    'varCell',
    'defaultCell',
  ],
  styles: () => ({
    base: {
      root: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[8].var,
        marginBlock: '1.5rem',
      },
      section: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[4].var,
      },
      sectionTitle: {
        margin: 0,
        fontSize: t.fontSize.lg.var,
        fontWeight: t.fontWeight.semibold.var,
        color: t.color.text.primary.var,
      },
      sectionDescription: {
        margin: 0,
        fontSize: t.fontSize.sm.var,
        color: t.color.text.secondary.var,
        lineHeight: t.lineHeight.relaxed.var,
      },
      group: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[2].var,
      },
      groupTitle: {
        margin: 0,
        fontSize: t.fontSize.md.var,
        fontWeight: t.fontWeight.medium.var,
        color: t.color.text.primary.var,
        display: 'flex',
        alignItems: 'baseline',
        gap: t.space[2].var,
      },
      groupCount: {
        fontSize: t.fontSize.sm.var,
        color: t.color.text.secondary.var,
        fontWeight: t.fontWeight.normal.var,
      },
      tableWrap: {
        overflowX: 'auto',
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: t.color.border.default.var,
        borderRadius: t.radius.md.var,
      },
      table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: t.fontSize.sm.var,
        lineHeight: t.lineHeight.normal.var,
        '& th, & td': {
          padding: `${t.space[2].var} ${t.space[3].var}`,
          textAlign: 'left',
          verticalAlign: 'top',
          borderBottomWidth: t.borderWidth.default.var,
          borderBottomStyle: 'solid',
          borderBottomColor: t.color.border.subtle.var,
        },
        '& th': {
          fontWeight: t.fontWeight.medium.var,
          color: t.color.text.secondary.var,
          backgroundColor: t.color.background.subtle.var,
        },
        '& tr:last-child td': {
          borderBottom: 'none',
        },
      },
      tokenCell: {
        fontFamily: t.fontFamily.mono.var,
        color: t.color.text.primary.var,
        whiteSpace: 'nowrap',
      },
      varCell: {
        fontFamily: t.fontFamily.mono.var,
        color: t.color.text.secondary.var,
        whiteSpace: 'nowrap',
      },
      defaultCell: {
        fontFamily: t.fontFamily.mono.var,
        color: t.color.text.secondary.var,
        maxWidth: '16rem',
        overflowWrap: 'anywhere',
      },
      ...media('sm', 'max', {
        defaultCell: {
          maxWidth: '10rem',
        },
      }),
    },
  }),
});
