import type { JSX, ReactNode, Ref } from 'react';
import { Timestamp, type TimestampProps } from '../Timestamp';
import { HStack } from '../Stack';

export type ChatMessageMetadataProps = {
  /** Passed straight to `Timestamp`. */
  date: TimestampProps['date'];
  /** Passed straight to `Timestamp`. @default relative */
  format?: TimestampProps['format'];
  /** Optional status content shown alongside the timestamp (e.g. "Read"). */
  status?: ReactNode;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /** Ref to the underlying root `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Thin composition of the existing `Timestamp` + optional status content —
 * no dedicated recipe.
 *
 * ```tsx
 * <ChatMessageMetadata date={message.sentAt} status="Read" />
 * ```
 */
export function ChatMessageMetadata({
  date,
  format = 'relative',
  status,
  className,
  ref,
}: ChatMessageMetadataProps): JSX.Element {
  return (
    <HStack gap="xs" align="center" className={className} ref={ref}>
      <Timestamp date={date} format={format} />
      {status}
    </HStack>
  );
}
