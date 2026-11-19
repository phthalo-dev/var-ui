import { ChatMessage, ChatMessageBubble, Prose, proseComponents } from '@var-ui/react';

// What a markdown renderer emits for a short agent reply, mapped through `proseComponents`
// the way react-markdown does with `components={proseComponents}`.
const { pre: Pre, code: Code, a: A } = proseComponents;

export default function Preview() {
  return (
    <ChatMessage sender="assistant">
      <ChatMessageBubble>
        <Prose density="compact">
          <h3>Build fixed</h3>
          <p>
            The failure came from a stale <Code>dist</Code> folder. I rebuilt core and the tests
            pass again:
          </p>
          <Pre>
            <Code className="language-sh">{'vp run build\nvp test run\n'}</Code>
          </Pre>
          <ul>
            <li>2,642 tests passed</li>
            <li>
              See the <A href="#">CI run</A> for details
            </li>
          </ul>
        </Prose>
      </ChatMessageBubble>
    </ChatMessage>
  );
}
