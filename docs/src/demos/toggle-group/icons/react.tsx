import { ToggleGroup } from '@var-ui/react';

function AlignIcon({ align }: { align: 'left' | 'center' | 'right' }) {
  const widths = [14, 9, 12];
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
      {widths.map((w, i) => {
        const x = align === 'left' ? 1 : align === 'right' ? 15 - w : (16 - w) / 2;
        return <rect key={i} x={x} y={3 + i * 4} width={w} height="2" rx="1" />;
      })}
    </svg>
  );
}

export default function Preview() {
  return (
    <ToggleGroup aria-label="Text alignment" defaultValue="left" required>
      <ToggleGroup.Item value="left" aria-label="Align left" title="Align left">
        <AlignIcon align="left" />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="center" aria-label="Align center" title="Align center">
        <AlignIcon align="center" />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="right" aria-label="Align right" title="Align right">
        <AlignIcon align="right" />
      </ToggleGroup.Item>
    </ToggleGroup>
  );
}
