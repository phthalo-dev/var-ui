import type { ComponentPropsWithRef, JSX, ReactNode } from 'react';
import { fileTree } from '@var-ui/core/components/fileTree';
import { mergeProps } from 'typestyles';

export type FileTreeProps = ComponentPropsWithRef<'div'>;

function FileTreeRoot({ children, className, ref, ...rest }: FileTreeProps): JSX.Element {
  const t = fileTree();
  return (
    <div {...rest} {...mergeProps(t.root, className)} ref={ref}>
      <ul {...mergeProps(t.list)}>{children}</ul>
    </div>
  );
}

export type FileTreeFolderProps = Omit<ComponentPropsWithRef<'li'>, 'children'> & {
  name: string;
  children?: ReactNode;
};

function FileTreeFolder({
  name,
  children,
  className,
  ref,
  ...rest
}: FileTreeFolderProps): JSX.Element {
  const t = fileTree();
  return (
    <li {...rest} {...mergeProps(t.item, className)} ref={ref}>
      <span {...mergeProps(t.row)}>
        <span {...mergeProps(t.folder)}>{name}</span>
      </span>
      {children != null ? <ul {...mergeProps(t.listNested)}>{children}</ul> : null}
    </li>
  );
}

export type FileTreeFileProps = Omit<ComponentPropsWithRef<'li'>, 'children'> & {
  name: string;
};

function FileTreeFile({ name, className, ref, ...rest }: FileTreeFileProps): JSX.Element {
  const t = fileTree();
  return (
    <li {...rest} {...mergeProps(t.item, className)} ref={ref}>
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
