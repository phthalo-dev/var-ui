import { StatusDot } from '@var-ui/react';

export default function Preview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <StatusDot tone="success" aria-label="Online" /> Online
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <StatusDot tone="warning" aria-label="Away" /> Away
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <StatusDot tone="danger" aria-label="Offline" /> Offline
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <StatusDot tone="info" pulse aria-label="Syncing" /> Syncing
      </span>
    </div>
  );
}
