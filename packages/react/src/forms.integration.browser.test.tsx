/**
 * react-hook-form `Controller` on the composite controls that need a real browser (native
 * popovers, segmented date fields, roving focus). The jsdom half is `forms.integration.test.tsx`.
 */
import { CalendarDate, Time } from '@internationalized/date';
import { render } from '@testing-library/react';
import { StrictMode, type ReactNode } from 'react';
import { userEvent } from 'vite-plus/test/browser';
import { beforeAll, describe, expect, test, vi } from 'vite-plus/test';
import {
  Controller,
  useForm,
  type FieldValues,
  type UseFormProps,
  type UseFormReturn,
} from 'react-hook-form';
import '../../core/src/theme/base-styles';
import '../../core/src/theme/register-default';
import { DesignSystemProvider } from './DesignSystemProvider';
import { IconProvider } from './icons';
import { finishAll, raf } from './test/browser';
import { ColorInput } from './components/ColorInput';
import { Combobox } from './components/Combobox';
import { DateInput } from './components/DateInput';
import { MultiSelector } from './components/MultiSelector';
import { Rating } from './components/Rating';
import { SegmentedControl } from './components/SegmentedControl';
import { Select } from './components/Select';
import { TimeInput } from './components/TimeInput';
import { ToggleGroup } from './components/ToggleGroup';
import { Tokenizer } from './components/Tokenizer';
import { BirthdayField, NewsletterForm, UsernameForm, focusFirst } from './test/formsGuide';

beforeAll(() => {
  const style = document.createElement('style');
  style.textContent = `:root, :root[class] { --var-ui-duration-slow: 150ms; }`;
  document.head.append(style);
});

type Api<T extends FieldValues> = { current: UseFormReturn<T> };

/** One `Controller` field in a real `<form>`; returns the form API and the submitted values. */
function renderField<T extends FieldValues>(
  renderControl: (props: { field: any; error: string | undefined }) => ReactNode,
  options: UseFormProps<T>,
  validate?: (value: unknown) => true | string,
) {
  const onValid = vi.fn();
  const api: Api<T> = { current: undefined as never };
  function Harness() {
    const form = useForm<T>(options);
    api.current = form;
    void form.formState.touchedFields;
    void form.formState.errors;
    void form.formState.isDirty;
    const name = Object.keys(options.defaultValues ?? {})[0] as never;
    return (
      <form onSubmit={form.handleSubmit(onValid)}>
        <Controller
          control={form.control}
          name={name}
          rules={validate ? { validate } : undefined}
          render={({ field, fieldState }) => (
            <>{renderControl({ field, error: fieldState.error?.message })}</>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    );
  }
  const utils = render(
    <StrictMode>
      <DesignSystemProvider applyToDocument>
        <IconProvider icons={{}}>
          <Harness />
        </IconProvider>
      </DesignSystemProvider>
    </StrictMode>,
  );
  const submit = async () => {
    await userEvent.click(utils.getByRole('button', { name: 'Submit' }));
    await raf();
    await vi.waitFor(() => expect(api.current.formState.isSubmitting).toBe(false));
  };
  return { ...utils, form: () => api.current, onValid, submit };
}

const FRUIT = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

const option = (label: string) =>
  [...document.querySelectorAll<HTMLElement>('[role="option"]')].find((o) =>
    o.textContent?.includes(label),
  )!;
const popup = () => document.querySelector<HTMLElement>('[popover]');
async function closed() {
  await raf();
  const p = popup();
  if (p) await finishAll(p);
  await raf();
}
const required = (value: unknown) =>
  (Array.isArray(value) ? value.length > 0 : Boolean(value)) || 'Required';

describe('Controller: Select', () => {
  const control = ({ field, error }: { field: any; error: string | undefined }) => (
    <Select
      label="Fruit"
      options={FRUIT}
      name={field.name}
      ref={field.ref}
      value={field.value || null}
      onValueChange={(value) => field.onChange(value ?? '')}
      onBlur={field.onBlur}
      errorMessage={error}
    />
  );
  const trigger = () => document.querySelector<HTMLElement>('button[aria-haspopup="listbox"]')!;

  test('submits the picked value; setValue() and reset() update the trigger', async () => {
    const { form, submit, onValid } = renderField<{ fruit: string }>(control, {
      defaultValues: { fruit: 'banana' },
    });
    expect(trigger().textContent).toContain('Banana');
    await userEvent.click(trigger());
    await raf();
    await userEvent.click(option('Cherry'));
    await closed();
    await submit();
    expect(onValid.mock.calls[0]![0]).toEqual({ fruit: 'cherry' });
    form().setValue('fruit', 'apple');
    await vi.waitFor(() => expect(trigger().textContent).toContain('Apple'));
    form().reset();
    await vi.waitFor(() => expect(trigger().textContent).toContain('Banana'));
  });

  test('onBlur marks it touched, a failed rule shows errorMessage and focuses the trigger', async () => {
    const { form, submit, onValid } = renderField<{ fruit: string }>(
      control,
      { defaultValues: { fruit: '' } },
      required,
    );
    trigger().focus();
    await userEvent.tab();
    expect(form().formState.touchedFields.fruit).toBe(true);
    await submit();
    expect(onValid).not.toHaveBeenCalled();
    expect(document.body.textContent).toContain('Required');
    expect(trigger().getAttribute('aria-describedby')).toBeTruthy();
    // `field.ref` is the trigger button, so RHF can focus it.
    expect(document.activeElement).toBe(trigger());
  });
});

describe('Controller: MultiSelector', () => {
  test('submits string[]; setValue() and reset() update the summary', async () => {
    const { form, submit, onValid } = renderField<{ fruit: string[] }>(
      ({ field, error }) => (
        <MultiSelector
          label="Fruit"
          options={FRUIT}
          name={field.name}
          ref={field.ref}
          value={field.value}
          onValueChange={field.onChange}
          onBlur={field.onBlur}
          errorMessage={error}
        />
      ),
      { defaultValues: { fruit: ['apple'] } },
      required,
    );
    const trigger = () => document.querySelector<HTMLElement>('button')!;
    expect(trigger().textContent).toContain('Apple');
    await userEvent.click(trigger());
    await raf();
    await userEvent.click(option('Cherry'));
    await userEvent.click(trigger());
    await closed();
    await submit();
    expect(onValid.mock.calls[0]![0]).toEqual({ fruit: ['apple', 'cherry'] });
    form().setValue('fruit', []);
    await vi.waitFor(() => expect(trigger().textContent).not.toContain('Apple'));
    await submit();
    expect(document.body.textContent).toContain('Required');
    expect(document.activeElement).toBe(trigger());
    form().reset();
    await vi.waitFor(() => expect(trigger().textContent).toContain('Apple'));
    // onBlur reaches the trigger.
    trigger().focus();
    trigger().blur();
    expect(form().formState.touchedFields.fruit).toBe(true);
  });
});

describe('Controller: Tokenizer', () => {
  test('submits string[]; removing a token and reset() update the chips', async () => {
    const { form, submit, onValid, getByRole } = renderField<{ fruit: string[] }>(
      ({ field, error }) => (
        <Tokenizer
          label="Fruit"
          options={FRUIT}
          name={field.name}
          ref={field.ref}
          value={field.value}
          onValueChange={field.onChange}
          onBlur={field.onBlur}
          errorMessage={error}
        />
      ),
      { defaultValues: { fruit: ['apple'] } },
      required,
    );
    const input = () => getByRole('combobox');
    await userEvent.click(input());
    await userEvent.keyboard('Ban');
    await raf();
    await userEvent.click(option('Banana'));
    await closed();
    await submit();
    expect(onValid.mock.calls[0]![0]).toEqual({ fruit: ['apple', 'banana'] });
    await userEvent.click(getByRole('button', { name: /Remove Apple/ }));
    await userEvent.click(getByRole('button', { name: /Remove Banana/ }));
    await submit();
    expect(document.body.textContent).toContain('Required');
    // `field.ref` is the search input.
    expect(document.activeElement).toBe(input());
    form().reset();
    await vi.waitFor(() => expect(document.body.textContent).toContain('Apple'));
    input().focus();
    input().blur();
    expect(form().formState.touchedFields.fruit).toBe(true);
  });
});

describe('Controller: Combobox', () => {
  test('submits the picked value; reset() restores it; the Input part takes field.ref', async () => {
    const { form, submit, onValid, getByRole } = renderField<{ fruit: string | null }>(
      ({ field, error }) => (
        <Combobox.Root
          aria-label="Fruit"
          name={field.name}
          value={field.value}
          onValueChange={field.onChange}
          onBlur={field.onBlur}
          invalid={Boolean(error)}
        >
          <Combobox.Input ref={field.ref} placeholder="Search…" />
          <Combobox.Popover>
            <Combobox.ListBox items={FRUIT}>
              {(item) => <Combobox.Item value={item.value}>{item.label}</Combobox.Item>}
            </Combobox.ListBox>
          </Combobox.Popover>
          <Combobox.Error>{error}</Combobox.Error>
        </Combobox.Root>
      ),
      { defaultValues: { fruit: 'apple' as string | null } },
      required,
    );
    const input = () => getByRole('combobox') as HTMLInputElement;
    expect(input().value).toBe('Apple');
    await userEvent.fill(input(), 'Che');
    await raf();
    await userEvent.click(option('Cherry'));
    await closed();
    await submit();
    expect(onValid.mock.calls[0]![0]).toEqual({ fruit: 'cherry' });
    form().setValue('fruit', 'banana');
    await vi.waitFor(() => expect(input().value).toBe('Banana'));
    form().reset();
    await vi.waitFor(() => expect(input().value).toBe('Apple'));
    input().focus();
    input().blur();
    expect(form().formState.touchedFields.fruit).toBe(true);
  });
});

describe('Controller: DateInput and TimeInput', () => {
  test('DateInput: submits a CalendarDate; setValue() and reset() update the segments', async () => {
    const { form, submit, onValid } = renderField<{ day: CalendarDate | null }>(
      ({ field, error }) => (
        <DateInput
          label="Day"
          name={field.name}
          value={field.value}
          onValueChange={field.onChange}
          onBlur={field.onBlur}
          errorMessage={error}
        />
      ),
      { defaultValues: { day: new CalendarDate(2026, 7, 15) as CalendarDate | null } },
      required,
    );
    const segment = (name: RegExp) =>
      document.querySelector<HTMLElement>(`[role="spinbutton"][aria-label*="${name.source}"]`)!;
    expect(segment(/day/).textContent).toBe('15');
    await submit();
    expect(onValid.mock.calls[0]![0].day.toString()).toBe('2026-07-15');
    form().setValue('day', new CalendarDate(2026, 8, 3));
    await vi.waitFor(() => expect(segment(/day/).textContent).toBe('3'));
    form().reset();
    await vi.waitFor(() => expect(segment(/day/).textContent).toBe('15'));
    // Typing into a segment reaches the form state; blur marks it touched.
    segment(/day/).focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(form().getValues('day')!.toString()).toBe('2026-07-16');
    await userEvent.tab({ shift: true });
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    expect(form().formState.touchedFields.day).toBe(true);
  });

  test('TimeInput: submits a Time; a segment edit reaches the form state', async () => {
    const { form, submit, onValid } = renderField<{ at: Time | null }>(
      ({ field, error }) => (
        <TimeInput
          label="At"
          name={field.name}
          value={field.value}
          onValueChange={field.onChange}
          onBlur={field.onBlur}
          errorMessage={error}
        />
      ),
      { defaultValues: { at: new Time(9, 30) as Time | null } },
    );
    const hour = () =>
      document.querySelector<HTMLElement>('[role="spinbutton"][aria-label*="hour"]')!;
    expect(hour().textContent).toBe('9');
    await submit();
    expect(onValid.mock.calls[0]![0].at.toString()).toBe('09:30:00');
    form().setValue('at', new Time(14, 5));
    await vi.waitFor(() => expect(hour().textContent).toBe('2'));
    hour().focus();
    await userEvent.keyboard('{ArrowUp}');
    await vi.waitFor(() => expect(form().getValues('at')!.toString()).toBe('15:05:00'));
  });
});

describe('Controller: ColorInput', () => {
  test('submits the hex; the typed value and reset() reach the field', async () => {
    const { form, submit, onValid, getByRole } = renderField<{ brand: string }>(
      ({ field, error }) => (
        <ColorInput
          label="Brand"
          name={field.name}
          ref={field.ref}
          value={field.value}
          onValueChange={field.onChange}
          onBlur={field.onBlur}
          errorMessage={error}
        />
      ),
      { defaultValues: { brand: '#ff0000' } },
    );
    const hex = () => getByRole('textbox') as HTMLInputElement;
    expect(hex().value.toLowerCase()).toBe('#ff0000');
    await userEvent.fill(hex(), '#00ff00');
    await userEvent.tab();
    await submit();
    expect(String(onValid.mock.calls[0]![0].brand).toLowerCase()).toBe('#00ff00');
    expect(form().formState.touchedFields.brand).toBe(true);
    form().reset();
    await vi.waitFor(() => expect(hex().value.toLowerCase()).toBe('#ff0000'));
  });
});

describe('Controller: Rating', () => {
  const rating = ({ field, error }: { field: any; error?: string }) => (
    <Rating
      label="Quality"
      name={field.name}
      ref={field.ref}
      value={field.value}
      onValueChange={field.onChange}
      onBlur={field.onBlur}
      errorMessage={error}
      clearable
    />
  );
  const radios = () => [...document.querySelectorAll<HTMLInputElement>('input[type=radio]')];

  test('submits the number; setValue(), clearing and reset() update the stars', async () => {
    const { form, submit, onValid } = renderField<{ stars: number }>(rating, {
      defaultValues: { stars: 2 },
    });
    expect(radios()[1]!.checked).toBe(true);
    await userEvent.click(radios()[3]!);
    await submit();
    expect(onValid.mock.calls[0]![0]).toEqual({ stars: 4 });
    form().setValue('stars', 1);
    await vi.waitFor(() => expect(radios()[0]!.checked).toBe(true));
    await userEvent.click(radios()[0]!);
    await vi.waitFor(() => expect(form().getValues('stars')).toBe(0));
    form().reset();
    await vi.waitFor(() => expect(radios()[1]!.checked).toBe(true));
  });

  test('a failed rule shows errorMessage; field.ref focuses a star; blur marks it touched', async () => {
    const { form, submit, onValid } = renderField<{ stars: number }>(
      rating,
      { defaultValues: { stars: 0 } },
      required,
    );
    await submit();
    expect(onValid).not.toHaveBeenCalled();
    expect(document.body.textContent).toContain('Required');
    expect(document.activeElement).toBe(radios()[0]);
    await userEvent.tab();
    expect(form().formState.touchedFields.stars).toBe(true);
  });
});

describe('Controller: ToggleGroup and SegmentedControl', () => {
  test('ToggleGroup (single): submits string | null', async () => {
    const { form, submit, onValid, getByRole } = renderField<{ align: string | null }>(
      ({ field }) => (
        <ToggleGroup
          aria-label="Align"
          ref={field.ref}
          value={field.value}
          onValueChange={field.onChange}
          onBlur={field.onBlur}
        >
          <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
          <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
        </ToggleGroup>
      ),
      { defaultValues: { align: 'left' as string | null } },
    );
    const pressed = (name: string) =>
      getByRole('button', { name }).getAttribute('aria-pressed') === 'true';
    expect(pressed('Left')).toBe(true);
    await userEvent.click(getByRole('button', { name: 'Right' }));
    await submit();
    expect(onValid.mock.calls[0]![0]).toEqual({ align: 'right' });
    form().setValue('align', null);
    await vi.waitFor(() => expect(pressed('Right')).toBe(false));
    form().reset();
    await vi.waitFor(() => expect(pressed('Left')).toBe(true));
    getByRole('button', { name: 'Left' }).focus();
    await userEvent.tab();
    await userEvent.tab();
    expect(form().formState.touchedFields.align).toBe(true);
  });

  test('ToggleGroup (multiple): submits string[]', async () => {
    const { submit, onValid, getByRole } = renderField<{ marks: string[] }>(
      ({ field }) => (
        <ToggleGroup aria-label="Marks" multiple value={field.value} onValueChange={field.onChange}>
          <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
          <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
        </ToggleGroup>
      ),
      { defaultValues: { marks: ['bold'] } },
    );
    await userEvent.click(getByRole('button', { name: 'Italic' }));
    await submit();
    expect(onValid.mock.calls[0]![0]).toEqual({ marks: ['bold', 'italic'] });
  });

  test('SegmentedControl: submits string; setValue() and reset() move the selection', async () => {
    const { form, submit, onValid, getByRole } = renderField<{ view: string | null }>(
      ({ field }) => (
        <SegmentedControl
          aria-label="View"
          options={[
            { value: 'list', label: 'List' },
            { value: 'grid', label: 'Grid' },
          ]}
          ref={field.ref}
          value={field.value}
          onValueChange={field.onChange}
          onBlur={field.onBlur}
        />
      ),
      { defaultValues: { view: 'list' as string | null } },
    );
    const selected = (name: string) =>
      getByRole('radio', { name }).getAttribute('aria-checked') === 'true';
    await userEvent.click(getByRole('radio', { name: 'Grid' }));
    await submit();
    expect(onValid.mock.calls[0]![0]).toEqual({ view: 'grid' });
    form().setValue('view', 'list');
    await vi.waitFor(() => expect(selected('List')).toBe(true));
    form().reset({ view: 'grid' });
    await vi.waitFor(() => expect(selected('Grid')).toBe(true));
  });
});

describe('field.ref on controls whose ref is a container', () => {
  test('DateInput: the raw ref cannot be focused, focusFirst() reaches the first segment', async () => {
    for (const wrap of [false, true]) {
      const { form, submit, unmount } = renderField<{ day: CalendarDate | null }>(
        ({ field, error }) => (
          <DateInput
            label="Day"
            ref={wrap ? focusFirst(field.ref) : field.ref}
            value={field.value}
            onValueChange={field.onChange}
            errorMessage={error}
          />
        ),
        { defaultValues: { day: null as CalendarDate | null } },
        required,
      );
      await submit();
      expect(form().formState.errors.day?.message).toBe('Required');
      const segment = document.querySelector('[role="spinbutton"]');
      expect(document.activeElement === segment).toBe(wrap);
      unmount();
    }
  });

  test('SegmentedControl and ToggleGroup: focusFirst() focuses a button', async () => {
    const { submit } = renderField<{ view: string | null }>(
      ({ field, error }) => (
        <>
          <SegmentedControl
            aria-label="View"
            options={[
              { value: 'list', label: 'List' },
              { value: 'grid', label: 'Grid' },
            ]}
            ref={focusFirst(field.ref)}
            value={field.value}
            onValueChange={field.onChange}
          />
          <span>{error}</span>
        </>
      ),
      { defaultValues: { view: null as string | null } },
      required,
    );
    await submit();
    expect(document.activeElement?.textContent).toBe('List');
  });
});

describe('<Form>: the browser validation message reaches the field', () => {
  const wrap = (node: ReactNode) =>
    render(
      <StrictMode>
        <DesignSystemProvider applyToDocument>
          <IconProvider icons={{}}>{node}</IconProvider>
        </DesignSystemProvider>
      </StrictMode>,
    );

  test('TextField: shows validationMessage, describes the input with it and focuses it', async () => {
    const onSubscribe = vi.fn();
    const { getByRole, getByLabelText } = wrap(<NewsletterForm onSubscribe={onSubscribe} />);
    await userEvent.click(getByRole('button', { name: 'Subscribe' }));
    const email = getByLabelText('Email') as HTMLInputElement;
    await vi.waitFor(() => expect(document.activeElement).toBe(email));
    expect(onSubscribe).not.toHaveBeenCalled();
    expect(email.validationMessage).not.toBe('');
    const message = () =>
      document.getElementById(email.getAttribute('aria-describedby')!.split(' ').pop()!);
    await vi.waitFor(() => expect(message()?.textContent).toBe(email.validationMessage));
    expect(email.getAttribute('aria-invalid')).toBe('true');
  });

  test('Field: shows validationMessage for a plain input', async () => {
    const { getByRole, getByLabelText } = wrap(<UsernameForm onSave={vi.fn()} />);
    await userEvent.fill(getByLabelText('Username'), 'NOT OK');
    await userEvent.click(getByRole('button', { name: 'Save' }));
    const input = getByLabelText('Username') as HTMLInputElement;
    await vi.waitFor(() => expect(document.activeElement).toBe(input));
    expect(input.validationMessage).not.toBe('');
    const ids = input.getAttribute('aria-describedby')!.split(' ');
    expect(ids.map((id) => document.getElementById(id)?.textContent)).toContain(
      input.validationMessage,
    );
  });
});

describe('guide: date-field', () => {
  test('BirthdayField: a failed rule shows the message and focuses the first segment', async () => {
    const api: { current: UseFormReturn<{ birthday: CalendarDate | null }> } = {
      current: undefined as never,
    };
    function Harness() {
      const form = useForm<{ birthday: CalendarDate | null }>({
        defaultValues: { birthday: null },
      });
      api.current = form;
      return (
        <form onSubmit={form.handleSubmit(() => {})}>
          <BirthdayField control={form.control} />
          <button type="submit">Submit</button>
        </form>
      );
    }
    const { getByRole, findByText } = render(
      <StrictMode>
        <DesignSystemProvider applyToDocument>
          <IconProvider icons={{}}>
            <Harness />
          </IconProvider>
        </DesignSystemProvider>
      </StrictMode>,
    );
    await userEvent.click(getByRole('button', { name: 'Submit' }));
    expect(await findByText('Enter your birthday')).toBeTruthy();
    await vi.waitFor(() =>
      expect(document.activeElement).toBe(document.querySelector('[role="spinbutton"]')),
    );
  });
});
