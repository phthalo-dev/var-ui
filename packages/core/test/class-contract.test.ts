import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import '../src/components';
import { typestyles } from '../src/runtime';

/**
 * Stability contract for people who write plain CSS against var-ui: slot class names,
 * component CSS variable names, and variant axes (which surface as `data-<axis>` attributes).
 * A diff here is a breaking change to the public styling surface — rename deliberately and
 * update the snapshot in the same PR so it shows up in review.
 */

type RecipeLike = ((props?: object) => unknown) & {
  defaults?: Record<string, unknown>;
  base?: string;
} & Record<string, unknown>;

type ResolvedSlot = { className?: string; attrs?: Record<string, unknown> };

/**
 * Component variables are registered as `@property --var-ui-<recipe>-<name>`. `recipe.vars` is a
 * lazy proxy that cannot be enumerated, so read the names from the emitted CSS and assign each to
 * the recipe with the longest matching name prefix (`layout-header-…` is not a `layout` var).
 */
function varsByRecipe(recipeNames: string[]): Record<string, string[]> {
  const css = getRegisteredCss();
  const byLength = [...recipeNames].sort((a, b) => b.length - a.length);
  const out: Record<string, string[]> = Object.fromEntries(recipeNames.map((name) => [name, []]));
  for (const match of css.matchAll(/@property (--var-ui-[a-z0-9-]+)/g)) {
    const prop = match[1];
    const owner = byLength.find((name) => prop.startsWith(`--var-ui-${name}-`));
    if (owner) out[owner].push(prop);
  }
  for (const list of Object.values(out)) list.sort();
  return out;
}

function describeRecipe(recipe: RecipeLike, vars: string[]) {
  const result = recipe({}) as ResolvedSlot & Record<string, ResolvedSlot | string>;
  const slots: Record<string, string> = {};
  const attrNames = new Set<string>();

  if (typeof result.className === 'string') {
    slots.base = result.className;
    for (const attr of Object.keys(result.attrs ?? {})) attrNames.add(attr);
  } else {
    for (const [slot, value] of Object.entries(result)) {
      if (value && typeof value === 'object' && typeof value.className === 'string') {
        slots[slot] = value.className;
        for (const attr of Object.keys(value.attrs ?? {})) attrNames.add(attr);
      }
    }
  }

  return {
    slots,
    vars,
    axes: [...new Set([...Object.keys(recipe.defaults ?? {}), ...attrNames])].sort(),
  };
}

describe('recipe class, variable and axis contract', () => {
  it('matches the inventory snapshot for every themeable recipe', () => {
    const inventory: Record<string, ReturnType<typeof describeRecipe>> = {};
    const recipes = [...typestyles.getThemeableComponents()].sort(([a], [b]) => a.localeCompare(b));
    // Invoke every recipe first so all component vars are registered before reading the CSS.
    for (const [, recipe] of recipes) (recipe as RecipeLike)({});
    const vars = varsByRecipe(recipes.map(([name]) => name));
    for (const [name, recipe] of recipes) {
      inventory[name] = describeRecipe(recipe as RecipeLike, vars[name]);
    }
    expect(Object.keys(inventory).length).toBeGreaterThan(80);
    expect(inventory).toMatchSnapshot();
  });
});
