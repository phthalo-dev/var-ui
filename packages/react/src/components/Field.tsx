import {
  Children,
  cloneElement,
  createContext,
  Fragment,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type JSX,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { field } from '@var-ui/core';
import { cx, mergeProps } from 'typestyles';
import { FormErrorsContext } from './Form';

export type FieldMeta = {
  /** Visible label rendered above the control. */
  label?: string;
  /** Helper text shown below the control when there is no error. */
  description?: string;
  /** Validation message; when set, the field is shown in an error state. */
  errorMessage?: string;
};

export type FieldProps = FieldMeta & {
  /** id of the wrapped control, wired to the label's `htmlFor`. */
  htmlFor?: string;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /** The input or custom control to wrap with field chrome. */
  children: ReactNode;
  /** Ref to the underlying root `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

export type FieldRootProps = {
  name?: string;
  children: ReactNode;
  className?: string;
  invalid?: boolean;
  onInvalidChange?: (invalid: boolean) => void;
  /** Ref to the underlying root `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

export type FieldLabelProps = {
  children: ReactNode;
  className?: string;
  /** Ref to the underlying `<label>` element. */
  ref?: Ref<HTMLLabelElement>;
};
export type FieldControlProps = { children: ReactElement; className?: string };
export type FieldDescriptionProps = {
  children: ReactNode;
  className?: string;
  /** Ref to the underlying `<p>` element. */
  ref?: Ref<HTMLParagraphElement>;
};
export type FieldErrorProps = {
  children?: ReactNode;
  className?: string;
  forceMount?: boolean;
  /** Ref to the underlying `<p>` element. */
  ref?: Ref<HTMLParagraphElement>;
};

type ControlReport = {
  dirty?: boolean;
  filled?: boolean;
  nativeInvalid?: boolean;
  nativeMessage?: string;
  touched?: boolean;
};

type ControlBaseline = { kind: 'check'; checked: boolean } | { kind: 'value'; value: string };

type FieldContextValue = {
  name?: string;
  controlId: string;
  descriptionId: string;
  errorId: string;
  invalid: boolean;
  nativeMessage: string;
  formError: string;
  setNativeInvalid: (invalid: boolean, message: string) => void;
  reportControl: (report: ControlReport) => void;
  describedBy: string | undefined;
  errorMessageId: string | undefined;
};

type ControlEvent = {
  currentTarget: EventTarget;
  type: string;
};

type ControlChildProps = {
  id?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
  defaultValue?: string | number | readonly string[];
  value?: string | number | readonly string[];
  defaultChecked?: boolean;
  checked?: boolean;
  type?: string;
  ref?: Ref<HTMLElement | null>;
  onBlur?: (event: ControlEvent) => void;
  onInput?: (event: ControlEvent) => void;
  onChange?: (event: ControlEvent) => void;
  onInvalid?: (event: ControlEvent) => void;
};

const FieldContext = createContext<FieldContextValue | null>(null);

function useFieldContext(): FieldContextValue {
  const ctx = useContext(FieldContext);
  if (!ctx) {
    throw new Error('Field compound components must be rendered inside <Field.Root>.');
  }
  return ctx;
}

function errorPartHasContent(props: FieldErrorProps, nativeMessage = ''): boolean {
  const { children } = props;
  return Boolean(
    !(children === undefined || children === null || children === false || children === '') ||
    nativeMessage,
  );
}

function errorPartMounts(props: FieldErrorProps, nativeMessage = ''): boolean {
  return Boolean(props.forceMount || errorPartHasContent(props, nativeMessage));
}

function isSingleHostElement(node: ReactNode): node is ReactElement {
  return isValidElement(node) && node.type !== Fragment;
}

function warnNestedFieldMeta(node: ReactNode): void {
  if (process.env.NODE_ENV === 'production') return;
  visitElements(node, (child) => {
    if (child.type === FieldLabel) return false;
    const label = (child.props as { label?: unknown }).label;
    if (label != null) {
      console.warn(
        'Field.Root: a child has a `label` prop. Use Field.Label around a control without FieldMeta, or use the control’s label without Field parts.',
      );
    }
    return false;
  });
}

function visitElements(node: ReactNode, visit: (element: ReactElement) => boolean): boolean {
  const list = Children.toArray(node);
  for (const child of list) {
    if (!isValidElement(child)) continue;
    if (visit(child)) return true;
    const nested = (child.props as { children?: ReactNode }).children;
    if (nested != null && visitElements(nested, visit)) return true;
  }
  return false;
}

function treeHasPart(
  node: ReactNode,
  type: typeof FieldDescription | typeof FieldError,
  nativeMessage = '',
): boolean {
  return visitElements(node, (child) => {
    if (child.type !== type) return false;
    return type === FieldError
      ? errorPartHasContent(child.props as FieldErrorProps, nativeMessage)
      : true;
  });
}

function isWalkedFilled(props: ControlChildProps): boolean {
  if (props.type === 'checkbox' || props.type === 'radio') {
    return Boolean(props.checked ?? props.defaultChecked);
  }
  const value = props.value ?? props.defaultValue;
  if (value == null) return false;
  if (typeof value === 'number') return true;
  if (typeof value === 'string') return value !== '';
  return value.length > 0;
}

function findControlChild(node: ReactNode): {
  id?: string;
  disabled: boolean;
  filled: boolean;
} {
  let found: { id?: string; disabled: boolean; filled: boolean } = {
    disabled: false,
    filled: false,
  };
  visitElements(node, (child) => {
    if (child.type !== FieldControl) return false;
    const controlChild = (child.props as FieldControlProps).children;
    if (!isValidElement(controlChild)) return false;
    const props = controlChild.props as ControlChildProps;
    found = {
      id: props.id,
      disabled: Boolean(props.disabled),
      filled: isWalkedFilled(props),
    };
    return true;
  });
  return found;
}

function asConstraintElement(
  target: EventTarget | null,
): HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null {
  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLSelectElement ||
    target instanceof HTMLTextAreaElement
  ) {
    return target;
  }
  return null;
}

function assignChildRef(
  ref: Ref<HTMLElement | null> | undefined,
  node: HTMLElement | null,
): void | (() => void) {
  if (!ref) return;
  if (typeof ref === 'function') {
    const cleanup = (ref as (instance: HTMLElement | null) => void | (() => void))(node);
    if (typeof cleanup === 'function') return cleanup;
    return () => {
      ref(null);
    };
  }
  const objectRef = ref as MutableRefObject<HTMLElement | null>;
  objectRef.current = node;
  return () => {
    objectRef.current = null;
  };
}

function controlIsFilled(el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
  if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
    return el.checked;
  }
  if (el instanceof HTMLSelectElement) {
    return Array.from(el.selectedOptions).some(
      (option) => option.value !== '' || option.text !== '',
    );
  }
  return el.value !== '';
}

function readBaseline(
  el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
): ControlBaseline {
  if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
    return { kind: 'check', checked: el.checked };
  }
  return { kind: 'value', value: el.value };
}

function isDirtyAgainstBaseline(
  el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
  baseline: ControlBaseline,
): boolean {
  if (baseline.kind === 'check') {
    return el instanceof HTMLInputElement && el.checked !== baseline.checked;
  }
  return el.value !== baseline.value;
}

function FieldRoot({
  name,
  children,
  className,
  invalid,
  onInvalidChange,
  htmlFor,
  ref,
}: FieldRootProps & { htmlFor?: string }): JSX.Element {
  const generatedId = useId();
  const walkedControl = findControlChild(children);
  const controlId = walkedControl.id ?? htmlFor ?? generatedId;
  const descriptionId = `${generatedId}-description`;
  const errorId = `${generatedId}-error`;
  const formErrors = useContext(FormErrorsContext);
  const formError = (name && formErrors[name]) || '';
  const [nativeInvalid, setNativeInvalidState] = useState(false);
  const [nativeMessage, setNativeMessage] = useState('');
  const [touched, setTouched] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [filledOverride, setFilledOverride] = useState<boolean | undefined>(undefined);
  const hasErrorContent = treeHasPart(children, FieldError);
  const isInvalid = invalid ?? (nativeInvalid || hasErrorContent || Boolean(formError));
  const hasDescription = treeHasPart(children, FieldDescription);
  const hasError = treeHasPart(children, FieldError, formError || nativeMessage);
  const errorMessageId = isInvalid && hasError ? errorId : undefined;
  const describedBy =
    [hasDescription ? descriptionId : undefined, errorMessageId].filter(Boolean).join(' ') ||
    undefined;
  const isFilled = filledOverride ?? walkedControl.filled;
  const isValid = (touched || dirty) && !isInvalid;

  const setNativeInvalid = useCallback(
    (nextInvalid: boolean, message: string) => {
      setNativeInvalidState(nextInvalid);
      setNativeMessage(message);
      onInvalidChange?.(nextInvalid);
    },
    [onInvalidChange],
  );

  const reportControl = useCallback(
    (report: ControlReport) => {
      if (report.nativeInvalid !== undefined) {
        setNativeInvalidState(report.nativeInvalid);
        onInvalidChange?.(report.nativeInvalid);
      }
      if (report.nativeMessage !== undefined) setNativeMessage(report.nativeMessage);
      if (report.dirty !== undefined) setDirty(report.dirty);
      if (report.filled !== undefined) setFilledOverride(report.filled);
      if (report.touched) setTouched(true);
    },
    [onInvalidChange],
  );

  const value = useMemo<FieldContextValue>(
    () => ({
      name,
      controlId,
      descriptionId,
      errorId,
      invalid: isInvalid,
      nativeMessage,
      formError,
      setNativeInvalid,
      reportControl,
      describedBy,
      errorMessageId,
    }),
    [
      name,
      controlId,
      descriptionId,
      errorId,
      isInvalid,
      nativeMessage,
      formError,
      setNativeInvalid,
      reportControl,
      describedBy,
      errorMessageId,
    ],
  );

  warnNestedFieldMeta(children);

  const f = field();
  return (
    <FieldContext.Provider value={value}>
      <div
        {...mergeProps(f.root, className)}
        ref={ref}
        data-invalid={isInvalid ? '' : undefined}
        data-valid={isValid ? '' : undefined}
        data-dirty={dirty ? '' : undefined}
        data-touched={touched ? '' : undefined}
        data-filled={isFilled ? '' : undefined}
        data-disabled={walkedControl.disabled ? '' : undefined}
      >
        {children}
      </div>
    </FieldContext.Provider>
  );
}

function FieldLabel({ children, className, ref }: FieldLabelProps): JSX.Element {
  const { controlId } = useFieldContext();
  const f = field();
  return (
    <label {...mergeProps(f.label, className)} htmlFor={controlId} ref={ref}>
      {children}
    </label>
  );
}

function FieldControl({ children, className }: FieldControlProps): ReactElement {
  const { name, controlId, invalid, describedBy, errorMessageId, reportControl } =
    useFieldContext();
  const childProps = children.props as ControlChildProps;
  const controlRef = useRef<HTMLElement | null>(null);
  const baselineRef = useRef<ControlBaseline | null>(null);

  useEffect(() => {
    const el = asConstraintElement(controlRef.current);
    if (!el) return;
    if (!baselineRef.current) {
      baselineRef.current = readBaseline(el);
    }
    reportControl({ filled: controlIsFilled(el) });
  }, [reportControl]);

  useLayoutEffect(
    () => assignChildRef(childProps.ref, controlRef.current),
    [childProps.ref, children.type, children.key],
  );

  const reportFromEvent = (event: ControlEvent) => {
    const el = asConstraintElement(event.currentTarget);
    if (!el) return;
    if (!baselineRef.current) {
      baselineRef.current = readBaseline(el);
    }
    reportControl({
      dirty: isDirtyAgainstBaseline(el, baselineRef.current),
      filled: controlIsFilled(el),
      nativeInvalid: !el.validity.valid,
      nativeMessage: el.validationMessage,
      touched: event.type === 'blur',
    });
  };

  return cloneElement(children, {
    id: childProps.id ?? controlId,
    name: childProps.name ?? name,
    className: cx(childProps.className, className) || undefined,
    'aria-describedby': describedBy,
    'aria-invalid': invalid || undefined,
    'aria-errormessage': errorMessageId,
    ref: controlRef,
    onBlur: (event: ControlEvent) => {
      childProps.onBlur?.(event);
      reportFromEvent(event);
    },
    onInput: (event: ControlEvent) => {
      childProps.onInput?.(event);
      reportFromEvent(event);
    },
    onChange: (event: ControlEvent) => {
      childProps.onChange?.(event);
      reportFromEvent(event);
    },
    onInvalid: (event: ControlEvent) => {
      childProps.onInvalid?.(event);
      reportFromEvent(event);
    },
  } as Partial<ControlChildProps>);
}

function FieldDescription({ children, className, ref }: FieldDescriptionProps): JSX.Element {
  const { descriptionId } = useFieldContext();
  const f = field();
  return (
    <p {...mergeProps(f.description, className)} id={descriptionId} ref={ref}>
      {children}
    </p>
  );
}

function FieldError({ children, className, forceMount, ref }: FieldErrorProps): JSX.Element | null {
  const { errorId, nativeMessage, formError } = useFieldContext();
  const hasExplicitChildren = !(children === undefined || children === null || children === false);
  const content = hasExplicitChildren ? children : formError || nativeMessage;
  if (!errorPartMounts({ children: content, forceMount })) {
    return null;
  }
  const f = field();
  return (
    <p {...mergeProps(f.error, className)} id={errorId} role="alert" ref={ref}>
      {content}
    </p>
  );
}

/**
 * Field chrome for custom inputs: label, description, and error message
 * around any control that isn't one of the built-in field components.
 *
 * ```tsx
 * <Field label="Amount" description="In USD" htmlFor="amount">
 *   <MyCurrencyInput id="amount" />
 * </Field>
 *
 * <Field.Root>
 *   <Field.Label>Email</Field.Label>
 *   <Field.Control>
 *     <input />
 *   </Field.Control>
 * </Field.Root>
 * ```
 */
function Field({
  label,
  description,
  errorMessage,
  htmlFor,
  className,
  children,
  ref,
}: FieldProps): JSX.Element {
  const control = isSingleHostElement(children) ? (
    <FieldControl>
      {cloneElement(children as ReactElement<ControlChildProps>, {
        id: htmlFor ?? (children.props as ControlChildProps).id,
      })}
    </FieldControl>
  ) : (
    children
  );
  return (
    <FieldRoot
      className={className}
      invalid={Boolean(errorMessage) || undefined}
      htmlFor={htmlFor}
      ref={ref}
    >
      {label ? <FieldLabel>{label}</FieldLabel> : null}
      {control}
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
    </FieldRoot>
  );
}

export const FieldNamespace = Object.assign(Field, {
  Root: FieldRoot,
  Label: FieldLabel,
  Control: FieldControl,
  Description: FieldDescription,
  Error: FieldError,
});

export { FieldNamespace as Field };
