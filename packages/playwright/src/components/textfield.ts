import { expect, type Locator } from '@playwright/test';
import { partByLabel } from '../core/part';
import type { HarnessScoper } from '../core/types';

/** `name` is required: it is the field's visible label text (what `getByLabel` matches). */
export interface TextFieldNameOptions {
  /** The field's visible label text. */
  name: string | RegExp;
  /** Match `name` exactly (after trimming whitespace). @default false */
  exact?: boolean;
}

/**
 * Harness for `@var-ui/react`'s `TextField` and its family (`TextAreaField`, `SearchInput`,
 * `PasswordInput`, ...): a labelled native control inside a field root that carries the
 * label, description and validation error.
 */
export class TextFieldHarness {
  /** The native control, resolved via `getByLabel(name)`. */
  readonly input: Locator;
  /** The field root (`label` + control + description + error). */
  readonly root: Locator;

  constructor(scoper: HarnessScoper, { name, exact }: TextFieldNameOptions) {
    this.input = partByLabel(scoper, name, { exact }, 'TextField input');
    // React-aria-components renders the frame contents (label, input, description, error)
    // as direct children of the field root, so the input's parent is that root.
    this.root = this.input.locator('..').describe('TextField root');
  }

  async fill(value: string): Promise<void> {
    await this.input.fill(value);
  }

  async clear(): Promise<void> {
    await this.input.fill('');
  }

  async expectValue(value: string): Promise<void> {
    await expect(this.input).toHaveValue(value);
  }

  /** The control is enabled/disabled (`disabled` on the native input). */
  async expectEnabled(): Promise<void> {
    await expect(this.input).toBeEnabled();
  }

  async expectDisabled(): Promise<void> {
    await expect(this.input).toBeDisabled();
  }

  /** The error state is surfaced as `aria-invalid` on the control. */
  async expectInvalid(): Promise<void> {
    await expect(this.input).toHaveAttribute('aria-invalid', 'true');
  }

  async expectValid(): Promise<void> {
    await expect(this.input).not.toHaveAttribute('aria-invalid');
  }

  /** The validation error message is visible (RAC renders it with validationBehavior `aria`, or after a failed native submit). */
  async expectErrorText(text: string | RegExp): Promise<void> {
    await expect(this.root.getByText(text)).toBeVisible();
  }
}

export function getTextField(scoper: HarnessScoper, name: TextFieldNameOptions): TextFieldHarness {
  return new TextFieldHarness(scoper, name);
}
