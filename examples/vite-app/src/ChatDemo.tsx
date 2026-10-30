import { useState } from 'react';
import {
  Avatar,
  ChatComposer,
  ChatComposerInput,
  ChatLayout,
  ChatMessage,
  ChatMessageBubble,
  ChatMessageList,
  ChatMessageMetadata,
  ChatSendButton,
  ChatSystemMessage,
  ChatToolCalls,
} from '@var-ui/react';

type DemoMessage = {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  toolCalls?: { name: string; status: 'complete' | 'running'; target?: string }[];
};

const ASSISTANT_REPLY =
  'Sure — I found the file, updated the export, and reran the test suite. Everything passes.';

function tokenize(text: string): string[] {
  return text.split(/(\s+)/);
}

export function ChatDemo() {
  const [messages, setMessages] = useState<DemoMessage[]>([
    { id: 'm1', sender: 'user', text: 'Can you add a Divider export to the react package?' },
  ]);
  const [draft, setDraft] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState('');

  function handleSubmit(value: string) {
    const userMessage: DemoMessage = { id: crypto.randomUUID(), sender: 'user', text: value };
    setMessages((prev) => [...prev, userMessage]);
    setDraft('');
    startAssistantReply();
  }

  function startAssistantReply() {
    setIsStreaming(true);
    setStreamedText('');
    const tokens = tokenize(ASSISTANT_REPLY);
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setStreamedText(tokens.slice(0, index).join(''));
      if (index >= tokens.length) {
        clearInterval(interval);
        setIsStreaming(false);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            sender: 'assistant',
            text: ASSISTANT_REPLY,
            toolCalls: [
              { name: 'read_file', status: 'complete', target: 'Divider.tsx' },
              { name: 'run_tests', status: 'complete', target: 'yarn test' },
            ],
          },
        ]);
      }
    }, 40);
  }

  return (
    <div style={{ height: '420px', border: '1px solid var(--var-ui-color-border-default)' }}>
      <ChatLayout
        composer={
          <ChatComposer
            actions={
              <ChatSendButton
                streaming={isStreaming}
                onClick={() => {
                  const trimmed = draft.trim();
                  if (trimmed) {
                    handleSubmit(trimmed);
                  }
                }}
              />
            }
          >
            <ChatComposerInput
              value={draft}
              onValueChange={setDraft}
              onSubmit={handleSubmit}
              disabled={isStreaming}
            />
          </ChatComposer>
        }
      >
        <ChatMessageList streaming={isStreaming}>
          <ChatSystemMessage tone="info">Model: demo-assistant-1</ChatSystemMessage>
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              sender={message.sender}
              name={message.sender === 'user' ? 'You' : 'Assistant'}
              avatar={<Avatar name={message.sender === 'user' ? 'You' : 'Assistant'} size="sm" />}
              metadata={<ChatMessageMetadata date={new Date()} format="time" />}
            >
              <ChatMessageBubble>{message.text}</ChatMessageBubble>
              {message.toolCalls ? <ChatToolCalls calls={message.toolCalls} /> : null}
            </ChatMessage>
          ))}
          {isStreaming ? (
            <ChatMessage
              sender="assistant"
              name="Assistant"
              avatar={<Avatar name="Assistant" size="sm" />}
            >
              <ChatMessageBubble>{streamedText}</ChatMessageBubble>
            </ChatMessage>
          ) : null}
        </ChatMessageList>
      </ChatLayout>
    </div>
  );
}
