'use client';

import { designTokens as t } from '@var-ui/core';
import { AspectRatio, Card, Carousel, Text, Stack } from '@var-ui/react';

const SLIDES = ['Onboarding', 'Billing', 'Reports', 'Integrations', 'Security'];

export type CarouselStripTileProps = {
  className?: string;
};

export function CarouselStripTile({ className }: CarouselStripTileProps) {
  return (
    <div className={className}>
      <Carousel itemWidth="180px" label="Product tour">
        {SLIDES.map((slide) => (
          <Card key={slide} title={slide}>
            <Stack gap="xs">
              <AspectRatio
                ratio={16 / 9}
                style={{ background: String(t.color.background.subtle) }}
              />
              <Text size="sm" tone="secondary">
                Scroll-snap slide.
              </Text>
            </Stack>
          </Card>
        ))}
      </Carousel>
    </div>
  );
}
