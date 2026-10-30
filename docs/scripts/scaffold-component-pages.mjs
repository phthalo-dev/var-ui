import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pagesDir = join(__dirname, '../src/pages/components');
const demosDir = join(__dirname, '../src/demos');

const AVATAR_URL =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" fill="%236c8"/%3E%3C/svg%3E';

/** Keep in sync with docs/src/data/components.ts */
const components = [
  {
    slug: 'button',
    name: 'Button',
    description: 'Triggers an action or event.',
    importLine: "import { Button } from '@var-ui/react';",
    demoImports: ["import { Button } from '@var-ui/react';"],
    demoReturn: '<Button>Click me</Button>',
    codeExample: "import { Button } from '@var-ui/react';\n\n<Button>Click me</Button>",
  },
  {
    slug: 'link',
    name: 'Link',
    description: 'Navigates to a URL or route.',
    importLine: "import { Link } from '@var-ui/react';",
    demoImports: ["import { Link } from '@var-ui/react';"],
    demoReturn: '<Link href="#">Documentation</Link>',
    codeExample: 'import { Link } from \'@var-ui/react\';\n\n<Link href="#">Documentation</Link>',
  },
  {
    slug: 'text-field',
    name: 'TextField',
    description: 'Single-line text input with label and validation.',
    importLine: "import { TextField } from '@var-ui/react';",
    demoImports: ["import { TextField } from '@var-ui/react';"],
    demoReturn:
      '<TextField label="Project name" description="Shown on the dashboard." placeholder="My project" />',
    codeExample:
      'import { TextField } from \'@var-ui/react\';\n\n<TextField label="Project name" description="Shown on the dashboard." placeholder="My project" />',
  },
  {
    slug: 'text-area-field',
    name: 'TextAreaField',
    description: 'Multi-line text input with label and validation.',
    importLine: "import { TextAreaField } from '@var-ui/react';",
    demoImports: ["import { TextAreaField } from '@var-ui/react';"],
    demoReturn: '<TextAreaField label="Notes" placeholder="Add a note…" />',
    codeExample:
      'import { TextAreaField } from \'@var-ui/react\';\n\n<TextAreaField label="Notes" placeholder="Add a note…" />',
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    description: 'Boolean toggle with label.',
    importLine: "import { Checkbox } from '@var-ui/react';",
    demoImports: ["import { Checkbox } from '@var-ui/react';"],
    demoReturn: '<Checkbox>Accept terms</Checkbox>',
    codeExample: "import { Checkbox } from '@var-ui/react';\n\n<Checkbox>Accept terms</Checkbox>",
  },
  {
    slug: 'switch',
    name: 'Switch',
    description: 'On/off control with label.',
    importLine: "import { Switch } from '@var-ui/react';",
    demoImports: ["import { Switch } from '@var-ui/react';"],
    demoReturn: '<Switch>Enable notifications</Switch>',
    codeExample: "import { Switch } from '@var-ui/react';\n\n<Switch>Enable notifications</Switch>",
  },
  {
    slug: 'radio-group',
    name: 'RadioGroup',
    description: 'Single selection from a list of options.',
    importLine: "import { RadioGroup } from '@var-ui/react';",
    demoImports: ["import { RadioGroup } from '@var-ui/react';"],
    demoReturn: `<RadioGroup
      label="Plan"
      options={[
        { value: 'free', label: 'Free' },
        { value: 'pro', label: 'Pro' },
      ]}
    />`,
    codeExample: `import { RadioGroup } from '@var-ui/react';

<RadioGroup
  label="Plan"
  options={[
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
  ]}
/>`,
  },
  {
    slug: 'select',
    name: 'Select',
    description: 'Dropdown single-select with options.',
    importLine: "import { Select } from '@var-ui/react';",
    demoImports: ["import { Select } from '@var-ui/react';"],
    demoReturn: `<Select
      label="Fruit"
      options={[
        { id: 'apple', label: 'Apple' },
        { id: 'plum', label: 'Plum' },
      ]}
    />`,
    codeExample: `import { Select } from '@var-ui/react';

<Select
  label="Fruit"
  options={[
    { id: 'apple', label: 'Apple' },
    { id: 'plum', label: 'Plum' },
  ]}
/>`,
  },
  {
    slug: 'field',
    name: 'Field',
    description: 'Composable label, description, and error chrome.',
    importLine: "import { Field } from '@var-ui/react';",
    demoImports: ["import { Field } from '@var-ui/react';"],
    demoReturn: `<Field
      label="Custom control"
      description="Any input composes the shared field chrome."
      htmlFor="custom-range"
    >
      <input id="custom-range" type="range" />
    </Field>`,
    codeExample: `import { Field } from '@var-ui/react';

<Field
  label="Custom control"
  description="Any input composes the shared field chrome."
  htmlFor="custom-range"
>
  <input id="custom-range" type="range" />
</Field>`,
  },
  {
    slug: 'alert',
    name: 'Alert',
    description: 'Inline status message with tone variants.',
    importLine: "import { Alert } from '@var-ui/react';",
    demoImports: ["import { Alert } from '@var-ui/react';"],
    demoReturn:
      '<Alert tone="info" title="Registry icons">Alerts pull their tone glyph from IconProvider automatically.</Alert>',
    codeExample:
      'import { Alert } from \'@var-ui/react\';\n\n<Alert tone="info" title="Registry icons">Alerts pull their tone glyph from IconProvider automatically.</Alert>',
  },
  {
    slug: 'badge',
    name: 'Badge',
    description: 'Compact label for counts or status.',
    importLine: "import { Badge } from '@var-ui/react';",
    demoImports: ["import { Badge } from '@var-ui/react';"],
    demoReturn: '<Badge tone="accent">Beta</Badge>',
    codeExample: 'import { Badge } from \'@var-ui/react\';\n\n<Badge tone="accent">Beta</Badge>',
  },
  {
    slug: 'banner',
    name: 'Banner',
    description: 'Full-width page-level announcement.',
    importLine: "import { Banner } from '@var-ui/react';",
    demoImports: ["import { Banner } from '@var-ui/react';"],
    demoReturn: '<Banner tone="success" appearance="solid">Deploy finished in 42s.</Banner>',
    codeExample:
      'import { Banner } from \'@var-ui/react\';\n\n<Banner tone="success" appearance="solid">Deploy finished in 42s.</Banner>',
  },
  {
    slug: 'spinner',
    name: 'Spinner',
    description: 'Indeterminate loading indicator.',
    importLine: "import { Spinner } from '@var-ui/react';",
    demoImports: ["import { Spinner } from '@var-ui/react';"],
    demoReturn: '<Spinner label="Loading results" />',
    codeExample:
      'import { Spinner } from \'@var-ui/react\';\n\n<Spinner label="Loading results" />',
  },
  {
    slug: 'progress-bar',
    name: 'ProgressBar',
    description: 'Determinate progress indicator.',
    importLine: "import { ProgressBar } from '@var-ui/react';",
    demoImports: ["import { ProgressBar } from '@var-ui/react';"],
    demoReturn: '<ProgressBar label="Uploading assets" value={64} />',
    codeExample:
      'import { ProgressBar } from \'@var-ui/react\';\n\n<ProgressBar label="Uploading assets" value={64} />',
  },
  {
    slug: 'empty-state',
    name: 'EmptyState',
    description: 'Placeholder when no data is available.',
    importLine: "import { EmptyState } from '@var-ui/react';",
    demoImports: ["import { Button, EmptyState, Icon } from '@var-ui/react';"],
    demoReturn: `<EmptyState
      icon={<Icon name="search" size="lg" />}
      title="No results"
      description="Try a different filter, or clear the search."
      action={<Button intent="primary">Clear filters</Button>}
    />`,
    codeExample: `import { Button, EmptyState, Icon } from '@var-ui/react';

<EmptyState
  icon={<Icon name="search" size="lg" />}
  title="No results"
  description="Try a different filter, or clear the search."
  action={<Button intent="primary">Clear filters</Button>}
/>`,
  },
  {
    slug: 'dialog',
    name: 'Dialog',
    description: 'Modal overlay for focused tasks.',
    importLine: "import { Dialog } from '@var-ui/react';",
    demoImports: ["import { Dialog } from '@var-ui/react';"],
    demoReturn: `<Dialog
      triggerLabel="Open dialog"
      title="Example dialog"
      description="Modal overlay for focused tasks."
    />`,
    codeExample: `import { Dialog } from '@var-ui/react';

<Dialog
  triggerLabel="Open dialog"
  title="Example dialog"
  description="Modal overlay for focused tasks."
/>`,
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    description: 'Tabbed content panels.',
    importLine: "import { Tabs } from '@var-ui/react';",
    demoImports: ["import { Tabs, Text } from '@var-ui/react';"],
    demoReturn: `<Tabs
      tabs={[
        { id: 'overview', label: 'Overview', content: <Text>First panel content.</Text> },
        { id: 'details', label: 'Details', content: <Text>Second panel content.</Text> },
      ]}
    />`,
    codeExample: `import { Tabs, Text } from '@var-ui/react';

<Tabs
  tabs={[
    { id: 'overview', label: 'Overview', content: <Text>First panel content.</Text> },
    { id: 'details', label: 'Details', content: <Text>Second panel content.</Text> },
  ]}
/>`,
  },
  {
    slug: 'stack',
    name: 'Stack',
    description: 'Flex stack primitive (Stack / HStack).',
    importLine: "import { HStack, Stack } from '@var-ui/react';",
    demoImports: ["import { Button, HStack } from '@var-ui/react';"],
    demoReturn: `<HStack gap="sm">
      <Button intent="secondary">Cancel</Button>
      <Button>Save</Button>
    </HStack>`,
    codeExample: `import { Button, HStack } from '@var-ui/react';

<HStack gap="sm">
  <Button intent="secondary">Cancel</Button>
  <Button>Save</Button>
</HStack>`,
  },
  {
    slug: 'grid',
    name: 'Grid',
    description: 'CSS grid layout primitive.',
    importLine: "import { Grid } from '@var-ui/react';",
    demoImports: ["import { Card, Grid } from '@var-ui/react';"],
    demoReturn: `<Grid columns={2} gap="md">
      <Card title="Static card">Plain content surface.</Card>
      <Card title="Another card">Second grid cell.</Card>
    </Grid>`,
    codeExample: `import { Card, Grid } from '@var-ui/react';

<Grid columns={2} gap="md">
  <Card title="Static card">Plain content surface.</Card>
  <Card title="Another card">Second grid cell.</Card>
</Grid>`,
  },
  {
    slug: 'section',
    name: 'Section',
    description: 'Titled content section.',
    importLine: "import { Section } from '@var-ui/react';",
    demoImports: ["import { Section, Text } from '@var-ui/react';"],
    demoReturn: `<Section title="Example section">
      <Text>Section content goes here.</Text>
    </Section>`,
    codeExample: `import { Section, Text } from '@var-ui/react';

<Section title="Example section">
  <Text>Section content goes here.</Text>
</Section>`,
  },
  {
    slug: 'center',
    name: 'Center',
    description: 'Centers children horizontally and vertically.',
    importLine: "import { Center } from '@var-ui/react';",
    demoImports: ["import { Center, Text } from '@var-ui/react';"],
    demoReturn: `<Center style={{ height: '120px', border: '1px dashed var(--color-border)' }}>
      <Text>Centered</Text>
    </Center>`,
    codeExample: `import { Center, Text } from '@var-ui/react';

<Center style={{ height: '120px', border: '1px dashed var(--color-border)' }}>
  <Text>Centered</Text>
</Center>`,
  },
  {
    slug: 'aspect-ratio',
    name: 'AspectRatio',
    description: 'Maintains a fixed aspect ratio box.',
    importLine: "import { AspectRatio } from '@var-ui/react';",
    demoImports: ["import { AspectRatio } from '@var-ui/react';"],
    demoReturn: `<AspectRatio
      ratio={16 / 9}
      style={{ background: 'var(--color-surface-muted)', maxWidth: '320px' }}
    />`,
    codeExample: `import { AspectRatio } from '@var-ui/react';

<AspectRatio
  ratio={16 / 9}
  style={{ background: 'var(--color-surface-muted)', maxWidth: '320px' }}
/>`,
  },
  {
    slug: 'divider',
    name: 'Divider',
    description: 'Visual separator between sections.',
    importLine: "import { Divider } from '@var-ui/react';",
    demoImports: ["import { Divider, Text } from '@var-ui/react';"],
    demoReturn: `<>
      <Text>Above</Text>
      <Divider />
      <Text>Below</Text>
    </>`,
    codeExample: `import { Divider, Text } from '@var-ui/react';

<>
  <Text>Above</Text>
  <Divider />
  <Text>Below</Text>
</>`,
  },
  {
    slug: 'heading',
    name: 'Heading',
    description: 'Semantic heading with design-system typography.',
    importLine: "import { Heading } from '@var-ui/react';",
    demoImports: ["import { Heading } from '@var-ui/react';"],
    demoReturn: '<Heading level={2}>Section title</Heading>',
    codeExample:
      "import { Heading } from '@var-ui/react';\n\n<Heading level={2}>Section title</Heading>",
  },
  {
    slug: 'text',
    name: 'Text',
    description: 'Body text with size and tone variants.',
    importLine: "import { Text } from '@var-ui/react';",
    demoImports: ["import { Text } from '@var-ui/react';"],
    demoReturn: '<Text tone="secondary">Body text with secondary tone.</Text>',
    codeExample:
      'import { Text } from \'@var-ui/react\';\n\n<Text tone="secondary">Body text with secondary tone.</Text>',
  },
  {
    slug: 'code-block',
    name: 'CodeBlock',
    description: 'Syntax-highlighted code display.',
    importLine: "import { CodeBlock } from '@var-ui/react';",
    demoImports: ["import { CodeBlock } from '@var-ui/react';"],
    demoReturn: '<CodeBlock code={\'const greeting = "hello";\'} language="tsx" />',
    codeExample:
      'import { CodeBlock } from \'@var-ui/react\';\n\n<CodeBlock code={\'const greeting = "hello";\'} language="tsx" />',
  },
  {
    slug: 'timestamp',
    name: 'Timestamp',
    description: 'Formatted date/time display.',
    importLine: "import { Timestamp } from '@var-ui/react';",
    demoImports: ["import { Timestamp } from '@var-ui/react';"],
    demoReturn: '<Timestamp date={new Date(Date.now() - 5 * 60_000)} />',
    codeExample:
      "import { Timestamp } from '@var-ui/react';\n\n<Timestamp date={new Date(Date.now() - 5 * 60_000)} />",
  },
  {
    slug: 'thumbnail',
    name: 'Thumbnail',
    description: 'Fixed-size image preview.',
    importLine: "import { Thumbnail } from '@var-ui/react';",
    demoImports: ["import { Thumbnail } from '@var-ui/react';"],
    demoPreamble: `const AVATAR_URL = '${AVATAR_URL}';\n\n`,
    demoReturn: '<Thumbnail src={AVATAR_URL} alt="Preview image" />',
    codeExample: `import { Thumbnail } from '@var-ui/react';

const previewUrl = '…';
<Thumbnail src={previewUrl} alt="Preview image" />`,
  },
  {
    slug: 'avatar',
    name: 'Avatar',
    description: 'User or entity image with fallback.',
    importLine: "import { Avatar } from '@var-ui/react';",
    demoImports: ["import { Avatar } from '@var-ui/react';"],
    demoReturn: '<Avatar name="Ada Lovelace" status="success" />',
    codeExample:
      'import { Avatar } from \'@var-ui/react\';\n\n<Avatar name="Ada Lovelace" status="success" />',
  },
  {
    slug: 'card',
    name: 'Card',
    description: 'Bordered surface for grouped content.',
    importLine: "import { Card } from '@var-ui/react';",
    demoImports: ["import { Card } from '@var-ui/react';"],
    demoReturn: '<Card title="Static card">Plain content surface.</Card>',
    codeExample:
      'import { Card } from \'@var-ui/react\';\n\n<Card title="Static card">Plain content surface.</Card>',
  },
  {
    slug: 'clickable-card',
    name: 'ClickableCard',
    description: 'Card that navigates on press.',
    importLine: "import { ClickableCard } from '@var-ui/react';",
    demoImports: ["import { ClickableCard } from '@var-ui/react';"],
    demoReturn: `<ClickableCard
      href="#"
      title="Theming guide"
      description="Override any token with plain CSS custom properties."
      hint="5 min read"
    />`,
    codeExample: `import { ClickableCard } from '@var-ui/react';

<ClickableCard
  href="#"
  title="Theming guide"
  description="Override any token with plain CSS custom properties."
  hint="5 min read"
/>`,
  },
  {
    slug: 'carousel',
    name: 'Carousel',
    description: 'Horizontally scrollable content strip.',
    importLine: "import { Carousel } from '@var-ui/react';",
    demoImports: ["import { Card, Carousel } from '@var-ui/react';"],
    demoReturn: `<Carousel label="Featured themes" itemWidth="220px">
      <Card title="Default">Scroll-snap slide.</Card>
      <Card title="Forest">Scroll-snap slide.</Card>
      <Card title="Rose">Scroll-snap slide.</Card>
    </Carousel>`,
    codeExample: `import { Card, Carousel } from '@var-ui/react';

<Carousel label="Featured themes" itemWidth="220px">
  <Card title="Default">Scroll-snap slide.</Card>
  <Card title="Forest">Scroll-snap slide.</Card>
  <Card title="Rose">Scroll-snap slide.</Card>
</Carousel>`,
  },
];

function demoComponentName(name) {
  return `${name}Demo`;
}

function escapeTemplateLiteral(value) {
  return value.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function renderDemoFile(component) {
  const { name, demoImports, demoReturn, demoPreamble = '' } = component;
  const imports = [...new Set(demoImports)].join('\n');
  return `'use client';

${imports}

export function ${demoComponentName(name)}() {
  ${demoPreamble}return (
    ${demoReturn}
  );
}
`;
}

function renderMdxFile(component) {
  const { slug, name, description, codeExample } = component;
  const demoName = demoComponentName(name);
  const escapedCode = escapeTemplateLiteral(codeExample);

  return `---
title: ${name}
description: ${description}
---

import { Demo } from '@/components/Demo';
import { ${demoName} } from '@/demos/${demoName}';

# ${name}

${description}

## Examples

### Default

<Demo code={\`${escapedCode}\`}>
  <${demoName} />
</Demo>

## Props

<PropsTable slug="${slug}" />

## Accessibility

Built on React Aria Components where applicable.
`;
}

await mkdir(pagesDir, { recursive: true });
await mkdir(demosDir, { recursive: true });

for (const component of components) {
  await writeFile(
    join(demosDir, `${demoComponentName(component.name)}.tsx`),
    renderDemoFile(component),
    'utf8',
  );
  await writeFile(join(pagesDir, `${component.slug}.mdx`), renderMdxFile(component), 'utf8');
}

console.log(`Scaffolded ${components.length} component pages and demo wrappers.`);
