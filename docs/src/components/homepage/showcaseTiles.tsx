'use client';

import {
  Avatar,
  AvatarGroup,
  Badge,
  Calendar,
  Button,
  ChatComposer,
  ChatComposerInput,
  ChatLayout,
  ChatMessage,
  ChatMessageBubble,
  ChatMessageList,
  ChatSendButton,
  ChatToolCalls,
  Checkbox,
  Code,
  Heading,
  HStack,
  Meter,
  SegmentedControl,
  Slider,
  Stack,
  StatusDot,
  Table,
  Text,
  cx,
} from '@var-ui/react';
import { useState } from 'react';
import { homeBento } from '@/styles/homeBento';

type TileProps = { className?: string };

/** Monthly revenue, relative to the best month (percent of chart height). */
const REVENUE_BARS = [38, 44, 41, 52, 49, 58, 63, 60, 71, 77, 84, 96];

export function RevenueTile({ className }: TileProps) {
  const b = homeBento();
  return (
    <section aria-label="Monthly revenue" className={className}>
      <div className={b.tileHeader.className}>
        <Text eyebrow size="xs" tone="secondary" weight="semibold">
          Monthly revenue
        </Text>
        <Badge tone="success">+12.4%</Badge>
      </div>
      <div className={b.figure.className}>$48,290</div>
      <div aria-hidden="true" className={b.bars.className}>
        {REVENUE_BARS.map((height, index) => (
          <span
            key={index}
            className={b.bar.className}
            data-current={index === REVENUE_BARS.length - 1 || undefined}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <Meter label="Quarter goal" tone="accent" value={82} />
      <Text size="sm" tone="secondary">
        $10.6k to go · 23 days left
      </Text>
    </section>
  );
}

export function PreferencesTile({ className }: TileProps) {
  return (
    <section aria-label="Preferences" className={className}>
      <Heading level={3} size="sm">
        Appearance
      </Heading>
      <SegmentedControl
        aria-label="Color mode"
        defaultValue="system"
        options={[
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
          { value: 'system', label: 'Auto' },
        ]}
      />
      <Slider defaultValue={60} label="Interface density" />
      <Checkbox defaultChecked>Reduce motion</Checkbox>
    </section>
  );
}

export function AgentChatTile({ className }: TileProps) {
  const b = homeBento();
  const [value, setValue] = useState('');
  return (
    <section aria-label="Agent chat" className={cx(className)}>
      <div className={b.tileHeader.className}>
        <HStack align="center" gap="xs">
          <StatusDot aria-label="Online" tone="success" />
          <Heading level={3} size="sm">
            Build agent
          </Heading>
        </HStack>
        <Badge tone="accent">AGENTS.md</Badge>
      </div>
      <div className={b.chat.className}>
        <ChatLayout
          composer={
            <ChatComposer actions={<ChatSendButton onClick={() => setValue('')} />}>
              <ChatComposerInput
                onSubmit={() => setValue('')}
                onValueChange={setValue}
                placeholder="Ask the agent…"
                value={value}
              />
            </ChatComposer>
          }
        >
          <ChatMessageList>
            <ChatMessage sender="user">
              <ChatMessageBubble>
                Our settings page ignores the brand theme. Can you fix it?
              </ChatMessageBubble>
            </ChatMessage>
            <ChatMessage sender="assistant">
              <ChatMessageBubble>
                It uses hand-rolled CSS. I&apos;ll swap it for Var UI components so tokens apply.
              </ChatMessageBubble>
            </ChatMessage>
            <ChatMessage sender="user">
              <ChatMessageBubble>
                Great. Add a billing page with a plan picker too.
              </ChatMessageBubble>
            </ChatMessage>
            <ChatMessage sender="assistant">
              <ChatToolCalls
                calls={[
                  {
                    name: 'var-ui search',
                    status: 'complete',
                    target: 'radio card',
                    duration: '0.2s',
                  },
                  {
                    name: 'write_file',
                    status: 'complete',
                    target: 'Billing.tsx',
                    duration: '1.1s',
                  },
                ]}
              />
              <ChatMessageBubble>
                Done. I used SegmentedControl and Card from <Code nowrap>@var-ui/react</Code>, so it
                follows your theme.
              </ChatMessageBubble>
            </ChatMessage>
            <ChatMessage sender="user">
              <ChatMessageBubble>Perfect, ship it.</ChatMessageBubble>
            </ChatMessage>
          </ChatMessageList>
        </ChatLayout>
      </div>
    </section>
  );
}

/** Fictional team (no real people). */
const MEMBERS = [
  {
    name: 'Maya Okafor',
    email: 'maya@northwind.studio',
    lastActive: 'Now',
    role: 'Owner',
    status: 'Active',
  },
  {
    name: 'Lena Fischer',
    email: 'lena@northwind.studio',
    lastActive: '2h ago',
    role: 'Admin',
    status: 'Active',
  },
  {
    name: 'Theo Marchetti',
    email: 'theo@northwind.studio',
    lastActive: 'Invited Mon',
    role: 'Editor',
    status: 'Invited',
  },
  {
    name: 'Priya Raman',
    email: 'priya@northwind.studio',
    lastActive: 'Yesterday',
    role: 'Viewer',
    status: 'Active',
  },
  {
    name: 'Jonas Weber',
    email: 'jonas@northwind.studio',
    lastActive: '5m ago',
    role: 'Editor',
    status: 'Active',
  },
];

type Member = (typeof MEMBERS)[number];

export function MembersTile({ className }: TileProps) {
  const b = homeBento();
  return (
    <section aria-label="Team members" className={className}>
      <div className={b.tileHeader.className}>
        <Heading level={3} size="sm">
          Members
        </Heading>
        <Button size="sm">Invite</Button>
      </div>
      <Table<Member>
        columns={[
          { key: 'name', header: 'Name', rowHeader: true },
          { key: 'email', header: 'Email' },
          { key: 'role', header: 'Role' },
          { key: 'lastActive', header: 'Last active' },
          { key: 'status', header: 'Status' },
        ]}
        data={MEMBERS}
        density="compact"
        renderCell={(column, row) => {
          if (column.key === 'name') {
            return (
              <HStack align="center" gap="xs">
                <Avatar name={row.name} size="sm" />
                <span>{row.name}</span>
              </HStack>
            );
          }
          if (column.key === 'status') {
            return (
              <Badge tone={row.status === 'Active' ? 'success' : 'warning'}>{row.status}</Badge>
            );
          }
          return row[column.key as keyof Member];
        }}
      />
      <div className={b.tileFooter.className}>
        <Text as="span" size="sm" tone="secondary">
          5 of 12 seats used
        </Text>
        <Button appearance="ghost" size="sm">
          Manage seats
        </Button>
      </div>
    </section>
  );
}

/** Local ISO date (`YYYY-MM-DD`) `days` after today. */
function isoFromToday(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Days from today until the next given weekday (0 = Sunday), at least one day out. */
function daysUntil(weekday: number): number {
  const diff = (weekday - new Date().getDay() + 7) % 7;
  return diff === 0 ? 7 : diff;
}

const LAUNCH_EVENTS = [
  { time: '09:30', title: 'Design review', tone: 'accent' as const, label: 'Today' },
  { time: '13:00', title: 'Theme freeze', tone: 'warning' as const, label: 'Fri' },
  { time: '10:00', title: 'Public launch', tone: 'success' as const, label: 'Mon' },
];

export function LaunchCalendarTile({ className }: TileProps) {
  const b = homeBento();
  return (
    <section aria-label="Launch schedule" className={className}>
      <div className={b.tileHeader.className}>
        <Heading level={3} size="sm">
          Launch week
        </Heading>
        <Badge tone="accent">3 events</Badge>
      </div>
      <div className={b.calendarSplit.className}>
        {/* Today gets the ring; event days get marker dots (listed beside it). */}
        <Calendar
          aria-label="Launch week"
          marked={[isoFromToday(0), isoFromToday(daysUntil(5)), isoFromToday(daysUntil(1))]}
        />
        <ul className={b.agenda.className}>
          {LAUNCH_EVENTS.map((event) => (
            <li key={event.title} className={b.agendaItem.className}>
              <Text as="span" mono size="sm" tone="secondary">
                {event.time}
              </Text>
              <Text as="span" size="sm" weight="semibold">
                {event.title}
              </Text>
              <Badge tone={event.tone}>{event.label}</Badge>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function KudosTile({ className }: TileProps) {
  const b = homeBento();
  return (
    <section aria-label="Team kudos" className={className}>
      <div className={b.tileHeader.className}>
        <Text eyebrow size="xs" tone="secondary" weight="semibold">
          Kudos
        </Text>
        <Badge tone="accent">v2.0 shipped</Badge>
      </div>
      <p className={b.quote.className}>“We re-themed the whole app before lunch.”</p>
      <div className={b.faces.className}>
        <Avatar name="Lena Fischer" size="lg" />
        <Stack gap="none">
          <Text size="sm" weight="semibold">
            Lena Fischer
          </Text>
          <Text size="xs" tone="secondary">
            Design lead · Northwind
          </Text>
        </Stack>
      </div>
      <AvatarGroup max={4}>
        <Avatar name="Maya Okafor" />
        <Avatar name="Theo Marchetti" />
        <Avatar name="Priya Raman" />
        <Avatar name="Jonas Weber" />
        <Avatar name="Sofia Alvarez" />
        <Avatar name="Kenji Mori" />
      </AvatarGroup>
    </section>
  );
}
