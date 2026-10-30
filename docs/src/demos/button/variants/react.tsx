import { Button, HStack, Stack } from '@var-ui/react';

const tones = ['neutral', 'accent', 'success', 'warning', 'danger', 'info'] as const;
const appearances = ['filled', 'outline', 'subtle', 'ghost'] as const;

function toneLabel(tone: (typeof tones)[number]) {
  return tone.charAt(0).toUpperCase() + tone.slice(1);
}

export default function Preview() {
  return (
    <Stack gap="lg">
      {appearances.map((appearance) => (
        <HStack key={appearance} gap="sm" wrap>
          {tones.map((tone) => (
            <Button key={tone} tone={tone} appearance={appearance}>
              {toneLabel(tone)}
            </Button>
          ))}
        </HStack>
      ))}
    </Stack>
  );
}
