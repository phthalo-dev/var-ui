/**
 * Reserved `@var-ui/core` package.json export entries.
 * Recipe short names from dist/components must not shadow these keys.
 *
 * @returns {Record<string, string | { types: string; import: string }>}
 */
export function coreReservedExports() {
  return {
    '.': { types: './dist/index.d.mts', import: './dist/index.mjs' },
    './theme-constants': {
      types: './dist/theme/constants.d.mts',
      import: './dist/theme/constants.mjs',
    },
    './register-default-theme': {
      types: './dist/theme/register-default.d.mts',
      import: './dist/theme/register-default.mjs',
    },
    './styles': {
      types: './dist/styles.d.mts',
      import: './dist/styles.mjs',
    },
    './styles.css': './dist/styles.css',
  };
}
