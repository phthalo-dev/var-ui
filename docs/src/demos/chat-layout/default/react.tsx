import { useState } from 'react';
import {
  Avatar,
  ChatComposer,
  ChatComposerInput,
  ChatLayout,
  ChatMessage,
  ChatMessageBubble,
  ChatMessageList,
  ChatSendButton,
} from '@var-ui/react';

export default function Preview() {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState<string[]>(['Hello! How can I help?']);

  function send(text: string) {
    setMessages((prev) => [...prev, text]);
    setValue('');
  }

  return (
    <div style={{ height: '280px' }}>
      <ChatLayout
        composer={
          <ChatComposer actions={<ChatSendButton onClick={() => send(value)} />}>
            <ChatComposerInput value={value} onValueChange={setValue} onSubmit={send} />
          </ChatComposer>
        }
      >
        <ChatMessageList>
          {messages.map((text, index) => (
            <ChatMessage
              key={`${text}-${index}`}
              sender={index % 2 === 0 ? 'assistant' : 'user'}
              name={index % 2 === 0 ? 'Assistant' : 'You'}
              avatar={<Avatar name={index % 2 === 0 ? 'Assistant' : 'You'} size="sm" />}
            >
              <ChatMessageBubble>{text}</ChatMessageBubble>
            </ChatMessage>
          ))}
        </ChatMessageList>
      </ChatLayout>
    </div>
  );
}
