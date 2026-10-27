import { createContext, type FormEvent, type FormHTMLAttributes, type JSX, type Ref } from 'react';

export type FormProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> & {
  onSubmit?: (event: FormEvent<HTMLFormElement>, data: FormData) => void | Promise<void>;
  errors?: Record<string, string | undefined>;
  /** Ref to the underlying `<form>` element. */
  ref?: Ref<HTMLFormElement>;
};

export const FormErrorsContext = createContext<Record<string, string | undefined>>({});

export function Form({ onSubmit, errors = {}, children, ref, ...props }: FormProps): JSX.Element {
  function onSubmitInternal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const valid = form.checkValidity();
    if (!valid) {
      const first =
        form.querySelector<HTMLElement>('[aria-invalid="true"]') ??
        form.querySelector<HTMLElement>(':invalid');
      first?.focus();
      return;
    }
    const firstErrorName = Object.keys(errors).find((name) => errors[name]);
    if (firstErrorName) {
      const item = form.elements.namedItem(firstErrorName);
      const control = item instanceof RadioNodeList ? item[0] : item;
      if (control instanceof HTMLElement) control.focus();
      return;
    }
    void onSubmit?.(event, new FormData(form));
  }

  return (
    <FormErrorsContext.Provider value={errors}>
      <form {...props} ref={ref} noValidate onSubmit={onSubmitInternal}>
        {children}
      </form>
    </FormErrorsContext.Provider>
  );
}
