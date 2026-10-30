import { TopNav } from '@var-ui/react';

export default function Preview() {
  return (
    <TopNav>
      <TopNav.Item label="Home" href="/" selected />
      <TopNav.Item label="Docs" href="/docs" />
      <TopNav.Item label="Blog" href="/blog" />
    </TopNav>
  );
}
