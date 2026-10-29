import type { JSX, ReactNode, Ref } from 'react';
import { fileTree } from '@var-ui/core/components/fileTree';
import { mergeProps } from 'typestyles';

export type FileTreeProps = {
  children: ReactNode;
  className?: string;
  /** Ref to the underlying root `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

function FileTreeRoot({ children, className, ref }: FileTreeProps): JSX.Element {
  const t = fileTree();
  return (
    <div {...mergeProps(t.root, className)} ref={ref}>
      <ul {...mergeProps(t.list)}>{children}</ul>
    </div>
  );
}

export type FileTreeFolderProps = {
  name: string;
  children?: ReactNode;
  className?: string;
  /** Ref to the underlying `<li>` element. */
  ref?: Ref<HTMLLIElement>;
};

function FileTreeFolder({ name, children, className, ref }: FileTreeFolderProps): JSX.Element {
  const t = fileTree();
  return (
    <li {...mergeProps(t.item, className)} ref={ref}>
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
  /** Ref to the underlying `<li>` element. */
  ref?: Ref<HTMLLIElement>;
};

function FileTreeFile({ name, className, ref }: FileTreeFileProps): JSX.Element {
  const t = fileTree();
  return (
    <li {...mergeProps(t.item, className)} ref={ref}>
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
