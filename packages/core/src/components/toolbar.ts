import { typestyles } from '../runtime';
import { controlSizeMetrics, controlSizeVariants } from './controlSize';

/**
 * Layout chrome for a toolbar: a flex (or grid, when `layout: 'grid'`) row of
 * start/center/end slots. Purely visual — no keyboard navigation logic lives
 * here, that's the React wrapper's concern.
 */
export const toolbar = typestyles.recipe(
  'toolbar',
  () => ({
    slots: ['root', 'startSlot', 'centerSlot', 'endSlot'],
    base: {
      root: {
        display: 'flex',
        alignItems: 'center',
      },
      startSlot: {
        display: 'flex',
        alignItems: 'center',
      },
      centerSlot: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 0,
        overflow: 'hidden',
      },
      endSlot: {
        display: 'flex',
        alignItems: 'center',
      },
    },
    variants: {
      size: controlSizeVariants((size) => ({
        root: { gap: controlSizeMetrics[size].gap, minHeight: controlSizeMetrics[size].height },
        startSlot: { gap: controlSizeMetrics[size].gap },
        endSlot: { gap: controlSizeMetrics[size].gap },
      })),
      orientation: {
        horizontal: {},
        vertical: {
          root: { flexDirection: 'column', alignItems: 'stretch' },
        },
      },
      layout: {
        flex: {},
        grid: {
          root: { display: 'grid', gridTemplateColumns: '1fr auto 1fr' },
        },
      },
    },
    defaultVariants: { size: 'md', orientation: 'horizontal', layout: 'flex' },
  }),
  { layer: 'components' },
);
