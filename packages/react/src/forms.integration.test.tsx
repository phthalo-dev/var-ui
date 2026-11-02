/**
 * react-hook-form (+ Zod) and `<Form>` integration, in jsdom. The components that need a real
 * browser (Select, Combobox, date fields, Rating, ...) are in `forms.integration.browser.test.tsx`;
 * the examples of the forms guide live in `test/formsGuide.tsx`.
 */
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Controller,
  useController,
  useForm,
  type FieldValues,
  type UseFormProps,
  type UseFormReturn,
} from 'react-hook-form';
import { Checkbox } from './components/Checkbox';
import { CheckboxGroup } from './components/CheckboxGroup';
import { FileInput } from './components/FileInput';
import { NumberInput } from './components/NumberInput';
import { PasswordInput } from './components/PasswordInput';
import { PinInput } from './components/PinInput';
import { RadioGroup } from './components/RadioGroup';
import { Slider } from './components/Slider';
import { Switch } from './components/Switch';
import { TextAreaField } from './components/TextAreaField';
import { TextField } from './components/TextField';
import {
  focusFirst,
  InviteForm,
  NewsletterForm,
  OrderForm,
  ProfileForm,
  SignUpForm,
  UsernameForm,
} from './test/formsGuide';

/** Renders `fields(form)` in a react-hook-form `<form>` and exposes the form API. */
function renderRhf<T extends FieldValues>(
  fields: (form: UseFormReturn<T>) => ReactNode,
  options: UseFormProps<T> = {},
) {
  const onValid = vi.fn();
  const api: { current: UseFormReturn<T> } = { current: undefined as never };
  function Harness() {
    const form = useForm<T>(options);
    api.current = form;
    return (
      <form onSubmit={form.handleSubmit(onValid)}>
        {fields(form)}
        <button type="submit">Submit</button>
      </form>
    );
  }
  render(<Harness />);
  const submit = async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(api.current.formState.isSubmitting).toBe(false));
  };
  return { form: () => api.current, onValid, submit };
}

type Field = Record<string, any>;

const choices = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
];

describe('register() on text-like fields', () => {
  const fields = [
    ['TextField', (props: object) => <TextField label="Field" {...props} />],
    ['TextAreaField', (props: object) => <TextAreaField label="Field" {...props} />],
    ['PasswordInput', (props: object) => <PasswordInput label="Field" {...props} />],
  ] as const;

  describe.each(fields)('%s', (_name, renderField) => {
    const input = () => screen.getByLabelText('Field', { selector: 'input,textarea' });

    it('submits typed text under its name', async () => {
      const { submit, onValid } = renderRhf<{ field: string }>((f) =>
        renderField(f.register('field')),
      );
      await userEvent.type(input(), 'hello');
      await submit();
      expect(onValid.mock.calls[0]![0]).toEqual({ field: 'hello' });
    });

    it('shows defaultValues, setValue() and reset() in the UI', async () => {
      const { form } = renderRhf<{ field: string }>((f) => renderField(f.register('field')), {
        defaultValues: { field: 'initial' },
      });
      expect((input() as HTMLInputElement).value).toBe('initial');
      act(() => form().setValue('field', 'set'));
      expect((input() as HTMLInputElement).value).toBe('set');
      await userEvent.type(input(), '!');
      expect(form().getValues('field')).toBe('set!');
      act(() => form().reset({ field: 'fresh' }));
      expect((input() as HTMLInputElement).value).toBe('fresh');
    });

    it('reports dirty and touched', async () => {
      const { form } = renderRhf<{ field: string }>(
        (f) => {
          // Subscribe to the form state proxy.
          void f.formState.isDirty;
          void f.formState.touchedFields;
          return renderField(f.register('field'));
        },
        { defaultValues: { field: '' } },
      );
      expect(form().formState.isDirty).toBe(false);
      await userEvent.type(input(), 'x');
      expect(form().formState.isDirty).toBe(true);
      expect(form().formState.touchedFields.field).toBeUndefined();
      await userEvent.tab();
      expect(form().formState.touchedFields.field).toBe(true);
      await userEvent.clear(input());
      expect(form().formState.isDirty).toBe(false);
    });

    it('focuses the first invalid field and wires the error', async () => {
      const { submit } = renderRhf<{ field: string }>(
        (f) =>
          renderField({
            ...f.register('field', { required: 'Required' }),
            errorMessage: f.formState.errors.field?.message,
          }),
        { defaultValues: { field: '' } },
      );
      await submit();
      expect(document.activeElement).toBe(input());
      const message = await screen.findByText('Required');
      expect(input().getAttribute('aria-invalid')).toBe('true');
      expect(input().getAttribute('aria-describedby')).toContain(message.id);
    });
  });

  it('keeps a controlled value controlled', async () => {
    renderRhf<{ field: string }>(
      (f) => {
        const { field } = useController({ control: f.control, name: 'field' });
        return (
          <TextField
            label="Field"
            name={field.name}
            ref={field.ref}
            value={field.value}
            onValueChange={field.onChange}
            onBlur={field.onBlur}
          />
        );
      },
      { defaultValues: { field: 'a' } },
    );
    await userEvent.type(screen.getByLabelText('Field'), 'b');
    expect((screen.getByLabelText('Field') as HTMLInputElement).value).toBe('ab');
  });
});

describe('register() on Checkbox and Switch', () => {
  const fields = [
    ['Checkbox', 'checkbox', (props: object) => <Checkbox {...props}>Accept</Checkbox>],
    ['Switch', 'switch', (props: object) => <Switch {...props}>Accept</Switch>],
  ] as const;

  describe.each(fields)('%s', (_name, role, renderField) => {
    const control = () => screen.getByRole(role) as HTMLInputElement;
    const selected = () => control().closest('label')!.hasAttribute('data-selected');

    it('submits a boolean', async () => {
      const { submit, onValid } = renderRhf<{ accept: boolean }>(
        (f) => renderField(f.register('accept')),
        { defaultValues: { accept: false } },
      );
      await userEvent.click(control());
      await submit();
      expect(onValid.mock.calls[0]![0]).toEqual({ accept: true });
    });

    it('shows defaultValues, setValue() and reset() in the UI', () => {
      const { form } = renderRhf<{ accept: boolean }>((f) => renderField(f.register('accept')), {
        defaultValues: { accept: true },
      });
      expect(control().checked).toBe(true);
      expect(selected()).toBe(true);
      act(() => form().setValue('accept', false));
      expect(control().checked).toBe(false);
      expect(selected()).toBe(false);
      act(() => form().setValue('accept', true));
      expect(selected()).toBe(true);
      act(() => form().reset({ accept: false }));
      expect(control().checked).toBe(false);
      expect(selected()).toBe(false);
    });

    it('reset() undoes a click', async () => {
      const { form } = renderRhf<{ accept: boolean }>((f) => renderField(f.register('accept')), {
        defaultValues: { accept: false },
      });
      await userEvent.click(control());
      expect(selected()).toBe(true);
      act(() => form().reset());
      expect(control().checked).toBe(false);
      expect(selected()).toBe(false);
    });

    it('reports dirty and touched', async () => {
      const { form } = renderRhf<{ accept: boolean }>(
        (f) => {
          void f.formState.isDirty;
          void f.formState.touchedFields;
          return renderField(f.register('accept'));
        },
        { defaultValues: { accept: false } },
      );
      await userEvent.click(control());
      expect(form().formState.isDirty).toBe(true);
      await userEvent.tab();
      expect(form().formState.touchedFields.accept).toBe(true);
    });

    it('follows a native form reset', async () => {
      render(
        <form>
          {renderField({ defaultChecked: true })}
          <button type="reset">Reset</button>
        </form>,
      );
      await userEvent.click(control());
      expect(selected()).toBe(false);
      fireEvent.reset(control().form!);
      // jsdom restores the default state of the element; the state follows the write.
      await waitFor(() => expect(control().checked).toBe(true));
    });
  });

  it('keeps `checked` controlled when the DOM is written to', () => {
    const { rerender } = render(<Checkbox checked={false}>Accept</Checkbox>);
    const input = screen.getByRole('checkbox') as HTMLInputElement;
    input.checked = true;
    rerender(<Checkbox checked={false}>Accept</Checkbox>);
    expect(input.closest('label')!.hasAttribute('data-selected')).toBe(false);
  });
});

describe('Controller on composite controls', () => {
  it('RadioGroup', async () => {
    const { form, submit, onValid } = renderRhf<{ pick: string | null }>(
      (f) => (
        <Controller
          control={f.control}
          name="pick"
          render={({ field, fieldState }) => (
            <RadioGroup
              label="Pick"
              options={choices}
              name={field.name}
              ref={field.ref}
              value={field.value}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              errorMessage={fieldState.error?.message}
            />
          )}
        />
      ),
      { defaultValues: { pick: 'a' } },
    );
    expect((screen.getByLabelText('Alpha') as HTMLInputElement).checked).toBe(true);
    await userEvent.click(screen.getByLabelText('Beta'));
    await submit();
    expect(onValid.mock.calls[0]![0]).toEqual({ pick: 'b' });
    act(() => form().setValue('pick', 'c'));
    expect((screen.getByLabelText('Gamma') as HTMLInputElement).checked).toBe(true);
    act(() => form().reset());
    expect((screen.getByLabelText('Alpha') as HTMLInputElement).checked).toBe(true);
  });

  it('CheckboxGroup', async () => {
    const { form, submit, onValid } = renderRhf<{ pick: string[] }>(
      (f) => (
        <Controller
          control={f.control}
          name="pick"
          render={({ field }) => (
            <CheckboxGroup
              label="Pick"
              options={choices}
              name={field.name}
              ref={field.ref}
              value={field.value}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      ),
      { defaultValues: { pick: ['a'] } },
    );
    await userEvent.click(screen.getByLabelText('Gamma'));
    await submit();
    expect(onValid.mock.calls[0]![0]).toEqual({ pick: ['a', 'c'] });
    act(() => form().reset());
    expect((screen.getByLabelText('Gamma') as HTMLInputElement).checked).toBe(false);
  });

  it('Slider', async () => {
    const { form, submit, onValid } = renderRhf<{ level: number }>(
      (f) => (
        <Controller
          control={f.control}
          name="level"
          render={({ field }) => (
            <Slider
              label="Level"
              name={field.name}
              ref={field.ref}
              value={field.value}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      ),
      { defaultValues: { level: 10 } },
    );
    const thumb = screen.getByRole('slider') as HTMLInputElement;
    thumb.focus();
    await userEvent.keyboard('{ArrowRight}');
    await submit();
    expect(onValid.mock.calls[0]![0]).toEqual({ level: 11 });
    act(() => form().setValue('level', 40));
    expect(thumb.value).toBe('40');
  });

  it('PinInput', async () => {
    const { form, submit, onValid } = renderRhf<{ code: string }>(
      (f) => (
        <Controller
          control={f.control}
          name="code"
          render={({ field }) => (
            <PinInput
              label="Code"
              length={3}
              name={field.name}
              ref={field.ref}
              value={field.value}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      ),
      { defaultValues: { code: '' } },
    );
    await userEvent.click(screen.getAllByRole('textbox')[0]!);
    await userEvent.keyboard('123');
    await submit();
    expect(onValid.mock.calls[0]![0]).toEqual({ code: '123' });
    act(() => form().reset());
    expect((screen.getAllByRole('textbox')[0] as HTMLInputElement).value).toBe('');
  });

  it('NumberInput', async () => {
    const { form, submit, onValid } = renderRhf<{ qty: number }>(
      (f) => (
        <Controller
          control={f.control}
          name="qty"
          render={({ field }) => (
            <NumberInput
              label="Quantity"
              name={field.name}
              ref={field.ref}
              value={field.value}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      ),
      { defaultValues: { qty: 1 } },
    );
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await userEvent.clear(input);
    await userEvent.type(input, '12');
    await userEvent.tab();
    await submit();
    expect(onValid.mock.calls[0]![0]).toEqual({ qty: 12 });
    act(() => form().setValue('qty', 3));
    expect(input.value).toBe('3');
  });

  it('FileInput', async () => {
    const file = new File(['x'], 'cv.txt', { type: 'text/plain' });
    const { form, submit, onValid } = renderRhf<{ cv: File | null }>(
      (f) => (
        <Controller
          control={f.control}
          name="cv"
          render={({ field }) => (
            <FileInput
              label="CV"
              name={field.name}
              ref={field.ref}
              value={field.value as File | null}
              onValueChange={(next) => field.onChange(next as File | null)}
              onBlur={field.onBlur}
            />
          )}
        />
      ),
      { defaultValues: { cv: null } },
    );
    const input = document.querySelector('input[type=file]') as HTMLInputElement;
    await userEvent.upload(input, file);
    await submit();
    expect(onValid.mock.calls[0]![0]).toEqual({ cv: file });
    expect(screen.getByText('cv.txt')).toBeTruthy();
    act(() => form().reset());
    await waitFor(() => expect(screen.queryByText('cv.txt')).toBeNull());
  });
});

describe('Controller: focusFirst() on a container ref', () => {
  it('RadioGroup and CheckboxGroup: a failed rule focuses the first input', async () => {
    const { submit } = renderRhf<{ pick: string | null }>(
      (f) => (
        <Controller
          control={f.control}
          name="pick"
          rules={{ required: 'Pick one' }}
          render={({ field, fieldState }) => (
            <RadioGroup
              label="Pick"
              options={choices}
              ref={focusFirst(field.ref)}
              value={field.value}
              onValueChange={field.onChange}
              errorMessage={fieldState.error?.message}
            />
          )}
        />
      ),
      { defaultValues: { pick: null } },
    );
    await submit();
    expect(await screen.findByText('Pick one')).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByLabelText('Alpha'));
  });
});

describe('Controller: blur marks the field touched', () => {
  const cases: [string, ReactNode, () => HTMLElement][] = [];
  it.each([
    [
      'RadioGroup',
      (f: Field) => <RadioGroup label="x" options={choices} {...f} />,
      () => screen.getByLabelText('Alpha'),
    ],
    [
      'CheckboxGroup',
      (f: Field) => <CheckboxGroup label="x" options={choices} {...f} />,
      () => screen.getByLabelText('Alpha'),
    ],
    ['Slider', (f: Field) => <Slider label="x" {...f} />, () => screen.getByRole('slider')],
    [
      'PinInput',
      (f: Field) => <PinInput label="x" length={2} {...f} />,
      () => screen.getAllByRole('textbox')[0]!,
    ],
    [
      'NumberInput',
      (f: Field) => <NumberInput label="x" {...f} />,
      () => screen.getByRole('textbox'),
    ],
    [
      'FileInput',
      (f: Field) => <FileInput label="x" value={null} onValueChange={() => {}} {...f} />,
      () => document.querySelector('input[type=file]') as HTMLElement,
    ],
  ])('%s', async (_name, renderField, target) => {
    const { form } = renderRhf<{ v: unknown }>((f) => {
      void f.formState.touchedFields;
      return (
        <Controller
          control={f.control}
          name="v"
          render={({ field }) =>
            renderField({
              name: field.name,
              ref: field.ref,
              onBlur: field.onBlur,
            } as Field) as never
          }
        />
      );
    });
    void cases;
    act(() => target().focus());
    expect(form().formState.touchedFields.v).toBeUndefined();
    act(() => target().blur());
    expect(form().formState.touchedFields.v).toBe(true);
  });
});

describe('Zod through zodResolver (guide: register)', () => {
  it('shows each issue as errorMessage, announces it and focuses the first invalid field', async () => {
    const onSave = vi.fn();
    render(<ProfileForm onSave={onSave} />);
    await userEvent.type(screen.getByLabelText('Name'), 'A');
    await userEvent.type(screen.getByLabelText('Bio'), 'x'.repeat(21));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    const nameError = await screen.findByText('Enter at least 2 characters');
    const name = screen.getByLabelText('Name');
    expect(name.getAttribute('aria-invalid')).toBe('true');
    expect(name.getAttribute('aria-describedby')).toContain(nameError.id);
    const bioError = screen.getByText('Keep it under 20 characters');
    expect(screen.getByLabelText('Bio').getAttribute('aria-describedby')).toContain(bioError.id);
    expect(document.activeElement).toBe(name);

    const terms = screen.getByRole('checkbox') as HTMLInputElement;
    const termsError = screen.getByText('You must accept the terms');
    expect(termsError.getAttribute('role')).toBe('alert');
    expect(terms.getAttribute('aria-describedby')).toBe(termsError.id);
    expect(terms.closest('label')!.hasAttribute('data-invalid')).toBe(true);
    expect(onSave).not.toHaveBeenCalled();
  });

  it('clears the errors as the values become valid and submits the parsed values', async () => {
    const onSave = vi.fn();
    render(<ProfileForm onSave={onSave} />);
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await screen.findByText('Enter at least 2 characters');
    await userEvent.type(screen.getByLabelText('Name'), 'Ada');
    await userEvent.click(screen.getByRole('checkbox'));
    await userEvent.click(screen.getByRole('switch'));
    await waitFor(() => expect(screen.queryByText('Enter at least 2 characters')).toBeNull());
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(onSave).toHaveBeenCalled());
    expect(onSave.mock.calls[0]![0]).toEqual({
      name: 'Ada',
      bio: '',
      newsletter: true,
      terms: true,
    });
    expect(screen.queryByText('You must accept the terms')).toBeNull();
  });
});

describe('Zod through zodResolver (guide: controller)', () => {
  it('maps Controller field state to errorMessage', async () => {
    const onOrder = vi.fn();
    render(<OrderForm onOrder={onOrder} />);
    const quantity = screen.getByRole('textbox');
    await userEvent.clear(quantity);
    await userEvent.click(screen.getByRole('button', { name: 'Order' }));
    expect(await screen.findByText('Choose a size')).toBeTruthy();
    expect(screen.getByText('Enter a quantity')).toBeTruthy();
    expect(onOrder).not.toHaveBeenCalled();
    // The first invalid field takes focus through the `ref` the Controller gave it.
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /Size/ }));

    await userEvent.type(quantity, '2');
    await userEvent.click(screen.getByRole('button', { name: /Size/ }));
    await userEvent.click(await screen.findByRole('option', { name: 'Medium' }));
    await waitFor(() => expect(screen.queryByText('Choose a size')).toBeNull());
    await userEvent.click(screen.getByRole('button', { name: 'Order' }));
    await waitFor(() => expect(onOrder).toHaveBeenCalled());
    expect(onOrder.mock.calls[0]![0]).toEqual({ size: 'm', quantity: 2 });
  });
});

describe('<Form>: native constraint validation (guide: native-form)', () => {
  it('blocks submit, focuses the first invalid control and shows the browser message', async () => {
    const onSubscribe = vi.fn();
    render(<NewsletterForm onSubscribe={onSubscribe} />);
    await userEvent.click(screen.getByRole('button', { name: 'Subscribe' }));
    expect(onSubscribe).not.toHaveBeenCalled();
    const email = screen.getByLabelText('Email');
    expect(document.activeElement).toBe(email);
    expect(email.getAttribute('aria-invalid')).toBe('true');
    expect(email.getAttribute('aria-describedby')).toContain(
      screen.getByText('We never share it.').id,
    );
  });

  it('submits FormData once the form is valid', async () => {
    const onSubscribe = vi.fn();
    render(<NewsletterForm onSubscribe={onSubscribe} />);
    await userEvent.type(screen.getByLabelText('Email'), 'ada@example.com');
    await userEvent.click(screen.getByRole('checkbox'));
    await userEvent.click(screen.getByRole('button', { name: 'Subscribe' }));
    await waitFor(() => expect(onSubscribe).toHaveBeenCalled());
    const data = onSubscribe.mock.calls[0]![0] as FormData;
    expect(data.get('email')).toBe('ada@example.com');
    expect(data.get('terms')).not.toBeNull();
  });

  it('wires native inputs through Field (guide: native-field)', async () => {
    const onSave = vi.fn();
    render(<UsernameForm onSave={onSave} />);
    const input = screen.getByLabelText('Username');
    await userEvent.type(input, 'NOT OK');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSave).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(input);
    await userEvent.clear(input);
    await userEvent.type(input, 'ada1');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(onSave).toHaveBeenCalled());
    expect((onSave.mock.calls[0]![0] as FormData).get('username')).toBe('ada1');
  });
});

describe('<Form>: server errors and async submit (guide: server-errors)', () => {
  it('shows the server error on the field, focuses it and clears it on edit', async () => {
    let resolve: (value: { errors?: Record<string, string> }) => void = () => {};
    const signUp = vi.fn(
      () => new Promise<{ errors?: Record<string, string> }>((r) => (resolve = r)),
    );
    render(<SignUpForm signUp={signUp} />);
    const email = screen.getByLabelText('Email');
    await userEvent.type(email, 'taken@example.com');
    const button = screen.getByRole('button', { name: 'Create account' });
    await userEvent.click(button);

    // Pending: the button reports it and ignores presses.
    await waitFor(() => expect(button.hasAttribute('data-pending')).toBe(true));
    await userEvent.click(button);
    expect(signUp).toHaveBeenCalledTimes(1);

    await act(async () => resolve({ errors: { email: 'Already registered' } }));
    const message = await screen.findByText('Already registered');
    expect(email.getAttribute('aria-invalid')).toBe('true');
    expect(email.getAttribute('aria-describedby')).toContain(message.id);
    expect(button.hasAttribute('data-pending')).toBe(false);

    // A truthy `errors` entry blocks the next submit and focuses the field...
    (document.activeElement as HTMLElement).blur();
    await userEvent.click(button);
    expect(signUp).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(email);

    // ...until the app clears it, here on change.
    await userEvent.type(email, '2');
    await waitFor(() => expect(screen.queryByText('Already registered')).toBeNull());
    await userEvent.click(button);
    expect(signUp).toHaveBeenCalledTimes(2);
    await act(async () => resolve({}));
  });

  it('routes a rejected submit to onError', async () => {
    const signUp = vi.fn(() => Promise.reject(new Error('offline')));
    render(<SignUpForm signUp={signUp} />);
    await userEvent.type(screen.getByLabelText('Email'), 'a@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }));
    expect((await screen.findByRole('alert')).textContent).toBe('Something went wrong. Try again.');
  });
});

describe('react-hook-form inside <Form> (guide: rhf-server)', () => {
  it('runs RHF validation, then maps a server error with setError()', async () => {
    const invite = vi.fn(async () => ({ email: 'No such domain' }));
    render(<InviteForm invite={invite} />);
    const button = screen.getByRole('button', { name: 'Invite' });
    await userEvent.click(button);
    expect(await screen.findByText('Enter an email')).toBeTruthy();
    expect(invite).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(screen.getByLabelText('Email'));

    await userEvent.type(screen.getByLabelText('Email'), 'a@nowhere.test');
    await userEvent.click(button);
    const message = await screen.findByText('No such domain');
    expect(invite).toHaveBeenCalledWith({ email: 'a@nowhere.test' });
    expect(screen.getByLabelText('Email').getAttribute('aria-describedby')).toContain(message.id);
    expect(button.hasAttribute('data-pending')).toBe(false);
  });
});
