import { SearchInput, Text, Stack } from '@var-ui/react';
import { useState } from 'react';

export default function Preview() {
  const [query, setQuery] = useState('docs');

  return (
    <Stack gap="sm">
      <SearchInput
        value={query}
        onValueChange={setQuery}
        placeholder="Search…"
        aria-label="Search"
      />
      <Text size="sm" tone="secondary">
        Query: {query || '(empty)'}
      </Text>
    </Stack>
  );
}
