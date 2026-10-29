import { useContext } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Field } from './Field';
import { Form, FormErrorsContext } from './Form';

describe('Form', () => {
  it('does not call onSubmit when required input is empty and focuses the control', async () => {
    const onSubmit = vi.fn();
    render(
      <Form onSubmit={onSubmit}>
        <Field.Root name="email">
          <Field.Label>Email</Field.Label>
          <Field.Control>
            <input name="email" required />
          </Field.Control>
          <Field.Error />
        </Field.Root>
        <button type="submit">Save</button>
      </Form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(screen.getByLabelText('Email'));
  });

  it('calls onSubmit with FormData when valid', async () => {
    const onSubmit = vi.fn();
    render(
      <Form onSubmit={onSubmit}>
        <Field.Root name="email">
          <Field.Label>Email</Field.Label>
          <Field.Control>
            <input name="email" defaultValue="ada@example.com" />
          </Field.Control>
        </Field.Root>
        <button type="submit">Save</button>
      </Form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).toHaveBeenCalled();
    const data = onSubmit.mock.calls[0][1] as FormData;
    expect(data.get('email')).toBe('ada@example.com');
  });

  it('does not call onSubmit when errors map is set and focuses a quoted name', async () => {
    const onSubmit = vi.fn();
    const name = 'user["email"]';
    render(
      <Form onSubmit={onSubmit} errors={{ [name]: 'Taken' }}>
        <Field.Root name={name}>
          <Field.Label>Email</Field.Label>
          <Field.Control>
            <input name={name} defaultValue="ada@example.com" />
          </Field.Control>
          <Field.Error />
        </Field.Root>
        <button type="submit">Save</button>
      </Form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(screen.getByLabelText('Email'));
  });

  it('shows Form errors map on the matching Field', () => {
    render(
      <Form errors={{ email: 'Taken' }}>
        <Field.Root name="email">
          <Field.Label>Email</Field.Label>
          <Field.Control>
            <input name="email" />
          </Field.Control>
          <Field.Error />
        </Field.Root>
      </Form>,
    );
    expect(screen.getByRole('alert').textContent).toBe('Taken');
  });
});

describe('Form async errors', () => {
  function Fixture(props: { onSubmit: () => Promise<void>; onError?: (e: unknown) => void }) {
    return (
      <Form onSubmit={props.onSubmit} onError={props.onError}>
        <button type="submit">Save</button>
      </Form>
    );
  }

  it('passes a rejected async onSubmit to onError', async () => {
    const error = new Error('boom');
    const onError = vi.fn();
    render(<Fixture onSubmit={() => Promise.reject(error)} onError={onError} />);
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await vi.waitFor(() => expect(onError).toHaveBeenCalledWith(error));
  });

  it('reports a rejected async onSubmit when onError is absent', async () => {
    const error = new Error('boom');
    const spy = vi.fn();
    vi.stubGlobal('reportError', spy);
    try {
      render(<Fixture onSubmit={() => Promise.reject(error)} />);
      await userEvent.click(screen.getByRole('button', { name: 'Save' }));
      await vi.waitFor(() => expect(spy).toHaveBeenCalledWith(error));
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('keeps a stable errors context value across renders when errors is omitted', async () => {
    const seen: unknown[] = [];
    function Probe() {
      seen.push(useContext(FormErrorsContext));
      return null;
    }
    const { rerender } = render(
      <Form>
        <Probe />
      </Form>,
    );
    rerender(
      <Form>
        <Probe />
      </Form>,
    );
    expect(seen.length).toBeGreaterThan(1);
    expect(new Set(seen).size).toBe(1);
  });
});
