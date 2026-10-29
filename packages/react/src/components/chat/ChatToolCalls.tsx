import { useState, type JSX, type KeyboardEvent, type ReactNode, type Ref } from 'react';
import { chatToolCalls } from '@var-ui/core/components/chat/chatToolCalls';
import { Icon } from '../../icons';
import { Spinner } from '../Spinner';
import { mergeProps } from 'typestyles';

export type ChatToolCallStatus = 'pending' | 'running' | 'complete' | 'error';

export type ChatToolCallItem = {
  /** Tool/function name. */
  name: string;
  /** Current execution status. @default complete */
  status?: ChatToolCallStatus;
  /** The target of the action (e.g. "Button.tsx", "yarn test"). */
  target?: string;
  /** Duration string (e.g. "1.2s"). Shown when complete. */
  duration?: string;
  /** Inline detail content shown when the row is expanded (e.g. a diff or command output). */
  resultDetail?: ReactNode;
};

export type ChatToolCallsProps = {
  /** Tool call data — mirrors the shape LLM APIs (Vercel AI SDK, Anthropic, OpenAI) return. */
  calls: ChatToolCallItem[];
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /** Ref to the underlying root `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

function StatusIcon({ status }: { status: ChatToolCallStatus }) {
  if (status === 'running') {
    return <Spinner size="sm" label="Running" />;
  }
  if (status === 'pending') {
    return <Icon name="clock" size="sm" />;
  }
  return <Icon name={status === 'error' ? 'close' : 'check'} size="sm" />;
}

function ToolCallRow({ call }: { call: ChatToolCallItem }) {
  const status = call.status ?? 'complete';
  const [isOpen, setIsOpen] = useState(false);
  const hasDetail = call.resultDetail != null;
  const t = chatToolCalls({ status });

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen((prev) => !prev);
    }
  }

  return (
    <div>
      <div
        role={hasDetail ? 'button' : undefined}
        tabIndex={hasDetail ? 0 : undefined}
        aria-expanded={hasDetail ? isOpen : undefined}
        onClick={hasDetail ? () => setIsOpen((prev) => !prev) : undefined}
        onKeyDown={hasDetail ? handleKeyDown : undefined}
        {...mergeProps(t.header)}
      >
        <span {...mergeProps(t.statusIcon)}>
          <StatusIcon status={status} />
        </span>
        <span {...mergeProps(t.name)}>{call.name}</span>
        {call.target ? <span {...mergeProps(t.target)}>{call.target}</span> : null}
        {call.duration && status === 'complete' ? (
          <span {...mergeProps(t.duration)}>{call.duration}</span>
        ) : null}
      </div>
      {hasDetail && isOpen ? <div {...mergeProps(t.detail)}>{call.resultDetail}</div> : null}
    </div>
  );
}

/**
 * Displays tool/function call invocations from an LLM response. A single
 * call renders inline; 2+ calls collapse into an expandable summary group.
 *
 * ```tsx
 * <ChatToolCalls calls={message.toolCalls.map((tc) => ({ name: tc.toolName, status: tc.state }))} />
 * ```
 */
export function ChatToolCalls({ calls, className, ref }: ChatToolCallsProps): JSX.Element | null {
  const [isExpanded, setIsExpanded] = useState(false);

  if (calls.length === 0) {
    return null;
  }

  const classes = chatToolCalls({ expanded: isExpanded });

  if (calls.length === 1) {
    return (
      <div {...mergeProps(classes.root, className)} ref={ref}>
        <ToolCallRow call={calls[0]} />
      </div>
    );
  }

  const latest = calls[calls.length - 1];

  return (
    <div {...mergeProps(classes.root, className)} ref={ref}>
      <button
        type="button"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded((prev) => !prev)}
        {...mergeProps(classes.header)}
      >
        <span {...mergeProps(classes.statusIcon)}>
          <Icon name="wrench" size="sm" />
        </span>
        <span {...mergeProps(classes.name)}>
          {isExpanded ? `${calls.length} tool calls` : latest.name}
        </span>
        <span {...mergeProps(classes.chevron)}>
          <Icon name="chevronDown" size="sm" />
        </span>
      </button>
      {isExpanded ? (
        <div {...mergeProps(classes.list)}>
          {calls.map((call, index) => (
            <ToolCallRow key={`${call.name}-${index}`} call={call} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
