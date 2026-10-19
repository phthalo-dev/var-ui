import { Button, ButtonGroup, IconButton } from '@var-ui/react';

export default function Preview() {
  return (
    <ButtonGroup>
      <IconButton name="search" aria-label="Search" />
      <IconButton name="copy" aria-label="Copy" />
      <Button>More</Button>
    </ButtonGroup>
  );
}
