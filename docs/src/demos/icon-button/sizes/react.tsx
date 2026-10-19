import { HStack, IconButton, VStack } from '@var-ui/react';

export default function Preview() {
  return (
    <VStack gap="lg">
      <HStack gap="sm">
        <IconButton name="search" aria-label="Search small" size="sm" />
        <IconButton name="search" aria-label="Search medium" size="md" />
        <IconButton name="search" aria-label="Search large" size="lg" />
      </HStack>
      <HStack gap="sm">
        <IconButton name="close" aria-label="Close" />
        <IconButton name="search" aria-label="Search" tone="accent" appearance="filled" />
        <IconButton name="menu" aria-label="Menu" tone="accent" appearance="ghost" />
        <IconButton name="close" aria-label="Delete" tone="danger" appearance="filled" />
      </HStack>
    </VStack>
  );
}
