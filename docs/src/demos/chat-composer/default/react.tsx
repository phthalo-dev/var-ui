import { useState } from 'react';
import { ChatComposer, ChatComposerInput, ChatSendButton } from '@var-ui/react';

export default function Preview() {
  const [value, setValue] = useState('');

  return (
    <ChatComposer actions={<ChatSendButton onClick={() => setValue('')} />}>
      <ChatComposerInput
        value={value}
        onValueChange={setValue}
        onSubmit={() => setValue('')}
        placeholder="Type a message…"
      />
    </ChatComposer>
  );
}
