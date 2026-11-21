import type { ReactNode } from 'react';
import { HighlightedCodeBlock } from '../HighlightedCodeBlock';
import { stage } from '@var-ui/core';
import { combine } from '@var-ui/react';
import { configuratorStyles } from '@/styles/configurator';

export type ComponentConfiguratorProps = {
  preview: ReactNode;
  controls: ReactNode;
  code: string;
  language: string;
  filename?: string;
};

export function ComponentConfigurator({
  preview,
  controls,
  code,
  language,
  filename,
}: ComponentConfiguratorProps) {
  const c = configuratorStyles();

  return (
    <div className={c.root.className} data-component-configurator>
      <div className={c.workspace.className}>
        <div {...combine(stage(), c.preview)} data-not-prose>
          <div className={c.previewInner.className}>{preview}</div>
        </div>
        <aside className={c.controls.className} aria-label="Component options">
          {controls}
        </aside>
      </div>
      <div className={c.code.className}>
        <HighlightedCodeBlock code={code} language={language} {...(filename ? { filename } : {})} />
      </div>
    </div>
  );
}
