/**
 * A demo lives in `src/demos/<component>/<name>/` and its id is `<component>.<name>`.
 * Every demo map is a glob over that layout, so adding a demo is adding a folder.
 */
export function demoIdFromPath(path: string): string {
  const match = /^\.\/([^/]+)\/([^/]+)\/[^/]+$/.exec(path);
  if (!match) {
    throw new Error(`Demo file "${path}" is not at src/demos/<component>/<name>/<file>`);
  }
  return `${match[1]}.${match[2]}`;
}

/** Re-keys a glob result (`./table/bordered/react.tsx` → `table.bordered`). */
export function keyByDemoId<T>(modules: Record<string, T>): Record<string, T> {
  return Object.fromEntries(
    Object.entries(modules).map(([path, mod]) => [demoIdFromPath(path), mod]),
  );
}
