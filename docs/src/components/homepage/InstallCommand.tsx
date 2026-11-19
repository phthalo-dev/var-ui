import { defaultIcons } from '@var-ui/icons';
import { Button, CopyButton, Icon, IconProvider } from '@var-ui/react';
import { homePage } from '@/styles/homePage';

export type InstallCommandProps = {
  command: string;
};

/** Copyable one-line install command: a prominent pill with a filled copy action. */
export default function InstallCommand({ command }: InstallCommandProps) {
  const hp = homePage();
  return (
    <IconProvider icons={defaultIcons}>
      <div className={hp.install.className}>
        <span aria-hidden="true" className={hp.installPrompt.className}>
          $
        </span>
        <code className={hp.installCode.className}>{command}</code>
        <CopyButton value={command}>
          {({ copied, copy }) => (
            <Button
              appearance="solid"
              aria-label={copied ? 'Copied' : `Copy “${command}”`}
              onClick={copy}
              pill
              size="sm"
              tone="accent"
            >
              <Icon name={copied ? 'check' : 'copy'} size="sm" />
              {copied ? 'Copied' : 'Copy'}
            </Button>
          )}
        </CopyButton>
      </div>
    </IconProvider>
  );
}
