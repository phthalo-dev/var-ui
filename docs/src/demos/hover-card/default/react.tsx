import { HoverCard, Link } from '@var-ui/react';

export default function Preview() {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger>
        <Link href="/u/ada">Ada Lovelace</Link>
      </HoverCard.Trigger>
      <HoverCard.Popup>
        <HoverCard.Title>Ada Lovelace</HoverCard.Title>
        <HoverCard.Content>
          <p>Mathematician and early computing pioneer.</p>
        </HoverCard.Content>
      </HoverCard.Popup>
    </HoverCard.Root>
  );
}
