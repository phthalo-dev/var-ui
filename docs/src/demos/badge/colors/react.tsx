import { Badge, HStack } from '@var-ui/react';

const colors = [
  'rose',
  'crimson',
  'ruby',
  'red',
  'tomato',
  'orange',
  'amber',
  'gold',
  'yellow',
  'lime',
  'grass',
  'green',
  'emerald',
  'jade',
  'phthalo',
  'teal',
  'mint',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'iris',
  'violet',
  'purple',
  'plum',
  'fuchsia',
  'pink',
  'bronze',
  'brown',
  'taupe',
  'stone',
  'sand',
  'olive',
  'sage',
  'mist',
  'slate',
  'gray',
  'zinc',
  'mauve',
  'neutral',
] as const;

export default function Preview() {
  return (
    <HStack gap="xs" wrap>
      {colors.map((color) => (
        <Badge key={color} color={color}>
          {color}
        </Badge>
      ))}
    </HStack>
  );
}
