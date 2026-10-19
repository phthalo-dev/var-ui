'use client';

import type { DocsFramework } from '@var-ui/docs-components/framework';
import { Layout, LayoutContent, LayoutPanel, ResizeHandle, useResizable } from '@var-ui/react';
import PlaygroundEditorSidebar from './PlaygroundEditorSidebar';
import ThemePlayground from './ThemePlayground';
import { playgroundShellStyles } from '@/styles/playgroundShell';

export type PlaygroundShellProps = {
  framework?: DocsFramework;
};

export default function PlaygroundShell({ framework }: PlaygroundShellProps) {
  const { start } = useResizable({
    regions: {
      start: {
        defaultWidth: 300,
        minWidth: 240,
        maxWidth: 420,
        autoSaveId: 'playground-editor',
      },
    },
  });
  const shell = playgroundShellStyles();

  return (
    <div className={shell.root.className} data-playground-shell>
      <Layout
        height="fill"
        padding={0}
        className={shell.layout.className}
        start={
          <>
            <LayoutPanel
              resizable={start}
              hasDivider
              padding={0}
              isScrollable
              label="Theme editor"
              role="complementary"
            >
              <PlaygroundEditorSidebar />
            </LayoutPanel>
            <ResizeHandle {...start.handleProps} aria-label="Resize editor panel" />
          </>
        }
        content={
          <LayoutContent padding={0}>
            <ThemePlayground framework={framework} />
          </LayoutContent>
        }
      />
    </div>
  );
}
