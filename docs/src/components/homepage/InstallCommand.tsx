import { defaultIcons } from '@var-ui/icons';
import { CopyButton, IconProvider, cx } from '@var-ui/react';
import { homePage } from '@/styles/homePage';

export type InstallCommandProps = {
  command: string;
  /** Borderless, secondary-text treatment for use under a row of primary CTAs. */
  quiet?: boolean;
};

/** Copyable one-line install command, styled as a pill. */
export default function InstallCommand({ command, quiet = false }: InstallCommandProps) {
  const hp = homePage();
  return (
    <IconProvider icons={defaultIcons}>
      <div className={cx(hp.install.className, quiet && hp.installQuiet.className)}>
        <span aria-hidden="true" className={hp.installPrompt.className}>
          $
        </span>
        <code className={hp.installCode.className}>{command}</code>
        <CopyButton value={command} copyLabel="Copy" copiedLabel="Copied" />
      </div>
    </IconProvider>
  );
}
