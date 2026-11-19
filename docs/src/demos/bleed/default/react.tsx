import { Bleed, Stack, Text } from '@var-ui/react';

export default function Preview() {
  return (
    <div
      style={{
        containerType: 'inline-size',
        paddingInline: '1.5rem',
        border: '0.0625rem dashed var(--var-ui-color-border-default)',
      }}
    >
      <Stack gap="sm" style={{ maxWidth: '20rem', marginInline: 'auto' }}>
        <Text>The column</Text>
        <Bleed
          gutter="1.5rem"
          style={{ background: 'var(--var-ui-color-background-subtle)', paddingBlock: '0.75rem' }}
        >
          <Text>A full-bleed band, content on the column</Text>
        </Bleed>
        <Text>The column again</Text>
      </Stack>
    </div>
  );
}
