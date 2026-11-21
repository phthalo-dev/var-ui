/**
 * In-repo consumers (the docs site, examples, package tests) load Var UI packages from their
 * TypeScript source instead of `dist`. Each export in `packages/{core,react,icons}/package.json`
 * has an `@var-ui/source` condition pointing at its source file, so the packages' own `exports`
 * maps are the only list of entry points: a new entry needs no alias anywhere. Published
 * consumers never set this condition, so they get `dist`.
 *
 * Spread {@link sourceConditions} into a Vite (or Vitest, or Astro `vite`) config. TypeScript
 * gets the same condition through `customConditions` in each tsconfig.
 */
export const SOURCE_CONDITION = '@var-ui/source';

// Vite's own defaults (`defaultClientConditions` / `defaultServerConditions`), which a custom
// `conditions` list replaces rather than extends. Inlined so this file doesn't depend on which
// Vite major a consumer resolves (Astro pins its own).
const clientConditions: string[] = ['module', 'browser', 'development|production'];
const serverConditions: string[] = ['module', 'node', 'development|production'];

export const sourceConditions: {
  resolve: { conditions: string[] };
  ssr: { resolve: { conditions: string[] } };
} = {
  resolve: { conditions: [SOURCE_CONDITION, ...clientConditions] },
  ssr: { resolve: { conditions: [SOURCE_CONDITION, ...serverConditions] } },
};
