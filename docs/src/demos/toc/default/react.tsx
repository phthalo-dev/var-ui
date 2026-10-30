import { Toc } from '@var-ui/react';

export default function Preview() {
  return (
    <Toc title="On this page">
      <Toc.Item label="Examples" href="#examples" selected />
      <Toc.Item label="Props" href="#props" />
    </Toc>
  );
}
