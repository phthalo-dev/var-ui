import type { JSX, ReactNode } from 'react';
import { fileTree } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type FileTreeProps = {
  children: ReactNode;
  className?: string;
};

function FileTreeRoot({ children, className }: FileTreeProps): JSX.Element {
  const t = fileTree();
  return (
    <div {...mergeProps(t.root, className)}>
      <ul {...mergeProps(t.list)}>{children}</ul>
    </div>
  );
}

export type FileTreeFolderProps = {
  name: string;
  children?: ReactNode;
  className?: string;
};

function FileTreeFolder({ name, children, className }: FileTreeFolderProps): JSX.Element {
  const t = fileTree();
  return (
    <li {...mergeProps(t.item, className)}>
      <span {...mergeProps(t.row)}>
        <span {...mergeProps(t.folder)}>{name}</span>
      </span>
      {children != null ? <ul {...mergeProps(t.listNested)}>{children}</ul> : null}
    </li>
  );
}

export type FileTreeFileProps = {
  name: string;
  className?: string;
};

function FileTreeFile({ name, className }: FileTreeFileProps): JSX.Element {
  const t = fileTree();
  return (
    <li {...mergeProps(t.item, className)}>
      <span {...mergeProps(t.row)}>
        <span {...mergeProps(t.file)}>{name}</span>
      </span>
    </li>
  );
}

export const FileTree = Object.assign(FileTreeRoot, {
  Folder: FileTreeFolder,
  File: FileTreeFile,
});
