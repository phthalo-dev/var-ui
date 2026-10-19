import { getLocalTimeZone, today } from '@internationalized/date';
import { createRoot } from 'react-dom/client';
import { Button, Calendar, DateInput, DesignSystemProvider } from '@var-ui/react';

const now = today(getLocalTimeZone());

createRoot(document.getElementById('root')!).render(
  <DesignSystemProvider>
    <DateInput label="Start date" defaultValue={now} />
    <Calendar aria-label="Events" />
    <Button tone="accent" appearance="filled">
      Apply
    </Button>
  </DesignSystemProvider>,
);
