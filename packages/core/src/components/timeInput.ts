import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { dateFieldChrome } from './fieldChrome';

/**
 * Segmented time-only field — hour/minute/AM-PM entered as individually
 * focusable segments. No popover, no calendar; the simplest of the
 * date/time cluster. Wraps RAC's `TimeField`.
 *
 * ```tsx
 * const ti = timeInput();
 * <AriaTimeField className={ti.root}>
 *   <Label className={ti.label}>Start time</Label>
 *   <Group className={ti.group}>
 *     <AriaDateInput>{(segment) => <DateSegment segment={segment} className={ti.segment} />}</AriaDateInput>
 *   </Group>
 * </AriaTimeField>
 * ```
 */
export const timeInput = typestyles.recipe(
  'timeInput',
  (c) => {
    const v = c.vars({
      labelColor: { ...atProperty.color, value: t.color.text.primary.var },
      descriptionColor: {
        ...atProperty.color,
        value: t.color.text.secondary.var,
      },
      errorColor: { ...atProperty.color, value: t.color.tone.danger.foreground.var },
      groupBackground: {
        ...atProperty.color,
        value: t.color.background.surface.var,
      },
      groupBorder: { ...atProperty.color, value: t.color.border.default.var },
      segmentColor: { ...atProperty.color, value: t.color.text.primary.var },
      segmentPlaceholderColor: {
        ...atProperty.color,
        value: t.color.text.secondary.var,
      },
    });
    const chrome = dateFieldChrome({
      label: v.labelColor.var,
      description: v.descriptionColor.var,
      error: v.errorColor.var,
      groupBackground: v.groupBackground.var,
      groupBorder: v.groupBorder.var,
      groupFocusBorder: v.groupBorder.name,
      segmentColor: v.segmentColor.var,
      segmentPlaceholderColor: v.segmentPlaceholderColor.var,
    });
    return {
      slots: ['root', 'label', 'description', 'error', 'group', 'segment'],
      root: { ...chrome.root, minWidth: '160px' },
      label: chrome.label,
      description: chrome.description,
      error: chrome.error,
      group: chrome.group,
      segment: chrome.segment,
    };
  },
  { layer: 'components' },
);
