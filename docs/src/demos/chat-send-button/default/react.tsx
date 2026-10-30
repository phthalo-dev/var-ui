import { useState } from 'react';
import { ChatSendButton } from '@var-ui/react';

export default function Preview() {
  const [isStreaming, setIsStreaming] = useState(false);

  return (
    <ChatSendButton
      streaming={isStreaming}
      onClick={() => setIsStreaming(true)}
      onStop={() => setIsStreaming(false)}
    />
  );
}
