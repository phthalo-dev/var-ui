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
export const timeInput = typestyles.recipe({
  name: 'timeInput',
  layer: 'components',
  slots: ['root', 'label', 'description', 'error', 'group', 'segment'],
  vars: {
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
  },
  styles: ({ vars }) => {
    const chrome = dateFieldChrome({
      label: vars.labelColor.var,
      description: vars.descriptionColor.var,
      error: vars.errorColor.var,
      groupBackground: vars.groupBackground.var,
      groupBorder: vars.groupBorder.var,
      groupFocusBorder: vars.groupBorder.name,
      segmentColor: vars.segmentColor.var,
      segmentPlaceholderColor: vars.segmentPlaceholderColor.var,
    });
    return {
      base: {
        root: { ...chrome.root, minWidth: '160px' },
        label: chrome.label,
        description: chrome.description,
        error: chrome.error,
        group: chrome.group,
        segment: chrome.segment,
      },
    };
  },
});
