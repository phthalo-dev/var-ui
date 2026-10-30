import { useState } from 'react';
import { Breadcrumbs, DirectionProvider, Pagination, SideNav, Text } from '@var-ui/react';

export default function Preview() {
  const [page, setPage] = useState(1);
  return (
    <DirectionProvider direction="rtl">
      <div
        style={{
          height: 280,
          width: 240,
          border: '1px solid var(--var-ui-color-border-subtle)',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <SideNav header={<SideNav.Heading heading="Docs" />}>
          <SideNav.Section title="Main">
            <SideNav.Item label="Overview" href="#overview" selected />
            <SideNav.Item label="Guides" collapsible>
              <SideNav.Item label="Hidden" href="#hidden" />
              <SideNav.Item label="Direction" href="#direction" />
            </SideNav.Item>
          </SideNav.Section>
        </SideNav>
      </div>
      <Breadcrumbs
        items={[
          { id: 'home', label: 'Home', href: '#' },
          { id: 'here', label: 'Current' },
        ]}
      />
      <Pagination page={page} onValueChange={setPage} totalPages={5} variant="compact" />
      <Text>dir=rtl island</Text>
    </DirectionProvider>
  );
}
