import { describe, expect, it, vi } from 'vite-plus/test';
import type { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { IconProvider } from '../icons';
import { Accordion } from './Accordion';

function panelFor(text: string): HTMLElement {
  const el = screen.getByText(text).closest('[role="group"]');
  if (!(el instanceof HTMLElement)) {
    throw new Error(`No disclosure panel found for "${text}"`);
  }
  return el;
}

function renderAccordion(props?: Partial<ComponentProps<typeof Accordion>>) {
  return render(
    <IconProvider icons={{}}>
      <Accordion {...props}>
        <Accordion.Item id="billing">
          <Accordion.Trigger>Billing</Accordion.Trigger>
          <Accordion.Panel>
            <p>Billing details</p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="shipping">
          <Accordion.Trigger>Shipping</Accordion.Trigger>
          <Accordion.Panel>
            <p>Shipping details</p>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </IconProvider>,
  );
}

describe('Accordion', () => {
  it('opens a panel on trigger press', async () => {
    renderAccordion();
    expect(panelFor('Billing details').getAttribute('aria-hidden')).toBe('true');
    await userEvent.click(screen.getByRole('button', { name: /Billing/i }));
    expect(panelFor('Billing details').getAttribute('aria-hidden')).not.toBe('true');
  });

  it('allows only one open panel in single mode', async () => {
    renderAccordion({ type: 'single' });
    await userEvent.click(screen.getByRole('button', { name: /Billing/i }));
    await userEvent.click(screen.getByRole('button', { name: /Shipping/i }));
    expect(panelFor('Shipping details').getAttribute('aria-hidden')).not.toBe('true');
    expect(panelFor('Billing details').getAttribute('aria-hidden')).toBe('true');
  });

  it('allows multiple open panels in multiple mode', async () => {
    renderAccordion({ type: 'multiple' });
    await userEvent.click(screen.getByRole('button', { name: /Billing/i }));
    await userEvent.click(screen.getByRole('button', { name: /Shipping/i }));
    expect(panelFor('Billing details').getAttribute('aria-hidden')).not.toBe('true');
    expect(panelFor('Shipping details').getAttribute('aria-hidden')).not.toBe('true');
  });

  it('respects defaultValue', () => {
    renderAccordion({ defaultValue: ['shipping'] });
    expect(panelFor('Shipping details').getAttribute('aria-hidden')).not.toBe('true');
    expect(panelFor('Billing details').getAttribute('aria-hidden')).toBe('true');
  });

  it('calls onValueChange with the open ids', async () => {
    const onValueChange = vi.fn();
    renderAccordion({ onValueChange });
    await userEvent.click(screen.getByRole('button', { name: /Billing/i }));
    expect(onValueChange).toHaveBeenCalledWith(['billing']);
  });

  it('supports controlled value', async () => {
    function Controlled() {
      const [keys, setKeys] = useState<string[]>(['billing']);
      return (
        <IconProvider icons={{}}>
          <Accordion value={keys} onValueChange={setKeys}>
            <Accordion.Item id="billing">
              <Accordion.Trigger>Billing</Accordion.Trigger>
              <Accordion.Panel>
                <p>Billing details</p>
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item id="shipping">
              <Accordion.Trigger>Shipping</Accordion.Trigger>
              <Accordion.Panel>
                <p>Shipping details</p>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </IconProvider>
      );
    }

    render(<Controlled />);
    expect(panelFor('Billing details').getAttribute('aria-hidden')).not.toBe('true');
    await userEvent.click(screen.getByRole('button', { name: /Shipping/i }));
    expect(panelFor('Shipping details').getAttribute('aria-hidden')).not.toBe('true');
    expect(panelFor('Billing details').getAttribute('aria-hidden')).toBe('true');
  });

  it('prevents closing the last open panel when collapsible is false', async () => {
    renderAccordion({ collapsible: false, defaultValue: ['billing'] });
    await userEvent.click(screen.getByRole('button', { name: /Billing/i }));
    expect(panelFor('Billing details').getAttribute('aria-hidden')).not.toBe('true');
  });
});
