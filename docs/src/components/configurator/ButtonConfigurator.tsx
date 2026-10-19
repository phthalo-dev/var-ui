'use client';

import type { Tone, ToneAppearance } from '@var-ui/core';
import { defaultIcons } from '@var-ui/icons';
import { Button, IconProvider, Switch } from '@var-ui/react';
import { useMemo, useState } from 'react';
import type { DocsFramework } from '@/lib/framework';
import { configuratorStyles } from '@/styles/configurator';
import { AppearancePicker } from './AppearancePicker';
import { ComponentConfigurator } from './ComponentConfigurator';
import { generateButtonCode, type ButtonConfiguratorState } from './buttonCode';
import { SizePicker } from './SizePicker';
import { ToneSwatchPicker } from './ToneSwatchPicker';

export type ButtonConfiguratorProps = {
  framework: DocsFramework;
};

const DEFAULT_STATE: ButtonConfiguratorState = {
  appearance: 'subtle',
  tone: 'neutral',
  size: 'md',
  isDisabled: false,
  elevated: false,
  label: 'Button',
};

function ControlGroup({ label, children }: { label: string; children: React.ReactNode }) {
  const c = configuratorStyles();
  return (
    <div className={c.controlGroup.className}>
      <span className={c.controlLabel.className}>{label}</span>
      {children}
    </div>
  );
}

export default function ButtonConfigurator({ framework }: ButtonConfiguratorProps) {
  const [state, setState] = useState<ButtonConfiguratorState>(DEFAULT_STATE);

  const codeOutput = useMemo(() => generateButtonCode(framework, state), [framework, state]);

  return (
    <IconProvider icons={defaultIcons}>
      <ComponentConfigurator
        preview={
          <Button
            tone={state.tone}
            appearance={state.appearance}
            size={state.size}
            elevated={state.elevated}
            isDisabled={state.isDisabled}
          >
            {state.label}
          </Button>
        }
        controls={
          <>
            <ControlGroup label="Appearance">
              <AppearancePicker
                value={state.appearance}
                onChange={(appearance: ToneAppearance) => setState((s) => ({ ...s, appearance }))}
              />
            </ControlGroup>

            <ControlGroup label="Tone">
              <ToneSwatchPicker
                value={state.tone}
                onChange={(tone: Tone) => setState((s) => ({ ...s, tone }))}
              />
            </ControlGroup>

            <ControlGroup label="Size">
              <SizePicker
                value={state.size}
                onChange={(size) => setState((s) => ({ ...s, size }))}
              />
            </ControlGroup>

            <ControlGroup label="Disabled">
              <Switch
                aria-label="Disabled"
                isSelected={state.isDisabled}
                onChange={(isDisabled) => setState((s) => ({ ...s, isDisabled }))}
              >
                Disabled
              </Switch>
            </ControlGroup>

            <ControlGroup label="Elevated">
              <Switch
                aria-label="Elevated"
                isSelected={state.elevated}
                onChange={(elevated) => setState((s) => ({ ...s, elevated }))}
              >
                Elevated
              </Switch>
            </ControlGroup>
          </>
        }
        code={codeOutput.code}
        language={codeOutput.language}
      />
    </IconProvider>
  );
}
