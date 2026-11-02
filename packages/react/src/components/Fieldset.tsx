import {
  Children,
  createContext,
  Fragment,
  isValidElement,
  use,
  type ComponentPropsWithRef,
  type JSX,
  type ReactElement,
  type ReactNode,
} from 'react';
import { fieldset } from '@var-ui/core/components/fieldset';
import type { FieldsetVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';
import { useFieldFrame, type FieldFrameState } from './FieldFrame';

type FieldsetContextValue = {
  slots: ReturnType<typeof fieldset>;
  frame: FieldFrameState;
};

const FieldsetContext = createContext<FieldsetContextValue | null>(null);

export type FieldsetLegendProps = ComponentPropsWithRef<'legend'>;
export type FieldsetDescriptionProps = ComponentPropsWithRef<'p'>;
export type FieldsetErrorProps = ComponentPropsWithRef<'p'>;

/** The `<legend>`. Rendered as the first child of the `<fieldset>` whatever its position in `children`. */
function FieldsetLegend({ className, ref, ...rest }: FieldsetLegendProps): JSX.Element {
  const ctx = use(FieldsetContext);
  return <legend {...rest} {...mergeProps(ctx?.slots.legend ?? '', className)} ref={ref} />;
}

/** Help text under the legend; referenced by the fieldset's `aria-describedby`. */
function FieldsetDescription({
  className,
  id,
  ref,
  ...rest
}: FieldsetDescriptionProps): JSX.Element {
  const ctx = use(FieldsetContext);
  return (
    <p
      {...rest}
      {...mergeProps(ctx?.slots.description ?? '', className)}
      id={id ?? ctx?.frame.descriptionId}
      ref={ref}
    />
  );
}

/** Validation message after the controls; marks the fieldset invalid and is referenced by `aria-describedby`. */
function FieldsetError({ className, id, ref, ...rest }: FieldsetErrorProps): JSX.Element {
  const ctx = use(FieldsetContext);
  return (
    <p
      {...rest}
      {...mergeProps(ctx?.slots.error ?? '', className)}
      id={id ?? ctx?.frame.errorId}
      ref={ref}
    />
  );
}

export type FieldsetProps = Omit<ComponentPropsWithRef<'fieldset'>, 'children'> &
  Pick<FieldsetVariantProps, 'gap' | 'orientation'> & {
    /** Shorthand legend text. Use `<Fieldset.Legend>` as a child for a custom node. */
    legend?: ReactNode;
    /** Visually hide the legend while keeping it as the group's accessible name. */
    legendHidden?: boolean;
    /** Help text under the legend. */
    description?: ReactNode;
    /** Validation message after the controls. Implies `invalid`. */
    errorMessage?: ReactNode;
    /**
     * Marks the group invalid (`data-invalid`). `aria-invalid` is not allowed on a `fieldset`
     * (group role), so the state is conveyed by the error text through `aria-describedby`.
     * Derived from `errorMessage` unless set.
     */
    invalid?: boolean;
    /** Native `disabled`: disables every descendant form control and removes them from the Tab order. */
    disabled?: boolean;
    /** The controls, plus optional `Fieldset.Legend` / `Fieldset.Description` / `Fieldset.Error` parts. */
    children?: ReactNode;
  };

function isPart(node: ReactNode, part: unknown): node is ReactElement {
  return isValidElement(node) && node.type === part;
}

/** Flatten top-level Fragments so compound parts wrapped in `<>…</>` still resolve. */
function flattenChildren(children: ReactNode): ReactNode[] {
  const out: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === Fragment) {
      out.push(...flattenChildren((child.props as { children?: ReactNode }).children));
    } else {
      out.push(child);
    }
  });
  return out;
}

/**
 * Groups related form controls in a native `<fieldset>` with a `<legend>`. A `disabled` fieldset
 * disables all the form controls inside it natively (no per-control prop needed).
 *
 * ```tsx
 * <Fieldset legend="Notifications" description="Choose how we reach you.">
 *   <Checkbox>Email</Checkbox>
 *   <Checkbox>SMS</Checkbox>
 * </Fieldset>
 * ```
 */
function FieldsetRoot({
  legend,
  legendHidden = false,
  description,
  errorMessage,
  invalid,
  disabled,
  orientation = 'vertical',
  gap,
  className,
  children,
  ref,
  ...rest
}: FieldsetProps): JSX.Element {
  let legendPart: ReactNode = null;
  let descriptionPart: ReactNode = null;
  let errorPart: ReactNode = null;
  const controls: ReactNode[] = [];
  for (const child of flattenChildren(children)) {
    if (isPart(child, FieldsetLegend)) legendPart = child;
    else if (isPart(child, FieldsetDescription)) descriptionPart = child;
    else if (isPart(child, FieldsetError)) errorPart = child;
    else controls.push(child);
  }

  const frame = useFieldFrame({
    description: description || descriptionPart,
    errorMessage: errorMessage || errorPart,
    invalid,
    describedBy: rest['aria-describedby'],
  });
  const slots = fieldset({ orientation, gap, legendHidden });
  const legendNode = legendPart ?? (legend ? <FieldsetLegend>{legend}</FieldsetLegend> : null);
  const descriptionNode =
    descriptionPart ??
    (description ? <FieldsetDescription>{description}</FieldsetDescription> : null);
  const errorNode =
    errorPart ?? (errorMessage ? <FieldsetError>{errorMessage}</FieldsetError> : null);

  return (
    <FieldsetContext value={{ slots, frame }}>
      <fieldset
        {...rest}
        {...mergeProps(slots.root, className)}
        aria-describedby={frame.controlProps['aria-describedby']}
        disabled={disabled}
        data-disabled={disabled ? '' : undefined}
        data-invalid={frame.invalid ? '' : undefined}
        ref={ref}
      >
        {legendNode}
        {descriptionNode}
        <div {...mergeProps(slots.content)}>{controls}</div>
        {errorNode}
      </fieldset>
    </FieldsetContext>
  );
}

export const Fieldset = Object.assign(FieldsetRoot, {
  Root: FieldsetRoot,
  Legend: FieldsetLegend,
  Description: FieldsetDescription,
  Error: FieldsetError,
});
