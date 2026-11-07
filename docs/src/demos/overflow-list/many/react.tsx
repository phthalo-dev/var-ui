import { OverflowList } from '@var-ui/react';

const labels = [
  'Alpha',
  'Beta',
  'Gamma',
  'Delta',
  'Epsilon',
  'Zeta',
  'Eta',
  'Theta',
  'Iota',
  'Kappa',
];

export default function Preview() {
  return (
    <div style={{ width: '13.75rem' }}>
      <OverflowList fillParent renderOverflow={(hidden) => <span>+{hidden.length}</span>}>
        {labels.map((label) => (
          <OverflowList.Item key={label}>{label}</OverflowList.Item>
        ))}
      </OverflowList>
    </div>
  );
}
