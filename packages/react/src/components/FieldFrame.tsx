import { useId, type CSSProperties, type JSX, type ReactNode } from 'react';
import { FieldError as AriaFieldError, Label as AriaLabel, Text } from 'react-aria-components';
import { mergeProps } from 'typestyles';

/**
 * Internal field chrome shared by every form field (not exported from the
 * package barrels). Two flavours, one vocabulary (`label`, `description`,
 * `errorMessage`, `invalid`):
 *
 * - **`FieldFrame` + `useFieldFrame`**: for hand-rolled controls. Renders the
 *   root `<div>`, label, description and error with generated ids, and hands
 *   the control the props it needs (`id`, `aria-describedby`, `aria-invalid`).
 *
 *   ```tsx
 *   const frame = useFieldFrame({ description, errorMessage, invalid, id });
 *   <FieldFrame slots={p} frame={frame} label={label} description={description}
 *     errorMessage={errorMessage} className={className} style={style}>
 *     <input {...rest} {...frame.controlProps} ref={ref} />
 *   </FieldFrame>
 *   ```
 *
 * - **`RacFieldFrame`**: for controls rendered inside a react-aria-components
 *   field (`TextField`, `NumberField`, ...). RAC context supplies the ids, so
 *   it renders RAC `Label`, `Text slot="description"` and `FieldError`
 *   inside the RAC root. Use `racInvalid(...)` for the root's `isInvalid`.
 *
 * Both take recipe `slots` (the field's own `label` / `description` / `error`
 * class slots), so the DOM and class hooks of each component stay unchanged.
 * Converting a selection/date/file field: pick the flavour that matches its
 * root (RAC root -> `RacFieldFrame`, plain `<div>` -> `FieldFrame`), pass the
 * component's existing recipe slots and keep the control as `children`.
 */

type RecipeSlot = Parameters<typeof mergeProps>[0];

/** The recipe class slots the frame renders. A component's recipe satisfies this directly. */
export type FieldFrameSlots = {
  root?: RecipeSlot;
  label?: RecipeSlot;
  description?: RecipeSlot;
  error?: RecipeSlot;
};

/** `invalid` derives from `errorMessage` unless the caller passes it. */
export function resolveInvalid(invalid: boolean | undefined, errorMessage?: ReactNode): boolean {
  return invalid ?? Boolean(errorMessage);
}

/** Value for a RAC root's `isInvalid`: `undefined` leaves RAC's own validation in charge. */
export function racInvalid(invalid: boolean | undefined, errorMessage?: ReactNode) {
  const resolved = resolveInvalid(invalid, errorMessage);
  return resolved ? true : undefined;
}

export type FieldFrameState = {
  /** id for the control; the caller's `id` when given. */
  controlId: string;
  labelId: string;
  descriptionId: string;
  errorId: string;
  invalid: boolean;
  /** Spread onto the native control. `aria-describedby` merges the caller's own value. */
  controlProps: {
    id: string;
    'aria-describedby': string | undefined;
    'aria-invalid': true | undefined;
  };
};

export type UseFieldFrameOptions = {
  description?: ReactNode;
  errorMessage?: ReactNode;
  invalid?: boolean;
  /** The caller's `id` for the control; generated when omitted. */
  id?: string;
  /** The caller's own `aria-describedby`, kept ahead of the generated ids. */
  describedBy?: string;
};

/** Generates the ids for a field and derives `invalid` and the control's aria wiring. */
export function useFieldFrame({
  description,
  errorMessage,
  invalid,
  id,
  describedBy,
}: UseFieldFrameOptions): FieldFrameState {
  const generated = useId();
  const controlId = id ?? `${generated}-control`;
  const labelId = `${generated}-label`;
  const descriptionId = `${generated}-description`;
  const errorId = `${generated}-error`;
  const isInvalid = resolveInvalid(invalid, errorMessage);
  const ids =
    [describedBy, description ? descriptionId : null, errorMessage ? errorId : null]
      .filter(Boolean)
      .join(' ') || undefined;
  return {
    controlId,
    labelId,
    descriptionId,
    errorId,
    invalid: isInvalid,
    controlProps: {
      id: controlId,
      'aria-describedby': ids,
      'aria-invalid': isInvalid ? true : undefined,
    },
  };
}

export type FieldFrameDescriptionProps = {
  slot?: RecipeSlot;
  id?: string;
  children?: ReactNode;
};

/** `<p>` help text; renders nothing when empty. */
export function FieldFrameDescription({ slot, id, children }: FieldFrameDescriptionProps) {
  if (!children) return null;
  return (
    <p {...mergeProps(slot ?? '')} id={id}>
      {children}
    </p>
  );
}

export type FieldFrameErrorProps = {
  slot?: RecipeSlot;
  id?: string;
  /** Some fields announce their error (`role="alert"`), others do not. */
  role?: 'alert';
  children?: ReactNode;
};

/** `<p>` validation message; renders nothing when empty. */
export function FieldFrameError({ slot, id, role, children }: FieldFrameErrorProps) {
  if (!children) return null;
  return (
    <p {...mergeProps(slot ?? '')} id={id} role={role}>
      {children}
    </p>
  );
}

export type FieldFrameProps = {
  slots: FieldFrameSlots;
  frame: FieldFrameState;
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: ReactNode;
  /**
   * `label` renders `<label for=controlId>` (single native control); `span`
   * renders a named `<span id=labelId>` for groups that use `aria-labelledby`.
   * @default label
   */
  labelAs?: 'label' | 'span';
  /** Set `alert` to announce the error message. */
  errorRole?: 'alert';
  /** Hide label/description/error while keeping the root (e.g. a swatch-only appearance). */
  chrome?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Extra attributes for the root `<div>` (data hooks). */
  rootProps?: Record<string, unknown>;
  /** Rendered between the label and the control, inside the root. */
  children: ReactNode;
};

/** Root `<div>` + label + control + description + error for hand-rolled fields. */
export function FieldFrame({
  slots,
  frame,
  label,
  description,
  errorMessage,
  labelAs = 'label',
  errorRole,
  chrome = true,
  className,
  style,
  rootProps,
  children,
}: FieldFrameProps): JSX.Element {
  const labelProps = { ...mergeProps(slots.label ?? '') };
  return (
    <div {...rootProps} {...mergeProps(slots.root ?? '', className)} style={style}>
      {chrome && label ? (
        labelAs === 'label' ? (
          <label {...labelProps} id={frame.labelId} htmlFor={frame.controlId}>
            {label}
          </label>
        ) : (
          <span {...labelProps} id={frame.labelId}>
            {label}
          </span>
        )
      ) : null}
      {children}
      {chrome ? (
        <FieldFrameDescription slot={slots.description} id={frame.descriptionId}>
          {description}
        </FieldFrameDescription>
      ) : null}
      {chrome ? (
        <FieldFrameError slot={slots.error} id={frame.errorId} role={errorRole}>
          {errorMessage}
        </FieldFrameError>
      ) : null}
    </div>
  );
}

export type RacFieldFrameProps = {
  slots: FieldFrameSlots;
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: ReactNode;
  /** The control(s), rendered between the label and the description. */
  children: ReactNode;
};

/**
 * Label, control, description and error inside a RAC field root. The RAC
 * contexts provided by the root wire `htmlFor`, `aria-labelledby` and
 * `aria-describedby`, so no ids are generated here.
 */
export function RacFieldFrame({
  slots,
  label,
  description,
  errorMessage,
  children,
}: RacFieldFrameProps): JSX.Element {
  return (
    <>
      {label ? <AriaLabel {...mergeProps(slots.label ?? '')}>{label}</AriaLabel> : null}
      {children}
      {description ? (
        <Text slot="description" elementType="p" {...mergeProps(slots.description ?? '')}>
          {description}
        </Text>
      ) : null}
      <AriaFieldError {...mergeProps(slots.error ?? '')}>{errorMessage ?? ''}</AriaFieldError>
    </>
  );
}
