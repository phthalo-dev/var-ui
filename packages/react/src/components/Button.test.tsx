import { createRef, type ComponentPropsWithRef, type Ref } from 'react';
import { describe, expect, expectTypeOf, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
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
    expectTypeOf<ComponentPropsWithRef<typeof Button>['ref']>().toEqualTypeOf<
      Ref<HTMLButtonElement> | undefined
    >();

    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Save</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    ref.current?.focus();
    expect(document.activeElement).toBe(ref.current);
  });
});
