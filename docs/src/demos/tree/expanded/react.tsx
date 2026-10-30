import { Tree } from '@var-ui/react';

export default function Preview() {
  return (
    <Tree
      aria-label="Project files"
      selectionMode="single"
      defaultExpanded={['src', 'components']}
      defaultValue="button"
      items={[
        {
          id: 'src',
          label: 'src',
          children: [
            {
              id: 'components',
              label: 'components',
              children: [
                { id: 'button', label: 'Button.tsx' },
                { id: 'input', label: 'Input.tsx' },
              ],
            },
            { id: 'app', label: 'App.tsx' },
          ],
        },
        { id: 'readme', label: 'README.md' },
      ]}
    />
  );
}
