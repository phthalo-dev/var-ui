import {
  useCallback,
  useRef,
  type ComponentPropsWithRef,
  type JSX,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react';
import { chatLayout } from '@var-ui/core/components/chat/chatLayout';
import { Button } from '../Button';
import { Icon } from '../../icons';
import { useChatStreamScroll } from '../../chat/useChatStreamScroll';
import { useChatNewMessages } from '../../chat/useChatNewMessages';
import { mergeProps } from 'typestyles';

export type ChatLayoutProps = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'className' | 'ref'
> & {
  /** Message content — typically `ChatMessageList`. */
  children: ReactNode;
  /** Composer element, fixed to the bottom dock — typically `ChatComposer`. */
  composer: ReactNode;
  /** Content shown when `children` is empty. */
  emptyState?: ReactNode;
  /**
   * Scroll-to-bottom button rendered above the composer. Defaults to a
   * built-in button wired to `useChatStreamScroll`/`useChatNewMessages`.
   * Pass a custom node to override, or `null` to hide.
   */
  scrollButton?: ReactNode | null;
  /** External scroll container. When omitted, the message area itself scrolls. */
  scrollRef?: RefObject<HTMLElement | null>;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /** Ref to the underlying root `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

function hasVisibleContent(children: ReactNode): boolean {
  if (children == null || children === false) {
    return false;
  }
  return !(Array.isArray(children) && children.length === 0);
}

/**
 * Layout shell for a full chat interface: scrollable messages above a
 * sticky composer dock, with a default "scroll to bottom / new messages"
 * button.
 *
 * ```tsx
 * <ChatLayout composer={<ChatComposer>…</ChatComposer>}>
 *   <ChatMessageList streaming={isStreaming}>…</ChatMessageList>
 * </ChatLayout>
 * ```
 */
export function ChatLayout({
  children,
  composer,
  emptyState,
  scrollButton,
  scrollRef: externalScrollRef,
  className,
  ref,
  ...rest
}: ChatLayoutProps): JSX.Element {
  const messageAreaRef = useRef<HTMLElement | null>(null);
  const scrollContainerRef = externalScrollRef ?? messageAreaRef;
  const l = chatLayout();

  const scroll = useChatStreamScroll({ scrollRef: scrollContainerRef });
  const newMessages = useChatNewMessages({
    isLocked: scroll.isLocked,
    onResize: scroll.scrollIfLocked,
  });

  const setMessageAreaRef = useCallback(
    (el: HTMLElement | null) => {
      messageAreaRef.current = el;
      newMessages.contentRef(el);
    },
    [newMessages.contentRef],
  );

  const showButton = scroll.isScrolledUp || newMessages.hasNewMessages;
  const defaultButton = showButton ? (
    <Button
      onClick={() => {
        newMessages.dismiss();
        scroll.scrollToBottom();
      }}
    >
      <Icon name="chevronDown" size="sm" />
      {newMessages.hasNewMessages ? 'New messages' : 'Scroll to bottom'}
    </Button>
  ) : null;

  return (
    <div {...rest} {...mergeProps(l.root, className)} ref={ref}>
      <div {...mergeProps(l.messageArea)} ref={setMessageAreaRef}>
        {hasVisibleContent(children) ? children : (emptyState ?? null)}
      </div>
      <div {...mergeProps(l.dock)}>
        {scrollButton === undefined ? defaultButton : scrollButton}
        {composer}
      </div>
    </div>
  );
}
