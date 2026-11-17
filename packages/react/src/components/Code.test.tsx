import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Code } from './Code';

describe('Code', () => {
  it('renders children inside a code element with inline code class', () => {
    render(<Code>theme.className</Code>);
    const el = screen.getByText('theme.className');
    expect(el.tagName).toBe('CODE');
    expect(el.className).toContain('var-ui-inline-code');
  });

  it('keeps the snippet on one line with nowrap', () => {
    render(<Code nowrap>@var-ui/react</Code>);
    const el = screen.getByText('@var-ui/react');
    expect(el.hasAttribute('data-nowrap')).toBe(true);
  });
});
