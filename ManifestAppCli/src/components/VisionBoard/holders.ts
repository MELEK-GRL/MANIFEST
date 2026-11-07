export const HOLDERS = [
  'washi',
  'pin',
  'clip',
  'corner',
  'starPin',
  'sideClip',
  'heartPin',
  'clover',
] as const;

export type HolderKind = (typeof HOLDERS)[number];

export const tiltFromKey = (key: string) => {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash + key.charCodeAt(i) * (i + 1)) % 97;
  }
  return ((hash % 11) - 5) * 1.6;
};

export const holderFromIndex = (index: number): HolderKind =>
  HOLDERS[((index % HOLDERS.length) + HOLDERS.length) % HOLDERS.length];

export const LEGACY_HOLDER_MAP: Record<string, HolderKind> = {
  tapeGold: 'washi',
  tapeBlush: 'washi',
  tapeLavender: 'washi',
  tapeStrip: 'washi',
  cornerTape: 'corner',
  dualTape: 'washi',
  dualWashi: 'washi',
  wideWashi: 'washi',
};

export const resolveHolder = (value: unknown, index: number): HolderKind => {
  if (typeof value === 'string') {
    if ((HOLDERS as readonly string[]).includes(value)) {
      return value as HolderKind;
    }
    if (LEGACY_HOLDER_MAP[value]) {
      return holderFromIndex(index);
    }
  }
  return holderFromIndex(index);
};
