import { HoverCard, Link, Text } from '@var-ui/react';

export default function Preview() {
  return (
    <HoverCard.Root openDelay={400}>
      <HoverCard.Trigger>
        <Link href="/u/ada">@ada</Link>
      </HoverCard.Trigger>
      <HoverCard.Popup placement="bottom">
        <HoverCard.Title>Ada Lovelace</HoverCard.Title>
        <HoverCard.Content>
          <Text size="sm" tone="secondary">
            Mathematician and early computing pioneer. Worked with Charles Babbage on the Analytical
            Engine.
          </Text>
          <p style={{ marginTop: 8 }}>
            <Link href="/u/ada">View profile</Link>
          </p>
        </HoverCard.Content>
      </HoverCard.Popup>
    </HoverCard.Root>
  );
}
