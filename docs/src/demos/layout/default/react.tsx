import { useState } from 'react';
import {
  Button,
  Layout,
  LayoutContent,
  LayoutPanel,
  ResizeHandle,
  Text,
  useResizable,
} from '@var-ui/react';

const ITEMS = [
  { id: 'alpha', label: 'Alpha' },
  { id: 'beta', label: 'Beta' },
  { id: 'gamma', label: 'Gamma' },
] as const;

export default function Preview() {
  const [selectedId, setSelectedId] = useState<string | null>('alpha');
  const { end } = useResizable({
    regions: {
      end: { defaultWidth: 280, minWidth: 220, maxWidth: 400, autoSaveId: 'layout-demo' },
    },
  });
  const selected = ITEMS.find((item) => item.id === selectedId);

  return (
    <div style={{ minHeight: 240 }}>
      <Layout
        height="auto"
        padding={0}
        content={
          <LayoutContent padding={0}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12 }}>
              {ITEMS.map((item) => (
                <Button
                  key={item.id}
                  tone={item.id === selectedId ? 'accent' : 'neutral'}
                  appearance={item.id === selectedId ? 'filled' : 'subtle'}
                  onPress={() => setSelectedId(item.id)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </LayoutContent>
        }
        end={
          selected ? (
            <>
              <LayoutPanel
                resizable={end}
                hasDivider
                label="Details"
                role="complementary"
                padding={0}
              >
                <div style={{ padding: 12 }}>
                  <Text size="sm">Selected: {selected.label}</Text>
                </div>
              </LayoutPanel>
              <ResizeHandle {...end.handleProps} aria-label="Resize inspector" />
            </>
          ) : null
        }
      />
    </div>
  );
}
