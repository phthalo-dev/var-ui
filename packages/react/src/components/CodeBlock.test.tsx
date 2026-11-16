import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';
import { CodeBlock } from './CodeBlock';
import { CopyButton } from './CopyButton';

describe('CodeBlock', () => {
  // Must run before any other render in this file: typestyles dev warnings are
  // emitted once per call site, so the first render is the only chance to catch them.
  it('renders without typestyles dev warnings', () => {
    const warnings: string[] = [];
    const spy = vi.spyOn(console, 'warn').mockImplementation((message) => {
      warnings.push(String(message));
    });
    try {
      render(
        <div>
          <CodeBlock code={'const x = 1;\nconst y = 2;'} language="tsx" />
          <CodeBlock code="x" variant="inline" />
          <CodeBlock
            code={'alpha\nbeta\ngamma'}
            showLineNumbers
            highlightedLines={[2]}
            wrapLongLines
            copyable={false}
          />
          <Card title="Usage">1.2M requests.</Card>
          <CopyButton value="hello" />
        </div>,
      );
      expect(warnings.filter((message) => message.includes('[typestyles]'))).toEqual([]);
      expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    } finally {
      spy.mockRestore();
    }
  });

  it('renders code with a language tag', () => {
    render(<CodeBlock code={'const x = 1'} language="tsx" />);
    expect(screen.getByText('tsx')).toBeTruthy();
  });

  it('marks highlighted lines and wrap mode with data attributes', () => {
    const { container } = render(
      <CodeBlock code={'alpha\nbeta'} showLineNumbers highlightedLines={[2]} wrapLongLines />,
    );
    expect(container.querySelector('pre[data-wrap]')).toBeTruthy();
    expect(container.querySelector('code[data-line-numbers]')).toBeTruthy();
    const lines = container.querySelectorAll<HTMLElement>(
      '[data-codeblock-pre] [data-highlighted]',
    );
    expect(lines.length).toBe(1);
    expect(lines[0].textContent).toContain('beta');
  });

  it('classifies diff lines with line numbers and applies the max height', () => {
    const { container } = render(
      <CodeBlock
        code={'@@ -1 +1 @@\n-old\n+new'}
        variant="diff"
        showLineNumbers
        maxHeight="20rem"
        copyable={false}
      />,
    );
    const body = container.querySelector<HTMLElement>('[data-codeblock-body]')!;
    expect(body.style.getPropertyValue('--var-ui-code-block-maxheight')).toBe('20rem');
    expect(
      Array.from(container.querySelectorAll('[data-line-tone]')).map((line) =>
        line.getAttribute('data-line-tone'),
      ),
    ).toEqual(['hunk', 'deleted', 'added']);
  });

  it('renders the inline variant as a single code element with both slot classes', () => {
    const { container } = render(<CodeBlock code="const x = 1" variant="inline" />);
    const code = container.querySelector('code[data-codeblock]')!;
    expect(code.className).toContain('var-ui-code-block');
  });
});
