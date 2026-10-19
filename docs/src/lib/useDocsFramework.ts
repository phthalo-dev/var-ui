import { useEffect, useState } from 'react';
import { parseFrameworkCookie, type DocsFramework } from '@var-ui/docs-components/framework';

export function readDocsFrameworkFromDocument(): DocsFramework {
  if (typeof document === 'undefined') {
    return 'react';
  }
  return parseFrameworkCookie(document.documentElement.dataset.framework);
}

/** Syncs with `data-framework` on `<html>` (set from cookie via middleware / framework switcher). */
export function useDocsFramework(initial?: DocsFramework): DocsFramework {
  const [framework, setFramework] = useState<DocsFramework>(
    () => initial ?? readDocsFrameworkFromDocument(),
  );

  useEffect(() => {
    const sync = () => setFramework(readDocsFrameworkFromDocument());
    sync();

    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-framework'],
    });

    return () => observer.disconnect();
  }, []);

  return framework;
}
