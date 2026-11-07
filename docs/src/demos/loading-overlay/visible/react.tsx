import { LoadingOverlay } from '@var-ui/react';

export default function Preview() {
  return (
    <LoadingOverlay visible label="Saving changes">
      <div
        style={{
          width: '17.5rem',
          minHeight: '7.5rem',
          padding: '1rem',
          border: '0.0625rem solid var(--var-ui-color-border-subtle)',
          borderRadius: '0.5rem',
        }}
      >
        <strong>Account settings</strong>
        <p style={{ margin: '0.5rem 0 0' }}>Display name, email, and notification preferences.</p>
      </div>
    </LoadingOverlay>
  );
}
