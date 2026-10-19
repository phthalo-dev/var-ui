'use client';

import {
  Button,
  Checkbox,
  Heading,
  PinInput,
  RadioGroup,
  Slider,
  Switch,
  VStack,
} from '@var-ui/react';

export type SettingsFormTileProps = {
  className?: string;
};

export function SettingsFormTile({ className }: SettingsFormTileProps) {
  return (
    <div className={className}>
      <VStack gap="md">
        <Heading level={3} size="sm">
          Notification preferences
        </Heading>
        <PinInput defaultValue="1234" label="Verification code" length={4} />
        <Switch>Email digest</Switch>
        <Checkbox>Push notifications</Checkbox>
        <RadioGroup
          label="Frequency"
          options={[
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
          ]}
        />
        <Slider defaultValue={40} description="Applies instantly." label="Alert volume" />
        <Button tone="accent" appearance="filled">
          Save preferences
        </Button>
      </VStack>
    </div>
  );
}
