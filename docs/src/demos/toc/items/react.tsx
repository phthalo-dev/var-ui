import { Toc } from '@var-ui/react';

export default function Preview() {
  return (
    <Toc
      activeId="examples"
      items={[
        { id: 'intro', text: 'Intro', level: 2 },
        { id: 'examples', text: 'Examples', level: 2 },
        { id: 'default', text: 'Default', level: 3 },
        { id: 'props', text: 'Props', level: 2 },
      ]}
    />
  );
}
