import { useCallback, useMemo, useState } from 'react';

export type UseDisclosureResult = {
  /** Whether the disclosure is open. */
  open: boolean;
  /** Sets the state directly; shaped like `onOpenChange` so it can be passed straight through. */
  setOpen: (open: boolean) => void;
  /** `setOpen(true)` */
  show: () => void;
  /** `setOpen(false)` */
  hide: () => void;
  /** Flips the state. */
  toggle: () => void;
};

/**
 * Boolean open/closed state with stable `show`, `hide` and `toggle` callbacks. The result is named
 * after the `open` prop, so it spreads into any overlay.
 *
 * ```tsx
 * const d = useDisclosure();
 *
 * <Button onClick={d.show}>Edit</Button>
 * <Dialog open={d.open} onOpenChange={d.setOpen} title="Edit" description="Rename the workstream">
 *   <input />
 * </Dialog>
 * ```
 */
export function useDisclosure(initial = false): UseDisclosureResult {
  const [open, setOpen] = useState(initial);
  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((current) => !current), []);
  return useMemo(() => ({ open, setOpen, show, hide, toggle }), [open, show, hide, toggle]);
}
