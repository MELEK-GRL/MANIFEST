import type {HolderKind} from './holders';

export const ITEM_WIDTH = 112;
export const ITEM_HEIGHT = 128;
export const DRAFT_KEY = '@manifest/vision-board-draft';
export const MAX_DREAMS = 4;
export const MAX_DREAM_CARDS = 5;
export const DEFAULT_DREAM_CARD_ID = 'dream-card-default';
export const NOTE_WIDTH = 122;
export const NOTE_BASE_HEIGHT = 56;
export const NOTE_ROW_HEIGHT = 22;
/** Board görünür alan yüksekliği */
export const BOARD_VIEWPORT_HEIGHT = 468;
/** Kaydırılabilir board tuvali yüksekliği */
export const BOARD_CANVAS_HEIGHT = 780;

export type DreamItem = {
  id: string;
  text: string;
  checked: boolean;
};

export type DreamCard = {
  id: string;
  isDefault: boolean;
  items: DreamItem[];
  x: number;
  y: number;
};

export type BoardItem = {
  key: string;
  serverId?: string;
  uri: string;
  x: number;
  y: number;
  scale: number;
  holder: HolderKind;
  pendingUpload?: boolean;
};

export type DraftPayload = {
  items: BoardItem[];
  serverIds: string[];
  dreamCards?: DreamCard[];
  /** @deprecated migrated to dreamCards */
  dreamItems?: DreamItem[];
};

export type BoardSize = {width: number; height: number};

const CARD_SPAWN = [
  {x: 210, y: 16},
  {x: 12, y: 200},
  {x: 200, y: 280},
  {x: 24, y: 110},
  {x: 160, y: 160},
] as const;

export const noteHeightFor = (itemCount: number) =>
  NOTE_BASE_HEIGHT + Math.max(1, itemCount) * NOTE_ROW_HEIGHT;

export const spawnPosForIndex = (index: number): {x: number; y: number} =>
  CARD_SPAWN[((index % CARD_SPAWN.length) + CARD_SPAWN.length) % CARD_SPAWN.length];

export const createDefaultDreamCard = (): DreamCard => ({
  id: DEFAULT_DREAM_CARD_ID,
  isDefault: true,
  items: [],
  ...spawnPosForIndex(0),
});

export const normalizeDreamItem = (d: Partial<DreamItem>): DreamItem | null => {
  if (!d || typeof d.id !== 'string' || typeof d.text !== 'string') {
    return null;
  }
  return {
    id: d.id,
    text: d.text,
    checked: Boolean(d.checked),
  };
};

export const normalizeDreamCards = (
  cards: unknown,
  legacyItems?: unknown,
): DreamCard[] => {
  if (Array.isArray(cards) && cards.length > 0) {
    const mapped = cards
      .map((card, index): DreamCard | null => {
        if (!card || typeof card !== 'object') {
          return null;
        }
        const raw = card as Partial<DreamCard>;
        const id =
          typeof raw.id === 'string' && raw.id
            ? raw.id
            : `dream-card-${index}`;
        const items = Array.isArray(raw.items)
          ? raw.items
              .map(normalizeDreamItem)
              .filter((item): item is DreamItem => Boolean(item))
              .slice(0, MAX_DREAMS)
          : [];
        const pos = spawnPosForIndex(index);
        return {
          id,
          isDefault: Boolean(raw.isDefault) || id === DEFAULT_DREAM_CARD_ID,
          items,
          x: typeof raw.x === 'number' ? raw.x : pos.x,
          y: typeof raw.y === 'number' ? raw.y : pos.y,
        };
      })
      .filter((card): card is DreamCard => Boolean(card))
      .slice(0, MAX_DREAM_CARDS);

    if (!mapped.some(card => card.isDefault)) {
      return [createDefaultDreamCard(), ...mapped].slice(0, MAX_DREAM_CARDS);
    }
    return mapped;
  }

  if (Array.isArray(legacyItems)) {
    const items = legacyItems
      .map(normalizeDreamItem)
      .filter((item): item is DreamItem => Boolean(item))
      .slice(0, MAX_DREAMS);
    return [{...createDefaultDreamCard(), items}];
  }

  return [createDefaultDreamCard()];
};
