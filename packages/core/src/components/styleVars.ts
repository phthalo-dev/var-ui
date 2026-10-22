import { assignVars, type CSSVarRef } from 'typestyles';

type VarRef = { readonly var: CSSVarRef };

/**
 * Build an inline style object that assigns runtime values to recipe CSS variables.
 * Pass the `.var` ref from `c.vars()` so every framework writes the same property.
 * Nullish values are omitted. Returns undefined when nothing is assigned.
 */
export function styleVars(
  assignments: ReadonlyArray<readonly [VarRef, string | number | null | undefined]>,
): Record<string, string> | undefined {
  const input: Partial<Record<CSSVarRef, string>> = {};
  for (const [ref, value] of assignments) {
    if (value == null) continue;
    input[ref.var] = String(value);
  }
  if (Object.keys(input).length === 0) return undefined;
  return assignVars(input);
}

/** CSS variables registered on a recipe. Throws if the recipe declared none. */
export function recipeVars<T extends { readonly vars?: object | undefined }>(
  recipe: T,
): NonNullable<T['vars']> {
  if (!recipe.vars) {
    throw new Error('[var-ui] Recipe did not register CSS variables.');
  }
  return recipe.vars;
}
