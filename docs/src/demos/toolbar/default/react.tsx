import { Button, Toolbar } from '@var-ui/react';

export default function Preview() {
  return (
    <Toolbar
      label="Document actions"
      startContent={<Button>Bold</Button>}
      endContent={<Button>Share</Button>}
    />
  );
}
