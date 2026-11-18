import type { JSX, ReactNode } from 'react';
import { card, select } from '@var-ui/core';
import { defaultIcons } from '@var-ui/icons';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Checkbox,
  HStack,
  IconButton,
  IconProvider,
  Kbd,
  Meter,
  ProgressBar,
  RadioGroup,
  SegmentedControl,
  Slider,
  Stack,
  StatusDot,
  Switch,
  Text,
  TextField,
  combine,
  mergeProps,
} from '@var-ui/react';

/**
 * Hero showcases: composed, static vignettes of a component (variety of tones and states), shown
 * in the component page hero. Server-rendered; not the API demos (those live in the page body).
 */
const showcases: Record<string, () => JSX.Element> = {
  button: () => (
    <Stack gap="md" align="center">
      <HStack gap="sm" align="center">
        <Button tone="accent" appearance="filled">
          Deploy
        </Button>
        <Button appearance="outline">Preview</Button>
        <IconButton icon="search" aria-label="Search" appearance="outline" />
      </HStack>
      <HStack gap="sm" align="center">
        <Button tone="success" appearance="subtle" size="sm">
          Approve
        </Button>
        <Button tone="danger" appearance="ghost" size="sm">
          Delete
        </Button>
        <Button tone="accent" appearance="filled" size="sm" pill>
          New
        </Button>
      </HStack>
    </Stack>
  ),
  'icon-button': () => (
    <HStack gap="sm" align="center">
      <IconButton icon="search" aria-label="Search" tone="accent" appearance="filled" />
      <IconButton icon="menu" aria-label="Menu" appearance="outline" />
      <IconButton icon="star" aria-label="Star" tone="warning" appearance="subtle" />
      <IconButton icon="close" aria-label="Close" appearance="ghost" />
    </HStack>
  ),
  checkbox: () => (
    <Stack gap="sm">
      <Checkbox defaultChecked>Email me release notes</Checkbox>
      <Checkbox indeterminate>Some workspaces selected</Checkbox>
      <Checkbox>Share usage data</Checkbox>
    </Stack>
  ),
  switch: () => (
    <Stack gap="sm">
      <Switch defaultChecked>Dark sidebar</Switch>
      <Switch>Compact rows</Switch>
      <Switch defaultChecked disabled>
        Sync settings
      </Switch>
    </Stack>
  ),
  badge: () => (
    <Stack gap="sm" align="center">
      <HStack gap="xs" align="center">
        <Badge tone="accent">Beta</Badge>
        <Badge tone="success">Live</Badge>
        <Badge tone="warning">Review</Badge>
        <Badge tone="danger">Failed</Badge>
      </HStack>
      <HStack gap="xs" align="center">
        <Badge tone="accent" appearance="solid">
          New
        </Badge>
        <Badge appearance="outline">v2.4</Badge>
        <Badge tone="info" appearance="subtle">
          Docs
        </Badge>
      </HStack>
    </Stack>
  ),
  alert: () => (
    <Stack gap="sm">
      <Alert tone="success" title="Deployed">
        Production is running build 2.4.0.
      </Alert>
      <Alert tone="warning" title="Quota at 82%">
        Upgrade before the next billing cycle.
      </Alert>
    </Stack>
  ),
  avatar: () => (
    <HStack gap="sm" align="center">
      <Avatar name="Ada Lovelace" status="success" />
      <Avatar name="Grace Hopper" status="warning" />
      <Avatar name="Alan Turing" />
      <Avatar name="Katherine Johnson" status="danger" />
    </HStack>
  ),
  'progress-bar': () => (
    <Stack gap="md">
      <ProgressBar label="Uploading assets" value={64} />
      <ProgressBar label="Indexing" value={28} />
    </Stack>
  ),
  meter: () => (
    <Stack gap="md">
      <Meter label="Storage used" value={42} />
      <Meter label="Seats" value={88} />
    </Stack>
  ),
  'text-field': () => (
    <Stack gap="md">
      <TextField label="Project name" defaultValue="Var UI docs" />
      <TextField label="Owner" placeholder="name@company.com" description="Gets deploy alerts." />
    </Stack>
  ),
  slider: () => (
    <Stack gap="md">
      <Slider label="Volume" defaultValue={64} />
      <Slider label="Balance" defaultValue={30} />
    </Stack>
  ),
  'segmented-control': () => (
    <Stack gap="md" align="center">
      <SegmentedControl
        aria-label="View"
        defaultValue="grid"
        options={[
          { value: 'list', label: 'List' },
          { value: 'grid', label: 'Grid' },
          { value: 'board', label: 'Board' },
        ]}
      />
      <SegmentedControl
        aria-label="Range"
        size="sm"
        defaultValue="7d"
        options={[
          { value: '24h', label: '24h' },
          { value: '7d', label: '7d' },
          { value: '30d', label: '30d' },
        ]}
      />
    </Stack>
  ),
  'radio-group': () => (
    <RadioGroup
      label="Plan"
      defaultValue="pro"
      options={[
        { value: 'free', label: 'Free' },
        { value: 'pro', label: 'Pro' },
        { value: 'team', label: 'Team' },
      ]}
    />
  ),
  kbd: () => (
    <Stack gap="sm" align="center">
      <Text>
        Search <Kbd>⌘</Kbd> <Kbd>K</Kbd>
      </Text>
      <Text>
        Save <Kbd>⌘</Kbd> <Kbd>S</Kbd> · Close <Kbd>Esc</Kbd>
      </Text>
    </Stack>
  ),
  'status-dot': () => (
    <Stack gap="sm">
      <HStack gap="xs" align="center">
        <StatusDot tone="success" appearance="solid" aria-label="Online" />
        <Text>API online</Text>
      </HStack>
      <HStack gap="xs" align="center">
        <StatusDot tone="warning" appearance="solid" aria-label="Degraded" />
        <Text>Search degraded</Text>
      </HStack>
      <HStack gap="xs" align="center">
        <StatusDot tone="danger" appearance="solid" aria-label="Down" />
        <Text>Webhooks down</Text>
      </HStack>
    </Stack>
  ),
  // Static open listbox: the select trigger with its options panel, from the core recipe.
  select: () => {
    const s = select({});
    const items = ['Apple', 'Plum', 'Mango'];
    return (
      <div {...mergeProps(s.root)} style={{ width: '15rem' }}>
        <span {...mergeProps(s.label)}>Fruit</span>
        <div {...mergeProps(s.trigger)} data-pressed="">
          <span {...mergeProps(s.selectValue)}>Plum</span>
          <span {...mergeProps(s.triggerIcon)} aria-hidden="true">
            ▾
          </span>
        </div>
        {/* A still: the popup's closed-state motion (opacity 0) applies to live popovers only. */}
        <div
          {...mergeProps(s.popover)}
          style={{ position: 'static', marginTop: '0.25rem', opacity: 1, transform: 'none' }}
        >
          <div {...mergeProps(s.listbox)} role="presentation">
            {items.map((item) => (
              <div
                key={item}
                {...mergeProps(s.item)}
                data-selected={item === 'Plum' ? '' : undefined}
                data-focused={item === 'Mango' ? '' : undefined}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
  // Static open dialog: the dialog's own content parts on a card surface, scaled into the plate.
  dialog: () => {
    const c = card();
    return (
      <div {...combine(c.root)} style={{ width: '18rem', gap: '0.75rem' }}>
        <Text weight="semibold" size="lg">
          Delete project?
        </Text>
        <Text tone="secondary">This removes 14 deployments. You can’t undo it.</Text>
        <HStack gap="xs" justify="end">
          <Button appearance="ghost" size="sm">
            Cancel
          </Button>
          <Button tone="danger" appearance="filled" size="sm">
            Delete
          </Button>
        </HStack>
      </div>
    );
  },
};

/** Whether a slug has a composed hero showcase. */
export function hasHeroShowcase(slug: string): boolean {
  return slug in showcases;
}

export default function HeroShowcase({ slug }: { slug: string }): ReactNode {
  const Showcase = showcases[slug];
  if (!Showcase) return null;
  return (
    <IconProvider icons={defaultIcons}>
      <Showcase />
    </IconProvider>
  );
}
