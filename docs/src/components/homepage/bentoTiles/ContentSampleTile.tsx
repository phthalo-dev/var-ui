'use client';

import type { DocsFramework } from '@var-ui/docs-components/framework';
import { HighlightedCodeBlock } from '../../HighlightedCodeBlock';
import { Heading, Link, Text, Timestamp, VStack } from '@var-ui/react';

export type ContentSampleTileProps = {
  className?: string;
  framework?: DocsFramework;
};

function frameworkImportSnippet(framework: DocsFramework): string {
  switch (framework) {
    case 'react':
      return "import { Button } from '@var-ui/react';";
    case 'astro':
      return "import { Button } from '@var-ui/astro';";
    case 'html':
      return '<button type="button" class="var-ui-button">Click me</button>';
  }
}

function frameworkCodeLanguage(framework: DocsFramework): string {
  switch (framework) {
    case 'react':
      return 'tsx';
    case 'astro':
      return 'astro';
    case 'html':
      return 'html';
  }
}

export function ContentSampleTile({ className, framework = 'react' }: ContentSampleTileProps) {
  return (
    <div className={className}>
      <VStack gap="sm">
        <Heading level={3} size="sm">
          Release notes
        </Heading>
        <Text size="sm" tone="secondary">
          Published <Timestamp date="2026-06-30T12:00:00Z" format="date" />
        </Text>
        <Text>
          Pin a subtree with <code>data-color-mode</code> (<code>COLOR_MODE_ATTRIBUTE</code>
          ). See <Link href="/theming">the theming guide</Link> for details.
        </Text>
        <HighlightedCodeBlock
          code={frameworkImportSnippet(framework)}
          language={frameworkCodeLanguage(framework)}
        />
      </VStack>
    </div>
  );
}
