import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';

/**
 * Geometry for floating popups. Popover, menu, tooltip, and hover card read
 * these. React `usePositionerVars` writes the runtime values on `positioner.vars`.
 */
const positionerVarDefinitions = {
  availableHeight: { syntax: '*', value: 'none' },
  availableWidth: { syntax: '*', value: 'none' },
  transformOrigin: { syntax: '*', value: 'center' },
  anchorWidth: { ...atProperty.length, value: '0px' },
} as const;

/** Registers the shared positioner custom properties. */
export const positioner = typestyles.recipe({
  name: 'positioner',
  layer: 'components',
  vars: positionerVarDefinitions,
  styles: () => {
    return {
      base: {},
    };
  },
});
