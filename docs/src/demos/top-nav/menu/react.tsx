import { TopNav } from '@var-ui/react';

export default function Preview() {
  return (
    <div style={{ position: 'relative', minHeight: 80 }}>
      <TopNav heading={<TopNav.Heading heading="Acme" />}>
        <TopNav.Item label="Home" href="/" selected />
        <TopNav.Item label="Docs" href="/docs" />
        <TopNav.Menu
          label="Products"
          items={[
            {
              id: 'cloud',
              title: 'Cloud',
              description: 'Deploy anywhere',
              href: '/cloud',
            },
            {
              id: 'analytics',
              title: 'Analytics',
              description: 'Measure what matters',
              href: '/analytics',
            },
          ]}
        />
      </TopNav>
    </div>
  );
}
