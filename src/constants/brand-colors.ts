/** Wundu brand color constants — use these for JS inline styles and SVG attributes */
export const BRAND_COLORS = {
  yellow:      "#ffd400",
  yellowDark:  "#ca6f05",
  blue:        "#003cc3",
  blueDark:    "#00216b",
} as const;

export type BrandColor = (typeof BRAND_COLORS)[keyof typeof BRAND_COLORS];
