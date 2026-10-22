import { createRoot } from 'react-dom/client';
import { Button, DesignSystemProvider } from '@var-ui/react';

createRoot(document.getElementById('root')!).render(
  <DesignSystemProvider>
    <Button tone="accent" appearance="filled">
      Save
    </Button>
  </DesignSystemProvider>,
);
