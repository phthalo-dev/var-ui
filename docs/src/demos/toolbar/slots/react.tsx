import { Button, IconButton, Toolbar } from '@var-ui/react';

export default function Preview() {
  return (
    <Toolbar
      label="Editor toolbar"
      startContent={
        <>
          <IconButton name="menu" aria-label="Menu" />
          <IconButton name="search" aria-label="Search" />
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
