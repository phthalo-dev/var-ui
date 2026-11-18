'use client';

import {
  Button,
  Drawer,
  Layout,
  LayoutContent,
  LayoutPanel,
  ResizeHandle,
  useResizable,
} from '@var-ui/react';
import PlaygroundEditorSidebar from './PlaygroundEditorSidebar';
import ThemePlayground from './ThemePlayground';
import { playgroundShellStyles } from '@/styles/playgroundShell';

export default function PlaygroundShell() {
  const { start } = useResizable({
    regions: {
      start: {
        defaultWidth: 280,
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
        padding="none"
        className={shell.layout.className}
        start={
          <>
            <LayoutPanel
              className={shell.sidePanel.className}
              resizable={start}
              hasDivider
              padding="none"
              scrollable
              label="Theme editor"
              role="complementary"
            >
              <PlaygroundEditorSidebar />
            </LayoutPanel>
            <ResizeHandle
              {...start.handleProps}
              className={shell.sidePanel.className}
              aria-label="Resize editor panel"
            />
          </>
        }
        content={
          <LayoutContent padding="none">
            <ThemePlayground
              toolbarStart={
                <Drawer aria-label="Theme controls">
                  <Drawer.Trigger>
                    <Button
                      appearance="outline"
                      size="sm"
                      className={shell.controlsButton.className}
                    >
                      Theme controls
                    </Button>
                  </Drawer.Trigger>
                  <Drawer.Popup placement="start" width={320}>
                    <Drawer.Header>
                      <Drawer.Title>Theme controls</Drawer.Title>
                      <Drawer.Close />
                    </Drawer.Header>
                    <Drawer.Body>
                      <PlaygroundEditorSidebar />
                    </Drawer.Body>
                  </Drawer.Popup>
                </Drawer>
              }
            />
          </LayoutContent>
        }
      />
    </div>
  );
}
