import { createContext, useContext } from 'react';
import type { ChatMessageListVariantProps, ChatMessageVariantProps } from '@var-ui/core';

/** Message author — the `chatMessage.sender` axis. */
export type ChatSender = NonNullable<ChatMessageVariantProps['sender']>;
/** Message list density — the `chatMessageList.density` axis. */
export type ChatDensity = NonNullable<ChatMessageListVariantProps['density']>;

export type ChatListContextValue = { density: ChatDensity };

export const ChatListContext = createContext<ChatListContextValue | null>(null);

/** Density set by an ancestor `ChatMessageList`, or `null` outside one. */
export function useChatListContext(): ChatListContextValue | null {
  return useContext(ChatListContext);
}

export type ChatMessageContextValue = { sender: ChatSender; density: ChatDensity };

export const ChatMessageContext = createContext<ChatMessageContextValue | null>(null);

/** Sender + density set by an ancestor `ChatMessage`, or `null` outside one. */
export function useChatMessageContext(): ChatMessageContextValue | null {
  return useContext(ChatMessageContext);
}
