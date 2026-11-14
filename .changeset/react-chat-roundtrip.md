---
'@var-ui/react': minor
---

Chat fixes from agent-chat usage: `ChatComposerInput` gains a `submitOn` prop (`'enter' | 'mod+enter'`, default `enter`) so ⌘/Ctrl+Enter products keep Enter for newlines; `ChatMessageBubble` supports `variant="subtle"`; `ChatLayout` gains `maxHeight`; `ChatSendButton` gains `loading` (spinner, presses ignored, streaming stop stays pressable); `ChatMessageList` gains a `loading` row rendered inside the log region.
