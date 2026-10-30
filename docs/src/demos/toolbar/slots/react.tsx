import { Button, IconButton, Toolbar } from '@var-ui/react';

export default function Preview() {
  return (
    <Toolbar
      label="Editor toolbar"
      startContent={
        <>
          <IconButton icon="menu" aria-label="Menu" />
          <IconButton icon="search" aria-label="Search" />
        </>
      }
      centerContent={<Button>Untitled</Button>}
      endContent={
        <Button tone="accent" appearance="filled">
          Share
        </Button>
      }
    />
  );
}
