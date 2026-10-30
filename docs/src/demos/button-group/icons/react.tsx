import { Button, ButtonGroup, IconButton } from '@var-ui/react';

export default function Preview() {
  return (
    <ButtonGroup>
      <IconButton icon="search" aria-label="Search" />
      <IconButton icon="copy" aria-label="Copy" />
      <Button>More</Button>
    </ButtonGroup>
  );
}
