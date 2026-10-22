import { variant, type VariantOptions } from 'typestyles';

/**
 * Shared variant axes for schema-first recipes.
 *
 * Axes carry only the public options and their default — the per-component
 * style map still lives in each recipe callback. Sharing an axis keeps option
 * names and defaults identical wherever the same concept recurs, without
 * coupling the visual treatments.
 */

const controlSizeValues = ['sm', 'md', 'lg'] as const;

/**
 * `sm` / `md` / `lg` size axis for controls, compact widgets, and rows.
 * The middle of {@link size}. Used by button, inputs, select, tabs, toolbar,
 * drawer, spinner, and friends.
 */
export const controlSize = variant.enum(controlSizeValues, { default: 'md' });

export type ControlSize = VariantOptions<typeof controlSize>;

/**
 * `xs` / `sm` / `md` / `lg` / `xl` size axis. `controlSize` is this scale
 * without `xs` and `xl`.
 */
const sizeValues = ['xs', ...controlSizeValues, 'xl'] as const;

export const size = variant.enum(sizeValues, { default: 'md' });

export type Size = VariantOptions<typeof size>;

/** Vertical density axis for list-like surfaces (list, tree, table, chat). */
export const density = variant.enum(['compact', 'balanced', 'spacious'], {
  default: 'balanced',
});

/** Spacing scale axis for layout primitives (stack, grid, simple-grid, overflow-list). */
export const gap = variant.enum(['none', 'xs', 'sm', 'md', 'lg', 'xl'], { default: 'md' });

/** Horizontal / vertical flow axis for dividers, toolbars, and separators. */
export const orientation = variant.enum(['horizontal', 'vertical'], { default: 'horizontal' });

/**
 * Solid / subtle fill weight for progress-style indicators
 * (`spinner`, `progress-bar`).
 */
export const fillAppearance = variant.enum(['solid', 'subtle'], { default: 'solid' });

export type FillAppearance = VariantOptions<typeof fillAppearance>;

/** Chat message author axis (`chat-message`, `chat-message-bubble`). */
export const sender = variant.enum(['user', 'assistant'], { default: 'assistant' });

/** Anchored overlay placement axis for `data-placement`-positioned popovers. */
export const placement = variant.enum(['top-start', 'top-end', 'bottom-start', 'bottom-end'], {
  default: 'bottom-end',
});
