import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';

const layerVarDefinitions = {
  /** Stacking level for one floating layer. React `useLayer` assigns this per mount. */
  zIndex: { ...atProperty.integer, value: '0' },
} as const;

/**
 * Registers the shared stacking variable. Recipes set `z-index` through
 * {@link layerZIndex}; runtime callers override `layerStack.vars.zIndex`.
 */
export const layerStack = typestyles.recipe({
  name: 'layer-stack',
  layer: 'components',
  vars: layerVarDefinitions,
  styles: ({ vars }) => {
    return {
      base: {
        zIndex: vars.zIndex.var,
      },
    };
  },
});

/** `z-index` driven by {@link layerStack}, with a stylesheet fallback when nothing assigns it. */
export function layerZIndex(fallback: string): { zIndex: string; [name: string]: string } {
  return {
    zIndex: layerStack.vars.zIndex.var,
    [layerStack.vars.zIndex.name]: fallback,
  };
}
