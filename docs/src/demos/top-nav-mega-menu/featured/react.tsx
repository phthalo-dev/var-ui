import { Button, TopNav } from '@var-ui/react';

export default function Preview() {
  return (
    <div style={{ position: 'relative', minHeight: 160 }}>
      <TopNav heading={<TopNav.Heading heading="Acme" />}>
        <TopNav.MegaMenu
          label="Solutions"
          isOpen
          items={[
            {
              id: 'startups',
              title: 'For startups',
              description: 'Ship faster with less overhead',
              href: '/startups',
            },
            {
              id: 'enterprise',
              title: 'For enterprise',
              description: 'Security and scale built in',
              href: '/enterprise',
            },
          ]}
          featured={
            <TopNav.MegaMenu.FeaturedCard
              title="Platform tour"
              description="See how teams build with Acme in under five minutes."
              href="/tour"
              action={<Button size="sm">Watch demo</Button>}
            />
          }
        />
      </TopNav>
    </div>
  );
}
