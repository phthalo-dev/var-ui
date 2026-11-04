import { DescriptionList } from '@var-ui/react';

export default function Preview() {
  return (
    <div style={{ width: '22.5rem' }}>
      <DescriptionList columns="multi" labelPosition="start" title="Project">
        <DescriptionList.Item label="Owner">Ada Lovelace</DescriptionList.Item>
        <DescriptionList.Item label="Status">Active</DescriptionList.Item>
        <DescriptionList.Item label="Region">us-west-2</DescriptionList.Item>
        <DescriptionList.Item label="Plan">Pro</DescriptionList.Item>
      </DescriptionList>
    </div>
  );
}
