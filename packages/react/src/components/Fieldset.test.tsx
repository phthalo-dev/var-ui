import { createRef } from 'react';
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Fieldset } from './Fieldset';

describe('Fieldset', () => {
  it('renders a native fieldset named by its legend', () => {
    render(
      <Fieldset legend="Notifications">
        <input type="checkbox" aria-label="Email" />
      </Fieldset>,
    );
    const group = screen.getByRole('group', { name: 'Notifications' });
    expect(group.tagName).toBe('FIELDSET');
    expect(group.firstElementChild?.tagName).toBe('LEGEND');
  });

  it('passes native props through and merges className', () => {
    const ref = createRef<HTMLFieldSetElement>();
    render(
      <Fieldset legend="L" ref={ref} className="custom" form="f1" name="prefs" data-testid="fs">
        <span />
      </Fieldset>,
    );
    const el = screen.getByTestId('fs') as HTMLFieldSetElement;
    expect(ref.current).toBe(el);
    expect(el.className).toContain('custom');
    expect(el.className).toContain('var-ui-fieldset');
    expect(el.getAttribute('form')).toBe('f1');
    expect(el.getAttribute('name')).toBe('prefs');
  });

  it('wires description and error through aria-describedby without aria-invalid', () => {
    render(
      <Fieldset legend="L" description="Help text" errorMessage="Pick one" aria-describedby="x">
        <span />
      </Fieldset>,
    );
    const group = screen.getByRole('group');
    const ids = group.getAttribute('aria-describedby')!.split(' ');
    expect(ids[0]).toBe('x');
    expect(document.getElementById(ids[1])?.textContent).toBe('Help text');
    expect(document.getElementById(ids[2])?.textContent).toBe('Pick one');
    expect(group.hasAttribute('data-invalid')).toBe(true);
    expect(group.hasAttribute('aria-invalid')).toBe(false);
  });

  it('respects explicit invalid and has no hooks by default', () => {
    const { rerender } = render(
      <Fieldset legend="L" errorMessage="Bad" invalid={false} data-testid="fs">
        <span />
      </Fieldset>,
    );
    expect(screen.getByTestId('fs').hasAttribute('data-invalid')).toBe(false);
    rerender(
      <Fieldset legend="L" invalid data-testid="fs">
        <span />
      </Fieldset>,
    );
    expect(screen.getByTestId('fs').hasAttribute('data-invalid')).toBe(true);
    expect(screen.getByTestId('fs').hasAttribute('aria-describedby')).toBe(false);
  });

  it('sets native disabled and data-disabled', () => {
    render(
      <Fieldset legend="L" disabled data-testid="fs">
        <input aria-label="Name" />
      </Fieldset>,
    );
    const el = screen.getByTestId('fs') as HTMLFieldSetElement;
    expect(el.disabled).toBe(true);
    expect(el.hasAttribute('data-disabled')).toBe(true);
    expect((screen.getByLabelText('Name') as HTMLInputElement).matches(':disabled')).toBe(true);
  });

  it('supports compound parts in any order, legend first', () => {
    render(
      <Fieldset>
        <input aria-label="A" />
        <Fieldset.Error>Nope</Fieldset.Error>
        <Fieldset.Description>About</Fieldset.Description>
        <Fieldset.Legend>
          <em>Custom</em> legend
        </Fieldset.Legend>
      </Fieldset>,
    );
    const group = screen.getByRole('group', { name: 'Custom legend' });
    expect(group.firstElementChild?.tagName).toBe('LEGEND');
    expect(group.getAttribute('aria-describedby')?.split(' ')).toHaveLength(2);
    expect(group.hasAttribute('data-invalid')).toBe(true);
    expect(group.lastElementChild?.textContent).toBe('Nope');
  });

  it('flattens Fragments so compound parts still resolve', () => {
    render(
      <Fieldset>
        <>
          <Fieldset.Legend>Wrapped</Fieldset.Legend>
          <Fieldset.Description>About</Fieldset.Description>
          <input aria-label="A" />
        </>
      </Fieldset>,
    );
    const group = screen.getByRole('group', { name: 'Wrapped' });
    expect(group.firstElementChild?.tagName).toBe('LEGEND');
    expect(group.getAttribute('aria-describedby')?.split(' ')).toHaveLength(1);
  });

  it('applies layout axes and hidden legend as recipe hooks', () => {
    render(
      <Fieldset legend="L" legendHidden orientation="horizontal" gap="lg" data-testid="fs">
        <span />
      </Fieldset>,
    );
    const el = screen.getByTestId('fs');
    expect(el.getAttribute('data-orientation')).toBe('horizontal');
    expect(el.getAttribute('data-gap')).toBe('lg');
    expect(screen.getByRole('group', { name: 'L' })).toBe(el);
  });
});
