import { Button, VisuallyHidden } from '@var-ui/react';

export default function Preview() {
  return (
    <Button layout="icon" tone="danger">
      <span aria-hidden="true">×</span>
      <VisuallyHidden>Delete project</VisuallyHidden>
    </Button>
  );
}
