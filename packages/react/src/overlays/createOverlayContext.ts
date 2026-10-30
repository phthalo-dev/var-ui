import { createContext, useContext, type Context } from 'react';

/**
 * One context per overlay family: a provider and a hook that throws a named error outside the
 * Root. The value should carry the `useOverlayRoot()` result, `portalContainer` and whatever else
 * the family's parts share (`dismissable`, a description id, ...).
 */
export function createOverlayContext<T>(name: string): {
  Context: Context<T | null>;
  use: () => T;
} {
  const Context = createContext<T | null>(null);
  Context.displayName = `${name}Context`;
  return {
    Context,
    use() {
      const value = useContext(Context);
      if (!value) {
        throw new Error(`${name} compound components must be rendered inside <${name}>.`);
      }
      return value;
    },
  };
}
