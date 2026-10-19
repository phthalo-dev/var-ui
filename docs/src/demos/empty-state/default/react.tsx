import { Button, EmptyState, Icon } from '@var-ui/react';

export default function Preview() {
  return (
    <EmptyState
      icon={<Icon name="search" size="lg" />}
      title="No results"
      description="Try a different filter, or clear the search."
      action={
        <Button tone="accent" appearance="filled">
          Clear filters
        </Button>
      }
    />
  );
}
