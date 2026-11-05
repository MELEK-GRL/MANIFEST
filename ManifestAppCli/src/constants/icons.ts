export const iconSize = {
  small: 16,
  medium: 20,
  large: 24,
  xl: 28,
  xxl: 48,
} as const;

export type IconSizeKey = keyof typeof iconSize;
