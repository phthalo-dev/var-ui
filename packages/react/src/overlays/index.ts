export {
  createOverlayChangeDetails,
  inferOverlayCloseReason,
  type OverlayChangeEventDetails,
  type OverlayOpenChangeHandler,
  type OverlayOpenChangeReason,
} from './changeEvent';
export { mergeOverlayChild } from './mergeOverlayChild';
export { OverlayCloseContext, useOverlayClose } from './OverlayCloseContext';
export {
  type OverlayPresenceAttrs,
  useOverlayPresence,
  type UseOverlayPresenceOptions,
  type UseOverlayPresenceResult,
} from './useOverlayPresence';
export {
  type OverlayPlacement,
  usePositionerVars,
  type UsePositionerVarsOptions,
  type UsePositionerVarsResult,
} from './usePositionerVars';
export { useMergedRef } from './useMergedRef';
export type { OverlayCloseProps, OverlayTriggerProps } from './types';
