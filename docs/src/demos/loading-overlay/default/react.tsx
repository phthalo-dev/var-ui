import { LoadingOverlay } from '@var-ui/react';

export default function Preview() {
  return (
    <LoadingOverlay visible label="Loading">
      <div style={{ width: '12.5rem', height: '5rem', padding: '1rem' }}>
        Content behind overlay
      </div>
    </LoadingOverlay>
  );
}
