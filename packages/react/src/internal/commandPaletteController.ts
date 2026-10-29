import { useState, useSyncExternalStore } from 'react';

export type CommandPaletteController = {
  /** Opens the palette. Safe to call from anywhere, including outside React. */
  open: () => void;
  /** Closes the palette. */
  close: () => void;
  /** Toggles the palette. */
  toggle: () => void;
  /** Sets the open state explicitly. */
  setOpen: (open: boolean) => void;
  /** Current open state (for `useSyncExternalStore`). */
  getSnapshot: () => boolean;
  /** Subscribes to open-state changes (for `useSyncExternalStore`). */
  subscribe: (listener: () => void) => () => void;
};

/**
 * Creates an open-state store you can drive from anywhere (event handlers, route loaders,
 * other modules) and hand to `<CommandPalette controller={…} />`.
 */
export function createCommandPalette(initialOpen = false): CommandPaletteController {
  let isOpen = initialOpen;
  const listeners = new Set<() => void>();
  const setOpen = (next: boolean) => {
    if (next === isOpen) return;
    isOpen = next;
    listeners.forEach((listener) => listener());
  };
  return {
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen(!isOpen),
    setOpen,
    getSnapshot: () => isOpen,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

/**
 * Component-scoped {@link createCommandPalette}. The result is a controller you pass to
 * `<CommandPalette controller={…} />`, plus a reactive `isOpen`.
 */
export function useCommandPalette(
  initialOpen = false,
): CommandPaletteController & { isOpen: boolean } {
  const [controller] = useState(() => createCommandPalette(initialOpen));
  const isOpen = useSyncExternalStore(controller.subscribe, controller.getSnapshot, () => false);
  return { ...controller, isOpen };
}
