import { AspectRatio } from '@var-ui/react';

export default function Preview() {
  return (
    <AspectRatio
      ratio={16 / 9}
      style={{ background: 'var(--var-ui-color-background-subtle)', maxWidth: '20rem' }}
    />
  );
}
