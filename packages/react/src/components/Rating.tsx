import {
  useId,
  useState,
  type ChangeEvent,
  type ComponentPropsWithRef,
  type CSSProperties,
  type JSX,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { rating } from '@var-ui/core/components/rating';
import { recipeVars, styleVars } from '@var-ui/core/components/styleVars';
import { iconNameList, type IconName } from '@var-ui/core/icons/iconNames';
import type { RatingVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';
import { emptyFallback } from '../icons/emptyFallback';
import { useIcons } from '../icons/IconProvider';
import { useControlSize } from '../internal/controlSizeContext';
import { FieldFrame, useFieldFrame } from './FieldFrame';

const ratingVars = recipeVars(rating);

/** Built-in star, used when the `IconProvider` registry has no `star` glyph. */
const builtinStar = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96z" />
  </svg>
);

export type RatingProps = Omit<
  ComponentPropsWithRef<'input'>,
  | 'type'
  | 'size'
  | 'value'
  | 'defaultValue'
  | 'checked'
  | 'defaultChecked'
  | 'max'
  | 'min'
  | 'step'
  | 'disabled'
  | 'readOnly'
  | 'required'
  | 'children'
  | 'className'
  | 'style'
  | 'onChange'
  | 'ref'
  | 'id'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-describedby'
> & {
  /** Controlled rating, `0` = none. Fractions (e.g. `3.5`) are shown only when `readOnly`; otherwise the value is rounded. */
  value?: number;
  /** Initial rating when uncontrolled. @default 0 */
  defaultValue?: number;
  /** Called with the new rating (`0` when cleared) after a pick. */
  onValueChange?: (value: number) => void;
  /**
   * Native change event of the radio that became checked (`event.target.value` is its number).
   * It does not fire when `clearable` clears the rating: use `onValueChange(0)` for that.
   */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Number of items. @default 5 */
  max?: number;
  /** Disables every item and excludes the rating from form submission. */
  disabled?: boolean;
  /**
   * Display only: no radios, not focusable. Renders `role="img"` with an `aria-label` such as
   * "3 out of 5". With a `name` the value is still submitted through a hidden input.
   */
  readOnly?: boolean;
  /** Requires a pick for form validation. */
  required?: boolean;
  /** Shows the error state. Defaults to `Boolean(errorMessage)`. */
  invalid?: boolean;
  /** Clicking (or pressing Space on) the current value clears the rating to `0`. */
  clearable?: boolean;
  /** Item density. Falls back to the surrounding control size, then `md`. */
  size?: NonNullable<RatingVariantProps['size']>;
  /** Color of the filled items. @default 'accent' */
  tone?: NonNullable<RatingVariantProps['tone']>;
  /** Filled glyph: a semantic icon name from the `IconProvider` registry or any node. @default 'star' */
  icon?: IconName | ReactNode;
  /** Empty glyph, same forms as `icon`. @default the `icon` */
  emptyIcon?: IconName | ReactNode;
  /** Accessible name of each item. @default (n, max) => `${n} of ${max}` */
  getItemLabel?: (value: number, max: number) => string;
  /** Accessible name of the read-only display. @default (value, max) => `${value} out of ${max}` */
  getValueLabel?: (value: number, max: number) => string;
  /** Visible label above the rating; names the `radiogroup`. */
  label?: ReactNode;
  /** Help text under the rating. */
  description?: ReactNode;
  /** Validation message under the rating; implies `invalid`. */
  errorMessage?: ReactNode;
  /** Classes for the root element. */
  className?: string;
  /** Inline style for the root element. */
  style?: CSSProperties;
  /** `id` of the `radiogroup` (or the read-only `img`). */
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  /** Ref to the first radio `<input>`, or to the `role="img"` group when `readOnly`. */
  ref?: Ref<HTMLInputElement | HTMLDivElement>;
};

function resolveGlyph(
  value: IconName | ReactNode | undefined,
  icons: ReturnType<typeof useIcons>,
  fallback: ReactNode,
): ReactNode {
  if (value === undefined) return fallback;
  if (typeof value === 'string' && (iconNameList as readonly string[]).includes(value)) {
    const name = value as IconName;
    return icons[name] ?? (name === 'star' ? builtinStar : emptyFallback);
  }
  return value;
}

const defaultItemLabel = (n: number, max: number) => `${n} of ${max}`;
const defaultValueLabel = (value: number, max: number) => `${value} out of ${max}`;

/**
 * Star rating input and display. An input rating is a native radio group (`max` radios sharing a
 * `name`), so arrow keys, Home/End, Tab, form submission, `required` and `disabled` are the
 * browser's own; the radios are visually hidden and the labels draw the icons.
 *
 * ```tsx
 * <Rating label="Quality" name="quality" defaultValue={3} onValueChange={setValue} />
 * <Rating readOnly value={3.5} />
 * ```
 */
export function Rating({
  value,
  defaultValue = 0,
  onValueChange,
  onChange,
  max = 5,
  disabled = false,
  readOnly = false,
  required = false,
  invalid,
  clearable = false,
  size,
  tone,
  icon,
  emptyIcon,
  getItemLabel = defaultItemLabel,
  getValueLabel = defaultValueLabel,
  label,
  description,
  errorMessage,
  className,
  style,
  id,
  name,
  form,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ref,
  ...rest
}: RatingProps): JSX.Element {
  const contextSize = useControlSize();
  const icons = useIcons();
  const generatedName = useId();
  const p = rating({ size: size ?? contextSize ?? 'md', tone });
  const frame = useFieldFrame({
    description,
    errorMessage,
    invalid,
    id,
    describedBy: ariaDescribedBy,
  });
  const count = Math.max(1, Math.floor(max));
  const isControlled = value !== undefined;
  const [inner, setInner] = useState(defaultValue);
  const raw = isControlled ? value : inner;
  const current = Math.min(count, Math.max(0, readOnly ? raw : Math.round(raw)));

  const filledGlyph = resolveGlyph(icon, icons, resolveGlyph('star', icons, builtinStar));
  const emptyGlyph = resolveGlyph(emptyIcon, icons, filledGlyph);

  const commit = (next: number) => {
    if (!isControlled) setInner(next);
    onValueChange?.(next);
  };

  const rootProps = {
    'data-disabled': disabled || undefined,
    'data-readonly': readOnly || undefined,
    'data-invalid': frame.invalid || undefined,
    'data-required': required || undefined,
  };
  const labelledBy = label ? frame.labelId : ariaLabelledBy;

  const glyphs = (n: number) => {
    const whole = Math.floor(current);
    const fraction = n === whole + 1 ? current - whole : 0;
    return {
      filled: n <= whole,
      style:
        fraction > 0 ? styleVars([[ratingVars.fill, `${Math.round(fraction * 100)}%`]]) : undefined,
      node: (
        <>
          <span {...mergeProps(p.empty)}>{emptyGlyph}</span>
          <span {...mergeProps(p.fill)}>
            <span {...mergeProps(p.icon)}>{filledGlyph}</span>
          </span>
        </>
      ),
    };
  };

  if (readOnly) {
    const valueLabel = getValueLabel(current, count);
    return (
      <FieldFrame
        slots={p}
        frame={frame}
        label={label}
        description={description}
        errorMessage={errorMessage}
        labelAs="span"
        className={className}
        style={style}
        rootProps={rootProps}
      >
        <div
          {...mergeProps(p.group)}
          id={frame.controlProps.id}
          role="img"
          aria-label={valueLabel}
          aria-labelledby={label ? `${frame.labelId} ${frame.controlId}` : ariaLabelledBy}
          aria-describedby={frame.controlProps['aria-describedby']}
          data-readonly=""
          ref={ref as Ref<HTMLDivElement>}
        >
          {Array.from({ length: count }, (_, i) => {
            const g = glyphs(i + 1);
            return (
              <span
                key={i}
                {...mergeProps(p.item)}
                data-readonly=""
                data-filled={g.filled || undefined}
                style={g.style}
                aria-hidden="true"
              >
                {g.node}
              </span>
            );
          })}
          {name ? <input type="hidden" name={name} form={form} value={current} /> : null}
        </div>
      </FieldFrame>
    );
  }

  const groupName = name ?? generatedName;
  return (
    <FieldFrame
      slots={p}
      frame={frame}
      label={label}
      description={description}
      errorMessage={errorMessage}
      labelAs="span"
      className={className}
      style={style}
      rootProps={rootProps}
    >
      <div
        {...mergeProps(p.group)}
        id={frame.controlProps.id}
        role="radiogroup"
        aria-label={label ? undefined : ariaLabel}
        aria-labelledby={labelledBy}
        aria-describedby={frame.controlProps['aria-describedby']}
        aria-invalid={frame.controlProps['aria-invalid']}
        aria-required={required || undefined}
        aria-disabled={disabled || undefined}
        data-disabled={disabled || undefined}
      >
        {Array.from({ length: count }, (_, i) => {
          const n = i + 1;
          const g = glyphs(n);
          return (
            <label
              key={n}
              {...mergeProps(p.item)}
              data-filled={g.filled || undefined}
              data-checked={n === current || undefined}
              data-disabled={disabled || undefined}
            >
              <input
                {...rest}
                {...mergeProps(p.input)}
                ref={n === 1 ? (ref as Ref<HTMLInputElement>) : undefined}
                type="radio"
                name={groupName}
                // Without a `name` the radios still group natively, but must not post a generated field.
                form={form ?? (name ? undefined : '')}
                value={n}
                checked={n === current}
                disabled={disabled}
                required={required}
                aria-label={getItemLabel(n, count)}
                onChange={(event) => {
                  onChange?.(event);
                  commit(n);
                }}
                onClick={(event: MouseEvent<HTMLInputElement>) => {
                  rest.onClick?.(event);
                  if (clearable && n === current && !event.defaultPrevented) commit(0);
                }}
                onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                  rest.onKeyDown?.(event);
                  // Radios do not uncheck on Space; clearable treats Space like a second click.
                  if (clearable && n === current && event.key === ' ' && !event.defaultPrevented) {
                    event.preventDefault();
                    commit(0);
                  }
                }}
              />
              {g.node}
            </label>
          );
        })}
      </div>
    </FieldFrame>
  );
}
