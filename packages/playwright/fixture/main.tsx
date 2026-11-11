import type { JSX } from 'react';
import { createRoot } from 'react-dom/client';
import { DesignSystemProvider } from '@var-ui/react';
import { scenarios } from './scenarios';

// Fixture contract (playwright.config.ts serves this app for tests/):
//   /?case=<scenario>          render one scenario
//   /?direction=rtl            design direction
//   /?colorMode=light|dark     color mode
const params = new URLSearchParams(window.location.search);
const caseName = params.get('case') ?? '';
const direction = params.get('direction') === 'rtl' ? 'rtl' : 'ltr';
const colorMode =
  params.get('colorMode') === 'dark'
    ? ('dark' as const)
    : params.get('colorMode') === 'light'
      ? ('light' as const)
      : ('system' as const);

function Fixture(): JSX.Element {
  const Scenario = scenarios[caseName as keyof typeof scenarios];
  return (
    <DesignSystemProvider direction={direction} colorMode={colorMode}>
      {Scenario ? <Scenario /> : <p>Unknown fixture case: {caseName}</p>}
    </DesignSystemProvider>
  );
}

createRoot(document.getElementById('root')!).render(<Fixture />);
