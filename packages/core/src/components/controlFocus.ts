import { designTokens as t } from '../tokens';

/** Focus ring for bordered control shells that use `:focus-within` (search, combobox). */
export function controlFocusStyles() {
  return {
    outline: `1px solid ${t.color.border.focus.var}`,
    boxShadow: `0 0 3px ${t.color.border.focus.var}`,
  } as const;
}
