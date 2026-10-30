import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { border, borderSide } from '../internal/border';
import { designTokens as t } from '../tokens';

export const fileTree = typestyles.recipe({
  name: 'fileTree',
  layer: 'components',
  slots: ['root', 'list', 'item', 'listNested', 'row', 'folder', 'file'],
  vars: {
    rootForeground: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
    rootBorder: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
    rootBackground: {
      ...atProperty.color,
      value: t.color.background.subtle.var,
    },
    nestedBorder: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
    rowColor: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
    folderColor: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
    fileColor: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          fontFamily: t.fontFamily.mono.var,
          fontSize: t.fontSize.sm.var,
          lineHeight: 1.5,
          color: vars.rootForeground.var,
          margin: `${t.space[3].var} 0`,
          padding: t.space[3].var,
          borderRadius: t.radius.md.var,
          ...border(vars.rootBorder.var),
          backgroundColor: vars.rootBackground.var,
          overflowX: 'auto',
        },
        list: {
          listStyle: 'none',
          padding: 0,
          margin: 0,
        },
        item: {
          listStyle: 'none',
          margin: 0,
          padding: 0,
        },
        listNested: {
          listStyle: 'none',
          marginTop: t.space[1].var,
          marginInlineEnd: 0,
          marginBottom: 0,
          marginInlineStart: 0,
          paddingTop: 0,
          paddingInlineEnd: 0,
          paddingBottom: 0,
          paddingInlineStart: t.space[4].var,
          ...borderSide('inline-start', vars.nestedBorder.var),
        },
        row: {
          display: 'block',
          padding: `${t.space[1].var} 0`,
          color: vars.rowColor.var,
        },
        folder: {
          fontWeight: t.fontWeight.semibold.var,
          color: vars.folderColor.var,
        },
        file: {
          color: vars.fileColor.var,
        },
      },
    };
  },
});
