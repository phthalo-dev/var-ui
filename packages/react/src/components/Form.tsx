import { createContext, type FormEvent, type FormHTMLAttributes, type JSX, type Ref } from 'react';

export type FormProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> & {
  /**
   * Called with the event and `FormData` once the form is valid. If it returns
   * a promise that rejects, the rejection goes to `onError`, or is reported
   * globally (`reportError`) when `onError` is not provided.
   */
  onSubmit?: (event: FormEvent<HTMLFormElement>, data: FormData) => void | Promise<void>;
  /** Receives the rejection of an async `onSubmit`. Defaults to `reportError`. */
  onError?: (error: unknown) => void;
  errors?: Record<string, string | undefined>;
  /** Ref to the underlying `<form>` element. */
  ref?: Ref<HTMLFormElement>;
};

export const FormErrorsContext = createContext<Record<string, string | undefined>>({});

const NO_ERRORS: Record<string, string | undefined> = {};

function reportRejection(error: unknown) {
  if (typeof reportError === 'function') reportError(error);
  else
    setTimeout(() => {
      throw error;
    });
}

export function Form({
  onSubmit,
  onError,
  errors = NO_ERRORS,
  children,
  ref,
  ...props
}: FormProps): JSX.Element {
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
    Promise.resolve(onSubmit?.(event, new FormData(form))).catch(onError ?? reportRejection);
  }

  return (
    <FormErrorsContext.Provider value={errors}>
      <form {...props} ref={ref} noValidate onSubmit={onSubmitInternal}>
        {children}
      </form>
    </FormErrorsContext.Provider>
  );
}
