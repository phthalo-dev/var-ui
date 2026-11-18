import { createElement, type ComponentType, type ReactNode } from 'react';
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Prose, proseComponents } from './Prose';

type Components = Record<string, ComponentType<Record<string, unknown>>>;
const c = proseComponents as unknown as Components;

/** Render the way react-markdown does: mapped components, with the source `node` prop. */
function md(
  tag: keyof typeof proseComponents,
  props: Record<string, unknown>,
  ...children: ReactNode[]
) {
  return createElement(c[tag]!, { node: { type: 'element' }, ...props }, ...children);
}

describe('Prose', () => {
  it('renders a div with the prose class and density, merging className and native props', () => {
    render(
      <Prose density="compact" className="mine" data-testid="p" aria-label="Reply">
        <p>Hi</p>
      </Prose>,
    );
    const root = screen.getByTestId('p');
    expect(root.tagName).toBe('DIV');
    expect(root.className).toContain('var-ui-prose');
    expect(root.className).toContain('mine');
    expect(root.getAttribute('data-density')).toBe('compact');
    expect(root.getAttribute('aria-label')).toBe('Reply');
  });
});

describe('proseComponents', () => {
  it('renders a fenced block as a CodeBlock with the language and without the trailing newline', () => {
    render(md('pre', {}, md('code', { className: 'language-ts' }, 'const a = 1;\n')));
    expect(screen.getByText('const a = 1;')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Copy code' })).toBeTruthy();
    expect(document.querySelector('[data-node]')).toBeNull();
    expect(document.body.innerHTML).not.toContain('node=');
  });

  it('renders inline code as Code and links as Link, dropping the node prop', () => {
    render(
      <p>
        {md('code', {}, 'npm i')} and {md('a', { href: '/docs' }, 'docs')}
      </p>,
    );
    expect(screen.getByText('npm i').className).toContain('var-ui-inline-code');
    const link = screen.getByRole('link', { name: 'docs' });
    expect(link.getAttribute('href')).toBe('/docs');
    expect(link.className).toContain('var-ui-link');
    expect(link.hasAttribute('node')).toBe(false);
  });

  it('renders a GFM table as a Table with column alignment from text-align', () => {
    render(
      md(
        'table',
        {},
        md(
          'thead',
          {},
          md('tr', {}, md('th', {}, 'Name'), md('th', { style: { textAlign: 'right' } }, 'Runs')),
        ),
        md(
          'tbody',
          {},
          md('tr', {}, md('td', {}, 'main'), md('td', { style: { textAlign: 'right' } }, '42')),
        ),
      ),
    );
    const table = screen.getByRole('table');
    expect(table.parentElement?.className).toContain('var-ui-table');
    const runs = screen.getByRole('columnheader', { name: 'Runs' });
    expect(runs.getAttribute('data-align')).toBe('end');
    expect(runs.getAttribute('style')).toBeNull();
    expect(screen.getByRole('cell', { name: '42' }).getAttribute('data-align')).toBe('end');
    expect(screen.getByRole('columnheader', { name: 'Name' }).getAttribute('scope')).toBe('col');
  });
});
