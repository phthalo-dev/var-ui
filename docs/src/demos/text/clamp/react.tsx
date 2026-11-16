import { Stack, Text } from '@var-ui/react';

const PROBLEM_STATEMENT =
  'The migration stalls whenever a shard reports a partial heartbeat, because the reconciliation job treats every retry as a fresh conflict and rewrites the target row.';

export default function Preview() {
  return (
    <Stack gap="sm">
      <Text eyebrow size="xs" tone="secondary">
        Agent output
      </Text>
      <Text whiteSpace="pre-wrap">{'Step 1: index rebuilt\nStep 2: pending review'}</Text>
      <Text lineClamp={2} tone="secondary">
        {PROBLEM_STATEMENT}
      </Text>
      <Text lineClamp={20}>{PROBLEM_STATEMENT}</Text>
    </Stack>
  );
}
