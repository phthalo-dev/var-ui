import { Meter, Stack } from '@var-ui/react';

export default function Preview() {
  return (
    <Stack gap="md">
      <Meter label="Disk usage" value={30} low={50} high={80} optimum={0} />
      <Meter label="Disk usage" value={65} low={50} high={80} optimum={0} />
      <Meter label="Disk usage" value={92} low={50} high={80} optimum={0} />
      <Meter
        label="Password strength"
        value={85}
        low={40}
        high={70}
        optimum={100}
        valueLabel="Strong"
      />
    </Stack>
  );
}
