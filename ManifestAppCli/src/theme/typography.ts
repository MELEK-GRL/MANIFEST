/**
 * Global tipografi: font ailesi, base boyutlar, satır yükseklikleri.
 * Ekran boyutuna göre ölçekleme useTypography() ile yapılır.
 *
 * Fontlar OFL (silksiz/ücretsiz): Playfair Display + Montserrat
 * Lisans: src/assets/fonts/OFL-*.txt
 */

/** Tasarım referansı: 375pt genişlik (useDeviceStore ile uyumlu) */
export const BASE_DESIGN_WIDTH = 375;

/** Font ölçek faktörü sınırları: çok küçük/büyük ekranlarda aşırı büyüme/küçülme engellenir */
export const FONT_SCALE_MIN = 0.9;
export const FONT_SCALE_MAX = 1.2;

/** Proje geneli yazı boyutu çarpanı (1 = mevcut, 0.88 = %12 küçük). */
export const FONT_SIZE_MULTIPLIER = 0.88;

export type FontFamilyVariant = 'serif' | 'sans';

export type FontWeightToken =
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';

/** Android/iOS linked font file names (extension yok). */
export const fontFamilies = {
  serifRegular: 'PlayfairDisplay-Regular',
  serifSemiBold: 'PlayfairDisplay-SemiBold',
  serifBold: 'PlayfairDisplay-Bold',
  serifItalic: 'PlayfairDisplay-Italic',
  sansRegular: 'Montserrat-Regular',
  sansMedium: 'Montserrat-Medium',
  sansSemiBold: 'Montserrat-SemiBold',
  sansBold: 'Montserrat-Bold',
} as const;

/** Varsayılan gövde fontu (sans). */
export const fontFamily = fontFamilies.sansRegular;

export function resolveFontFamily(
  variant: FontFamilyVariant,
  weight: FontWeightToken = '400',
  italic = false,
): string {
  const w = Number(weight);
  if (variant === 'serif') {
    if (italic) {
      return fontFamilies.serifItalic;
    }
    if (w >= 700) {
      return fontFamilies.serifBold;
    }
    if (w >= 600) {
      return fontFamilies.serifSemiBold;
    }
    return fontFamilies.serifRegular;
  }
  if (w >= 700) {
    return fontFamilies.sansBold;
  }
  if (w >= 600) {
    return fontFamilies.sansSemiBold;
  }
  if (w >= 500) {
    return fontFamilies.sansMedium;
  }
  return fontFamilies.sansRegular;
}

/** Base font boyutları (375pt referans ekranda). Ölçek useTypography ile uygulanır. */
export const baseFontSize = {
  caption: 12,
  captionLarge: 13,
  label: 14,
  bodySmall: 15,
  body: 16,
  bodyMedium: 17,
  subtitle: 18,
  subtitleLarge: 19,
  title: 20,
  titleLarge: 22,
  titleXl: 24,
  display: 26,
  brand: 32,
} as const;

/** Her rol için satır yüksekliği çarpanı (fontSize * lineHeight = lineHeight px). */
export const baseLineHeight: Record<keyof typeof baseFontSize, number> = {
  caption: 1.33,
  captionLarge: 1.38,
  label: 1.36,
  bodySmall: 1.4,
  body: 1.44,
  bodyMedium: 1.41,
  subtitle: 1.33,
  subtitleLarge: 1.37,
  title: 1.3,
  titleLarge: 1.27,
  titleXl: 1.25,
  display: 1.23,
  brand: 1.15,
};

export type FontSizeKey = keyof typeof baseFontSize;

/** Verilen ölçek faktörüne göre tüm boyutları hesaplar (scale zaten FONT_SIZE_MULTIPLIER içerir). */
export function getScaledSizes(
  scaleFactor: number,
): Record<FontSizeKey, number> {
  const keys = Object.keys(baseFontSize) as FontSizeKey[];
  const result = {} as Record<FontSizeKey, number>;
  for (const key of keys) {
    result[key] = Math.round(baseFontSize[key] * scaleFactor);
  }
  return result;
}

/** Ölçek faktörünü FONT_SCALE_MIN / FONT_SCALE_MAX ile sınırlar. */
export function clampFontScale(scale: number): number {
  return Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, scale));
}
