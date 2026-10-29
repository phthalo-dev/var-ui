import { createRef } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders children and applies the tone recipe attrs', () => {
    render(
      <Button tone="accent" appearance="filled">
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button.className).toContain('var-ui-button');
    expect(button.getAttribute('data-tone')).toBe('accent');
    expect(button.getAttribute('data-appearance')).toBe('filled');
  });

  it('applies explicit tone and appearance', () => {
    render(
      <Button tone="danger" appearance="outline">
        Delete
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button.getAttribute('data-tone')).toBe('danger');
    expect(button.getAttribute('data-appearance')).toBe('outline');
  });

  it('forwards a ref to the underlying button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Save</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    ref.current?.focus();
    expect(document.activeElement).toBe(ref.current);
  });

  it('passes native attributes to the button, including ones RAC filters out', async () => {
    const onClick = vi.fn();
    render(
      <Button
        data-testid="b"
        id="save"
        title="Save it"
        tabIndex={-1}
        aria-label="Save now"
        aria-keyshortcuts="Control+S"
        name="intent"
        form="f"
        onClick={onClick}
        className="custom"
        style={{ color: 'red' }}
      >
        Save
      </Button>,
    );
    const button = screen.getByTestId('b');
    expect(button.id).toBe('save');
    expect(button.getAttribute('title')).toBe('Save it');
    expect(button.getAttribute('tabindex')).toBe('-1');
    expect(button.getAttribute('aria-label')).toBe('Save now');
    expect(button.getAttribute('aria-keyshortcuts')).toBe('Control+S');
    expect(button.getAttribute('name')).toBe('intent');
    expect(button.getAttribute('form')).toBe('f');
    expect(button.style.color).toBe('red');
    expect(button.className).toContain('var-ui-button');
    expect(button.className).toContain('custom');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders an anchor when href is set and passes attributes and ref through', async () => {
    const ref = createRef<HTMLAnchorElement>();
    const onClick = vi.fn((event: { preventDefault(): void }) => event.preventDefault());
    render(
      <Button
        href="/docs"
        ref={ref}
        data-testid="a"
        title="Docs"
        target="_blank"
        rel="noreferrer"
        tone="accent"
        className="custom"
        onClick={onClick}
      >
        Docs
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toBeInstanceOf(HTMLAnchorElement);
    expect(ref.current).toBe(link);
    expect(link.getAttribute('href')).toBe('/docs');
    expect(link.getAttribute('title')).toBe('Docs');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('data-testid')).toBe('a');
    expect(link.getAttribute('data-tone')).toBe('accent');
    expect(link.className).toContain('var-ui-button');
    expect(link.className).toContain('custom');
    await userEvent.click(link);
    expect(onClick).toHaveBeenCalled();
  });

  it('marks a disabled link as aria-disabled', () => {
    render(
      <Button href="/docs" isDisabled>
        Docs
      </Button>,
    );
    expect(screen.getByRole('link').getAttribute('aria-disabled')).toBe('true');
  });
});
