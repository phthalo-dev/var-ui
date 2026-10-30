import { Accordion, IconProvider } from '@var-ui/react';

export default function Preview() {
  return (
    <IconProvider icons={{}}>
      <Accordion type="single" defaultValue={['billing']}>
        <Accordion.Item id="billing">
          <Accordion.Trigger>Billing</Accordion.Trigger>
          <Accordion.Panel>
            <p>Update payment method and view invoices.</p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="shipping">
          <Accordion.Trigger>Shipping</Accordion.Trigger>
          <Accordion.Panel>
            <p>Manage delivery addresses and preferences.</p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="notifications">
          <Accordion.Trigger>Notifications</Accordion.Trigger>
          <Accordion.Panel>
            <p>Choose email and push notification settings.</p>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </IconProvider>
  );
}
