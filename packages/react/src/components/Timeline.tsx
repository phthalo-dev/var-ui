import type { JSX, ReactNode } from 'react';
import { Children, cloneElement, createContext, isValidElement, useContext } from 'react';
import {
  iconNameList,
  timeline,
  type IconName,
  type Tone,
  type TimelineVariantProps,
} from '@var-ui/core';
import { Icon } from '../icons';
import { mergeProps } from './utils';

export type { TimelineSize } from '@var-ui/core';

export type TimelineItemData = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  timestamp?: ReactNode;
  icon?: IconName | Exclude<ReactNode, string>;
  tone?: Tone;
};

type TimelineContextValue = TimelineVariantProps & {
  activeIndex?: number;
};

const TimelineContext = createContext<TimelineContextValue | null>(null);

function isIconName(value: unknown): value is IconName {
  return typeof value === 'string' && (iconNameList as readonly string[]).includes(value);
}

function useTimelineContext(): TimelineContextValue {
  const context = useContext(TimelineContext);
  if (context == null) {
    throw new Error('Timeline.Item must be used within Timeline.');
  }
  return context;
}

function renderBulletContent(
  icon: IconName | Exclude<ReactNode, string> | undefined,
  bullet: ReactNode | undefined,
): ReactNode {
  if (bullet != null && bullet !== false) return bullet;
  if (icon == null || icon === false) return null;
  return isIconName(icon) ? <Icon name={icon} size="sm" /> : icon;
}

export type TimelineProps = TimelineVariantProps & {
  /** Index of the last active item (inclusive). Later items render as pending. */
  activeIndex?: number;
  items?: TimelineItemData[];
  children?: ReactNode;
  className?: string;
};

export type TimelineItemProps = {
  title: ReactNode;
  description?: ReactNode;
  timestamp?: ReactNode;
  icon?: IconName | Exclude<ReactNode, string>;
  bullet?: ReactNode;
  tone?: Tone;
  children?: ReactNode;
  className?: string;
  index?: number;
  isActive?: boolean;
  isPending?: boolean;
};

function TimelineItemContent({
  title,
  description,
  timestamp,
  icon,
  bullet,
  tone: toneProp,
  children,
  className,
  index = 0,
  isActive = true,
  isPending = false,
}: TimelineItemProps): JSX.Element {
  const { size = 'md', tone: groupTone = 'accent' } = useTimelineContext();
  const tone = toneProp ?? groupTone;
  const styles = timeline({ size, tone });
  const bulletContent = renderBulletContent(icon, bullet);

  return (
    <li
      {...mergeProps(styles.item, className)}
      data-timeline-item={index}
      data-active={isActive ? '' : undefined}
      data-pending={isPending ? '' : undefined}
    >
      <div
        {...mergeProps(styles.bullet)}
        data-active={isActive ? '' : undefined}
        data-pending={isPending ? '' : undefined}
        data-tone={tone}
        aria-hidden={bulletContent == null ? true : undefined}
      >
        {bulletContent}
      </div>
      <div {...mergeProps(styles.body)}>
        <div {...mergeProps(styles.title)}>{title}</div>
        {timestamp != null ? <div {...mergeProps(styles.timestamp)}>{timestamp}</div> : null}
        {description != null ? <div {...mergeProps(styles.description)}>{description}</div> : null}
        {children}
      </div>
    </li>
  );
}

/**
 * Vertical activity feed with bullets and connecting lines.
 *
 * ```tsx
 * <Timeline activeIndex={1}>
 *   <Timeline.Item title="Created" timestamp="2h ago">…</Timeline.Item>
 * </Timeline>
 * ```
 */
export function Timeline({
  activeIndex,
  size = 'md',
  tone = 'accent',
  items,
  children,
  className,
}: TimelineProps): JSX.Element {
  const styles = timeline({ size, tone });
  const contextValue: TimelineContextValue = { size, tone, activeIndex };

  const itemNodes =
    items?.map((item, index) => {
      const isActive = activeIndex == null || index <= activeIndex;
      const isPending = activeIndex != null && index > activeIndex;
      return (
        <TimelineItemContent
          key={item.id}
          index={index}
          title={item.title}
          description={item.description}
          timestamp={item.timestamp}
          icon={item.icon}
          tone={item.tone}
          isActive={isActive}
          isPending={isPending}
        />
      );
    }) ?? null;

  const enhancedChildren =
    children != null
      ? Children.map(children, (child, index) => {
          if (!isValidElement<TimelineItemProps>(child)) return child;
          const isActive = activeIndex == null || index <= activeIndex;
          const isPending = activeIndex != null && index > activeIndex;
          return cloneElement(child, { index, isActive, isPending });
        })
      : null;

  return (
    <TimelineContext.Provider value={contextValue}>
      <ol {...mergeProps(styles.root, className)} data-timeline>
        {enhancedChildren ?? itemNodes}
      </ol>
    </TimelineContext.Provider>
  );
}

/** One row in a `Timeline`. */
export function TimelineItem(props: TimelineItemProps): JSX.Element {
  return <TimelineItemContent {...props} />;
}

Timeline.Item = TimelineItem;
