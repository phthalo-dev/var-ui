export type FontFaceDefinition = {
  family: string;
  src: string | string[];
  fontWeight?: string | number;
  fontStyle?: string;
  fontDisplay?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  unicodeRange?: string;
  /** Metric overrides, for a local fallback face tuned to match a webfont (no layout shift on swap). */
  sizeAdjust?: string;
  ascentOverride?: string;
  descentOverride?: string;
  lineGapOverride?: string;
};

export type FontSlotConfig = {
  /** One face, or several faces of the same family (upright + italic). The first names the stack. */
  face: FontFaceDefinition | readonly [FontFaceDefinition, ...FontFaceDefinition[]];
  fallback: string;
  /**
   * A `local()` face with metric overrides that mimics the webfont while it loads. Its family
   * goes into the stack right after the webfont, so the swap doesn't rewrap lines.
   */
  metricFallback?: FontFaceDefinition;
};

export type DefineFontsInput = {
  body?: FontSlotConfig;
  display?: FontSlotConfig;
  mono?: FontSlotConfig;
};

export type DefineFontsResult = {
  fonts: FontFaceDefinition[];
  tokens: {
    fontFamily: {
      body?: string;
      display?: string;
      mono?: string;
    };
  };
};
