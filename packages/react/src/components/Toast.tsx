import type { JSX, ReactNode, Ref } from 'react';
import { createContext, useContext, useEffect, useMemo } from 'react';
import {
  Button as AriaButton,
  Text,
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  UNSTABLE_ToastRegion as AriaToastRegion,
} from 'react-aria-components';
import { type ComponentAttrsResult, type VariantOptions } from 'typestyles';
import {
  placement as toastPlacement,
  toast as toastRecipe,
  type IconName,
  type ToastVariantProps,
  type Tone,
} from '@var-ui/core';
import { Icon } from '../icons';
import { useLayer } from '../layers/LayerProvider';
import { registerToastQueue, unregisterToastQueue } from '../toast/imperativeToast';
import { ToastQueue } from '../toast/toastQueue';
import type { ToastContentData } from '../toast/types';
import { mergeProps } from 'typestyles';

export type ToastPlacement = VariantOptions<typeof toastPlacement>;
export type { ToastContentData } from '../toast/types';
export { toast, type ImperativeToast, type ToastShowInput } from '../toast/imperativeToast';
export { ToastQueue } from '../toast/toastQueue';

const toneIcon: Record<Tone, IconName> = {
  neutral: 'info',
  accent: 'info',
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
};

const DEFAULT_DURATION = 4000;
const DEFAULT_MAX = 3;

type ToastSlot = 'region' | 'item' | 'icon' | 'body' | 'title' | 'description' | 'close';
type ToastRecipeFn = (args?: ToastVariantProps) => Record<ToastSlot, ComponentAttrsResult>;
// Slot recipe resolves to flat ComponentAttrsResult at the type level — see packages/core/src/components/toast.ts.
const toastSlots = toastRecipe as unknown as ToastRecipeFn;

type ToastContextValue = {
  queue: ToastQueue;
  placement: ToastPlacement;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export type ToastProps = Pick<ToastVariantProps, 'tone' | 'appearance'> & {
  /** Bold headline shown in the toast body. */
  title: string;
  /** Supporting copy shown below the title. */
  description?: string;
  /** When provided, renders a dismiss button that calls this handler on press. */
  onDismiss?: () => void;
  /** Accessible label for the dismiss button. @default Dismiss */
  dismissLabel?: string;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /** Ref to the underlying root `<div>` element. */
  ref?: Ref<HTMLDivElement>;
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
  ref,
}: ToastProps): JSX.Element {
  const t = toastSlots({ tone, appearance });
  return (
    <div {...mergeProps(t.item, className)} ref={ref} role="status">
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

export type ToastRegionProps = {
  /** The toast queue to display. Construct one with `new ToastQueue()` for a declarative, provider-free setup. */
  queue: ToastQueue;
  /** Screen corner the region anchors to. @default bottom-end */
  placement?: ToastPlacement;
  /** Additional CSS class names merged onto the region element. */
  className?: string;
  /** Ref to the underlying region `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Renders the live queue of toasts anchored to a screen corner. Always bound to a queue —
 * either one owned by `ToastProvider` or one constructed and passed in directly.
 */
export function ToastRegion({
  queue,
  placement = 'bottom-end',
  className,
  ref,
}: ToastRegionProps): JSX.Element {
  const { style: layerStyle } = useLayer();
  const region = toastSlots({ placement });
  return (
    <AriaToastRegion
      queue={queue}
      {...mergeProps(region.region, className)}
      ref={ref}
      style={layerStyle}
    >
      {({ toast: queued }) => {
        const tone = queued.content.tone ?? 'info';
        const t = toastSlots({ tone });
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
              aria-label="Dismiss"
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

export type ToastProviderProps = {
  children: ReactNode;
  /** Screen corner the toast region anchors to. @default bottom-end */
  placement?: ToastPlacement;
  /** Maximum number of toasts visible at once; older toasts queue behind this limit. @default 3 */
  maxVisibleToasts?: number;
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
  maxVisibleToasts = DEFAULT_MAX,
}: ToastProviderProps): JSX.Element {
  const queue = useMemo(() => new ToastQueue({ maxVisibleToasts }), [maxVisibleToasts]);
  const value = useMemo(() => ({ queue, placement }), [queue, placement]);

  useEffect(() => {
    registerToastQueue(queue);
    return () => unregisterToastQueue(queue);
  }, [queue]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastRegion queue={queue} placement={placement} />
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
    add: ({ durationMs = DEFAULT_DURATION, ...content }) =>
      ctx.queue.add(content, {
        timeout: durationMs === 0 ? undefined : durationMs,
      }),
    dismiss: (id) => ctx.queue.close(id),
  };
}
