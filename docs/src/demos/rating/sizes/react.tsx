import { Rating } from '@var-ui/react';

export default function Preview() {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Rating size="sm" defaultValue={2} aria-label="Small" />
      <Rating size="md" defaultValue={3} aria-label="Medium" />
      <Rating size="lg" defaultValue={4} aria-label="Large" />
    </div>
  );
}
