import { Toc } from '@var-ui/react';

export default function Preview() {
  return (
    <Toc title="On this page">
      <Toc.Item label="Examples" href="#examples" selected />
      <Toc.Item label="Default" href="#default" nested />
      <Toc.Item label="Nested items" href="#nested" nested />
      <Toc.Item label="Props" href="#props" />
      <Toc.Item label="Accessibility" href="#accessibility" />
    </Toc>
  );
}
