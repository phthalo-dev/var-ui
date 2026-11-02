import { ProgressCircle } from '@var-ui/react';

export default function Preview() {
  return (
    <ProgressCircle label="Uploading assets" value={72} size="lg">
      {({ valueText }) => valueText}
    </ProgressCircle>
  );
}
