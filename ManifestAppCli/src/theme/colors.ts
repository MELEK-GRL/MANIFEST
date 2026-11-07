const palette = {
  primary: '#6B4F82',
  primarySoft: '#EDE4F5',
  primaryDark: '#56406B',

  peach: '#F9E9E8',
  cream: '#FBF4F0',
  blush: '#F3E6E1',
  lavender: '#E8DFF0',

  background: '#F9E9E8',
  backgroundTop: '#E8D5DC',
  backgroundBottom: '#F9E9E8',
  backgroundCard: '#FFFFFF',
  backgroundGlass: '#FFFFFFF5',
  backgroundSoft: '#F3EAF0',
  backgroundWash: '#F9E9E870',
  messageWash: '#F9E9E833',

  gold: '#C9A86A',
  goldSoft: '#E8D9B8',

  white: '#FFFFFF',
  black: '#000000',

  textDark: '#3D2F4A',
  textMuted: '#8B7D94',
  textMutedDark: '#7A6C84',
  textLight: '#A89BB0',
  textWhite: '#FFFFFF',

  borderSoft: '#EADFE8',
  borderGlass: '#FFFFFF',

  danger: '#DC2626',
  dangerSoft: '#FDECEC',
  dangerBorder: '#F87171',
  dangerText: '#B91C1C',
  success: '#22C55E',
  successSoft: '#E8F8EE',
  warning: '#C9A86A',
  warningSoft: '#F8F1E3',
  info: '#6B8CFF',
  infoSoft: '#E8EEFF',
  overlay: '#3A2F4573',
  /** Vazgeç — danger ile aynı soft gradient dili, gri ton */
  buttonMuted: '#7A6C84',
  buttonMutedSoft: '#F3F0F5',
  buttonMutedBorder: '#C4BCC8',
} as const;

const gradientPrimary = ['#8B6FA8', palette.primary] as [string, string];
const gradientSecondary = [palette.white, palette.peach] as [string, string];
const gradientDanger = [palette.white, palette.dangerSoft] as [string, string];
const gradientMuted = [palette.white, palette.buttonMutedSoft] as [
  string,
  string,
];

export type ButtonVariantTheme = {
  gradient: [string, string];
  text: string;
  border: string;
  shadow: string;
};

const colors = {
  ...palette,

  gradientHero: [palette.backgroundTop, palette.peach] as [string, string],
  gradientPrimary,
  gradientSecondary,
  gradientDanger,
  gradientMuted,
  gradientTile: ['#FAF3F0', palette.blush, '#EFE0DA'] as [
    string,
    string,
    string,
  ],
  gradientProgress: [palette.primary, palette.gold] as [string, string],
  gradientTabActive: ['#D4BEE8', '#B89AD4', '#C4A8DC'] as [
    string,
    string,
    string,
  ],

  buttonThemes: {
    primary: {
      gradient: gradientPrimary,
      text: palette.textWhite,
      border: palette.primary,
      shadow: palette.primaryDark,
    },
    secondary: {
      gradient: gradientSecondary,
      text: palette.primary,
      border: palette.borderSoft,
      shadow: palette.primary,
    },
    danger: {
      gradient: gradientDanger,
      text: palette.dangerText,
      border: palette.dangerBorder,
      shadow: palette.danger,
    },
    muted: {
      gradient: gradientMuted,
      text: palette.buttonMuted,
      border: palette.buttonMutedBorder,
      shadow: palette.buttonMuted,
    },
  } satisfies Record<string, ButtonVariantTheme>,
};

export default colors;
