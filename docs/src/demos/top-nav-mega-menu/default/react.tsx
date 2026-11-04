import { TopNav } from '@var-ui/react';

export default function Preview() {
  return (
    <div style={{ position: 'relative', minHeight: '7.5rem' }}>
      <TopNav>
        <TopNav.MegaMenu
          label="Solutions"
          items={[{ id: 'startups', title: 'For startups', href: '/startups' }]}
          featured={
            <TopNav.MegaMenu.FeaturedCard title="Enterprise" description="Scale with confidence" />
          }
        />
      </TopNav>
    </div>
  );
}
