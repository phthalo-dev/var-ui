import type { ComponentPropsWithRef, CSSProperties, JSX, ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import {
  Button as AriaButton,
  Text,
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  UNSTABLE_ToastRegion as AriaToastRegion,
} from 'react-aria-components';
import { type VariantOptions } from 'typestyles';
import { toastPlacement } from '@var-ui/core/shared/variantAxes';
import { toast as toastRecipe, toastOffsetVar } from '@var-ui/core/components/toast';
import type { ToastVariantProps } from '@var-ui/core';
import { Icon } from '../icons';
import { useMergedRef } from '../overlays/useMergedRef';
import { useMountedWhileAnimating } from '../overlays/useMountedWhileAnimating';
import { isPopoverShowing } from '../overlays/usePopoverElement';
import { keepOnTop } from '../toast/repromote';
import { toneIcon } from '../internal/toneIcon';
import {
  DEFAULT_TOAST_DURATION,
  registerToastQueue,
  unregisterToastQueue,
} from '../toast/imperativeToast';
import { frozenToastQueue, ToastQueue } from '../toast/toastQueue';
import type { ToastContentData } from '../toast/types';
import { mergeProps } from 'typestyles';

export type ToastPlacement = VariantOptions<typeof toastPlacement>;
export type { ToastContentData } from '../toast/types';
export {
  createToaster,
  toast,
  type ImperativeToast,
  type Toaster,
  type ToastShowInput,
} from '../toast/imperativeToast';
export { ToastQueue } from '../toast/toastQueue';

const DEFAULT_MAX = 3;

type Length = number | string;

/**
 * Distance of the region from the screen edges it is anchored to. A number is px. `block` is the
 * top or bottom edge, `inline` the start or end edge (unused by the `*-center` placements). A
 * single value applies to both.
 */
export type ToastOffset = Length | { block?: Length; inline?: Length };

const toLength = (value: Length | undefined) =>
  value === undefined ? undefined : typeof value === 'number' ? `${value}px` : value;

/** `offset` as the `--var-ui-toast-offset-*` custom properties (also settable from any CSS). */
function offsetStyle(offset: ToastOffset | undefined): CSSProperties | undefined {
  if (offset === undefined) return undefined;
  const { block, inline } = typeof offset === 'object' ? offset : { block: offset, inline: offset };
  const style: Record<string, string> = {};
  const b = toLength(block);
  const i = toLength(inline);
  if (b !== undefined) style[toastOffsetVar.block] = b;
  if (i !== undefined) style[toastOffsetVar.inline] = i;
  return Object.keys(style).length > 0 ? (style as CSSProperties) : undefined;
}

type ToastContextValue = {
  queue: ToastQueue;
  placement: ToastPlacement;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export type ToastProps = Omit<ComponentPropsWithRef<'div'>, 'title' | 'children'> &
  Pick<ToastVariantProps, 'tone' | 'appearance'> & {
    /** Bold headline shown in the toast body. */
    title: string;
    /** Supporting copy shown below the title. */
    description?: string;
    /** When provided, renders a dismiss button that calls this handler on press. */
    onDismiss?: () => void;
    /** Accessible label for the dismiss button. @default Dismiss */
    dismissLabel?: string;
  };

/**
 * Presentational toast chrome, usable standalone or inside a `ToastRegion` render prop.
 *
 * ```tsx
 * <Toast tone="success" title="Saved" description="Draft stored." onDismiss={hide} />
 * ```
 */
export function Toast({
  tone = 'info',
  appearance = 'subtle',
  title,
  description,
  onDismiss,
  dismissLabel = 'Dismiss',
  className,
  role = 'status',
  ...rest
}: ToastProps): JSX.Element {
  const t = toastRecipe({ tone, appearance });
  return (
    <div {...rest} {...mergeProps(t.item, className)} role={role}>
      <span {...mergeProps(t.icon)}>
        <Icon name={toneIcon[tone]} />
      </span>
      <div {...mergeProps(t.body)}>
        <div {...mergeProps(t.title)}>{title}</div>
        {description ? <div {...mergeProps(t.description)}>{description}</div> : null}
      </div>
      {onDismiss ? (
        <AriaButton {...mergeProps(t.close)} aria-label={dismissLabel} onPress={onDismiss}>
          <Icon name="close" size="sm" />
        </AriaButton>
      ) : null}
    </div>
  );
}

export type ToastRegionProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  /** The toast queue to display. Construct one with `new ToastQueue()` for a declarative, provider-free setup. */
  queue: ToastQueue;
  /** Screen corner or edge center the region anchors to. @default bottom-end */
  placement?: ToastPlacement;
  /** Distance from the anchored edges, e.g. `{ block: 'var(--player-height)' }` above a bottom bar. */
  offset?: ToastOffset;
  /** Accessible label for each toast's dismiss button. @default Dismiss */
  dismissLabel?: string;
};

/**
 * Renders the live queue of toasts anchored to a screen corner. Always bound to a queue —
 * either one owned by `ToastProvider` or one constructed and passed in directly.
 */
export function ToastRegion({
  queue,
  placement = 'bottom-end',
  offset,
  dismissLabel = 'Dismiss',
  className,
  style,
  ref,
  ...rest
}: ToastRegionProps): JSX.Element {
  const region = toastRecipe({ placement });
  const elRef = useRef<HTMLDivElement | null>(null);

  // react-aria mounts its region only while the queue is non-empty, which would remove the last
  // toast with no exit. So the region stays mounted (rendering a frozen copy of the toasts that
  // just left) until the popover's CSS exit has finished: `open` follows the live queue, the
  // popover is shown/hidden with it, and `useMountedWhileAnimating` unmounts afterwards.
  const visible = useSyncExternalStore(
    queue.subscribe.bind(queue),
    () => queue.visibleToasts,
    () => queue.visibleToasts,
  );
  const open = visible.length > 0;
  const lastVisible = useRef(visible);
  if (open) lastVisible.current = visible;
  const leaving = useMemo(
    () => (open ? null : frozenToastQueue(lastVisible.current)),
    [open, queue],
  );

  // The attribute is set here because react-aria's region does not forward `popover`. Mounting
  // shows the popover (first paint runs the enter transition).
  const popoverRef = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    el.setAttribute('popover', 'manual');
    if (!isPopoverShowing(el)) el.showPopover();
    return keepOnTop(el);
  }, []);
  const mergedRef = useMergedRef<HTMLDivElement>(ref, popoverRef, elRef);

  // Must run before `useMountedWhileAnimating`'s effect: hiding starts the exit it then waits for;
  // showing again (a toast arrived mid-exit) reverses it.
  useLayoutEffect(() => {
    const el = elRef.current;
    if (!el) return;
    if (open && !isPopoverShowing(el)) el.showPopover();
    else if (!open && isPopoverShowing(el)) el.hidePopover();
  }, [open]);
  const mounted = useMountedWhileAnimating(elRef, open);
  if (!mounted && !open) return <></>;

  return (
    <AriaToastRegion
      {...rest}
      queue={leaving ?? queue}
      {...mergeProps(region.region, className)}
      style={{ ...offsetStyle(offset), ...style }}
      inert={open ? undefined : true}
      ref={mergedRef}
    >
      {({ toast: queued }) => {
        const tone = queued.content.tone ?? 'info';
        const t = toastRecipe({ tone });
        return (
          <AriaToast toast={queued} {...mergeProps(t.item)}>
            <span {...mergeProps(t.icon)}>
              <Icon name={toneIcon[tone]} />
            </span>
            <AriaToastContent {...mergeProps(t.body)}>
              <Text slot="title" {...mergeProps(t.title)}>
                {queued.content.title}
              </Text>
              {queued.content.description ? (
                <Text slot="description" {...mergeProps(t.description)}>
                  {queued.content.description}
                </Text>
              ) : null}
            </AriaToastContent>
            <AriaButton
              {...mergeProps(t.close)}
              aria-label={dismissLabel}
              onPress={() => queue.close(queued.key)}
            >
              <Icon name="close" size="sm" />
            </AriaButton>
          </AriaToast>
        );
      }}
    </AriaToastRegion>
  );
}

export type ToastProviderProps = Pick<
  ToastRegionProps,
  'placement' | 'offset' | 'dismissLabel' | 'className' | 'style'
> & {
  children: ReactNode;
  /**
   * Maximum number of toasts visible at once; older toasts queue behind this limit. With your own
   * `queue`, the queue's limit applies unless you pass this. @default 3
   */
  maxVisibleToasts?: number;
  /**
   * Use a queue you created (`new ToastQueue()`) instead of an internal one, so code outside React
   * can also reach it with `createToaster(queue)`. `toast()` targets it while the provider is mounted.
   */
  queue?: ToastQueue;
};

/**
 * Owns a toast queue and mounts the `ToastRegion` for the subtree. Pair with `useToast()` to
 * push notifications from anywhere below.
 *
 * ```tsx
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 * ```
 */
export function ToastProvider({
  children,
  placement = 'bottom-end',
  maxVisibleToasts,
  queue: ownQueue,
  ...regionProps
}: ToastProviderProps): JSX.Element {
  // Created once so changing `maxVisibleToasts` keeps the toasts on screen; the limit is applied to
  // the live queue instead.
  const [internalQueue] = useState(
    () => new ToastQueue({ maxVisibleToasts: maxVisibleToasts ?? DEFAULT_MAX }),
  );
  const queue = ownQueue ?? internalQueue;
  // An app's own queue keeps its own limit unless the prop says otherwise.
  const limit = maxVisibleToasts ?? (ownQueue ? undefined : DEFAULT_MAX);
  useEffect(() => {
    if (limit !== undefined) queue.setMaxVisible(limit);
  }, [queue, limit]);
  const value = useMemo(() => ({ queue, placement }), [queue, placement]);

  useEffect(() => {
    registerToastQueue(queue);
    return () => unregisterToastQueue(queue);
  }, [queue]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastRegion {...regionProps} queue={queue} placement={placement} />
    </ToastContext.Provider>
  );
}

export type UseToastReturn = {
  /** Enqueues a toast; returns its id. Auto-dismisses after `durationMs` (default 4000ms; pass 0 to disable). */
  add: (content: ToastContentData & { durationMs?: number }) => string;
  /** Dismisses a toast by id ahead of its timeout. */
  dismiss: (id: string) => void;
};

/** Push toasts into the nearest `ToastProvider`'s queue. Throws when rendered outside one. */
export function useToast(): UseToastReturn {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return {
    add: ({ durationMs = DEFAULT_TOAST_DURATION, ...content }) =>
      ctx.queue.add(content, {
        timeout: durationMs === 0 ? undefined : durationMs,
      }),
    dismiss: (id) => ctx.queue.close(id),
  };
}
