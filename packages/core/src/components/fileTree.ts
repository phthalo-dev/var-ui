import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

export const fileTree = typestyles.recipe(
  'fileTree',
  (c) => {
    const v = c.vars({
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
    });
    return {
      slots: ['root', 'list', 'item', 'listNested', 'row', 'folder', 'file'],
      root: {
        fontFamily: t.fontFamily.mono.var,
        fontSize: t.fontSize.sm.var,
        lineHeight: 1.5,
        color: v.rootForeground.var,
        margin: `${t.space[3].var} 0`,
        padding: t.space[3].var,
        borderRadius: t.radius.md.var,
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: v.rootBorder.var,
        backgroundColor: v.rootBackground.var,
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
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: t.space[4].var,
        borderLeftWidth: t.borderWidth.default.var,
        borderLeftStyle: 'solid',
        borderLeftColor: v.nestedBorder.var,
      },
      row: {
        display: 'block',
        padding: `${t.space[1].var} 0`,
        color: v.rowColor.var,
      },
      folder: {
        fontWeight: t.fontWeight.semibold.var,
        color: v.folderColor.var,
      },
      file: {
        color: v.fileColor.var,
      },
    };
  },
  { layer: 'components' },
);
