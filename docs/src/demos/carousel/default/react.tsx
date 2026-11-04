import { Card, Carousel } from '@var-ui/react';

export default function Preview() {
  return (
    <Carousel label="Featured themes" itemWidth="13.75rem">
      <Card title="Default">Scroll-snap slide.</Card>
      <Card title="Forest">Scroll-snap slide.</Card>
      <Card title="Rose">Scroll-snap slide.</Card>
    </Carousel>
  );
}
