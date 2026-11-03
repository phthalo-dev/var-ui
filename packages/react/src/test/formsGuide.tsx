/**
 * The examples of the forms guide (`docs/content/docs/forms.mdx`). Every `#region guide:<id>`
 * block is copied verbatim into a fenced code block of the guide, and `forms.guide.test.ts`
 * fails when the two drift apart. The behaviour of each example is covered by
 * `forms.integration.test.tsx` / `forms.integration.browser.test.tsx`.
 *
 * Imports come from the component modules here and from `@var-ui/react` in the guide.
 */
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, type Control, type RefCallBack } from 'react-hook-form';
import type { CalendarDate } from '@internationalized/date';
import { z } from 'zod';
import { Button } from '../components/Button';
import { Checkbox } from '../components/Checkbox';
import { DateInput } from '../components/DateInput';
import { Field } from '../components/Field';
import { Form } from '../components/Form';
import { NumberInput } from '../components/NumberInput';
import { Select } from '../components/Select';
import { Switch } from '../components/Switch';
import { TextAreaField } from '../components/TextAreaField';
import { TextField } from '../components/TextField';

// #region guide:native-form
function NewsletterForm({ onSubscribe }: { onSubscribe: (data: FormData) => void }) {
  return (
    <Form onSubmit={(_event, data) => onSubscribe(data)}>
      <TextField
        name="email"
        type="email"
        label="Email"
        description="We never share it."
        required
      />
      <Checkbox name="terms" required>
        I accept the terms
      </Checkbox>
      <Button type="submit">Subscribe</Button>
    </Form>
  );
}
// #endregion guide:native-form

// #region guide:native-field
function UsernameForm({ onSave }: { onSave: (data: FormData) => void }) {
  return (
    <Form onSubmit={(_event, data) => onSave(data)}>
      <Field name="username" label="Username" description="Letters and digits only.">
        <input name="username" pattern="[a-z0-9]+" required />
      </Field>
      <Button type="submit">Save</Button>
    </Form>
  );
}
// #endregion guide:native-field

// #region guide:server-errors
type SignUpResult = { errors?: Record<string, string> };

function SignUpForm({ signUp }: { signUp: (data: FormData) => Promise<SignUpResult> }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  async function onSubmit(_event: unknown, data: FormData) {
    setPending(true);
    try {
      const result = await signUp(data);
      setErrors(result.errors ?? {});
    } finally {
      setPending(false);
    }
  }

  return (
    <Form
      errors={errors}
      onSubmit={onSubmit}
      onError={() => setErrors({ form: 'Something went wrong. Try again.' })}
    >
      <TextField
        name="email"
        type="email"
        label="Email"
        required
        errorMessage={errors.email}
        onChange={() => setErrors(({ email: _cleared, ...rest }) => rest)}
      />
      {errors.form ? <p role="alert">{errors.form}</p> : null}
      <Button type="submit" loading={pending}>
        Create account
      </Button>
    </Form>
  );
}
// #endregion guide:server-errors

// #region guide:register
const profileSchema = z.object({
  name: z.string().min(2, 'Enter at least 2 characters'),
  bio: z.string().max(20, 'Keep it under 20 characters'),
  newsletter: z.boolean(),
  terms: z.boolean().refine((accepted) => accepted, 'You must accept the terms'),
});
type ProfileValues = z.infer<typeof profileSchema>;

function ProfileForm({ onSave }: { onSave: (values: ProfileValues) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', bio: '', newsletter: false, terms: false },
  });

  return (
    <form noValidate onSubmit={handleSubmit(onSave)}>
      <TextField label="Name" {...register('name')} errorMessage={errors.name?.message} />
      <TextAreaField label="Bio" {...register('bio')} errorMessage={errors.bio?.message} />
      <Switch {...register('newsletter')}>Send me the newsletter</Switch>
      <Checkbox
        {...register('terms')}
        invalid={Boolean(errors.terms)}
        aria-describedby={errors.terms ? 'terms-error' : undefined}
      >
        I accept the terms
      </Checkbox>
      {errors.terms ? (
        <p id="terms-error" role="alert">
          {errors.terms.message}
        </p>
      ) : null}
      <Button type="submit">Save</Button>
    </form>
  );
}
// #endregion guide:register

// #region guide:controller
const orderSchema = z.object({
  size: z.string().min(1, 'Choose a size'),
  quantity: z.number({ error: 'Enter a quantity' }).min(1, 'Order at least one'),
});
type OrderValues = z.infer<typeof orderSchema>;

function OrderForm({ onOrder }: { onOrder: (values: OrderValues) => void }) {
  const { control, handleSubmit } = useForm<OrderValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: { size: '', quantity: 1 },
  });

  return (
    <form noValidate onSubmit={handleSubmit(onOrder)}>
      <Controller
        control={control}
        name="size"
        render={({ field, fieldState }) => (
          <Select
            label="Size"
            options={[
              { value: 's', label: 'Small' },
              { value: 'm', label: 'Medium' },
              { value: 'l', label: 'Large' },
            ]}
            name={field.name}
            ref={field.ref}
            value={field.value || null}
            onValueChange={(value) => field.onChange(value ?? '')}
            onBlur={field.onBlur}
            errorMessage={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="quantity"
        render={({ field, fieldState }) => (
          <NumberInput
            label="Quantity"
            min={0}
            name={field.name}
            ref={field.ref}
            value={field.value}
            onValueChange={field.onChange}
            onBlur={field.onBlur}
            errorMessage={fieldState.error?.message}
          />
        )}
      />
      <Button type="submit">Order</Button>
    </form>
  );
}
// #endregion guide:controller

// #region guide:rhf-server
type InviteValues = { email: string };

function InviteForm({ invite }: { invite: (values: InviteValues) => Promise<{ email?: string }> }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InviteValues>({ defaultValues: { email: '' } });

  return (
    <Form
      onSubmit={handleSubmit(async (values) => {
        const result = await invite(values);
        if (result.email) setError('email', { type: 'server', message: result.email });
      })}
    >
      <TextField
        type="email"
        label="Email"
        {...register('email', { required: 'Enter an email' })}
        errorMessage={errors.email?.message}
      />
      <Button type="submit" loading={isSubmitting}>
        Invite
      </Button>
    </Form>
  );
}
// #endregion guide:rhf-server

// #region guide:focus-first
/**
 * `field.ref` for controls whose `ref` is a container (date fields, groups): when validation
 * fails, react-hook-form focuses the first control inside it.
 */
function focusFirst(ref: RefCallBack) {
  return (element: HTMLElement | null) =>
    ref(
      element && {
        focus: () =>
          element
            .querySelector<HTMLElement>('input:not([type="hidden"]), button, [role="spinbutton"]')
            ?.focus(),
      },
    );
}
// #endregion guide:focus-first

// #region guide:date-field
function BirthdayField({ control }: { control: Control<{ birthday: CalendarDate | null }> }) {
  return (
    <Controller
      control={control}
      name="birthday"
      rules={{ required: 'Enter your birthday' }}
      render={({ field, fieldState }) => (
        <DateInput
          label="Birthday"
          ref={focusFirst(field.ref)}
          value={field.value}
          onValueChange={field.onChange}
          onBlur={field.onBlur}
          errorMessage={fieldState.error?.message}
        />
      )}
    />
  );
}
// #endregion guide:date-field

export {
  BirthdayField,
  focusFirst,
  InviteForm,
  NewsletterForm,
  OrderForm,
  ProfileForm,
  SignUpForm,
  UsernameForm,
  orderSchema,
  profileSchema,
};
export type { InviteValues, OrderValues, ProfileValues, SignUpResult };
