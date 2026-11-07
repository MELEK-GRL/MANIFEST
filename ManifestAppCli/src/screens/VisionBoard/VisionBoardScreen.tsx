import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Image,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageCropPicker from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient';
import {Icon, PageLayout, PopupModal, T} from '@components';
import {
  addVisionBoardItem,
  deleteVisionBoardItem,
  fetchVisionBoard,
  saveVisionBoardLayout,
  visionBoardErrorCode,
  visionBoardItemImageUrl,
} from '../../api/visionBoard';
import {useAuthStore} from '../../store/useAuthStore';
import {useT} from '../../store/useLocaleStore';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';
import {useResponsive} from '../../utils/deviceStore/device';

const ITEM_WIDTH = 112;
const ITEM_HEIGHT = 128;
const DRAFT_KEY = '@manifest/vision-board-draft';

const DREAM_KEYS = [
  'dreamTravel',
  'dreamHome',
  'dreamCareer',
  'dreamFreedom',
] as const;

type DreamKey = (typeof DREAM_KEYS)[number];

const DEFAULT_DREAMS: Record<DreamKey, boolean> = {
  dreamTravel: true,
  dreamHome: true,
  dreamCareer: false,
  dreamFreedom: false,
};

const HOLDERS = [
  'washi',
  'pin',
  'clip',
  'corner',
  'starPin',
  'sideClip',
  'heartPin',
  'clover',
] as const;

type HolderKind = (typeof HOLDERS)[number];

const tiltFromKey = (key: string) => {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash + key.charCodeAt(i) * (i + 1)) % 97;
  }
  return ((hash % 11) - 5) * 1.6;
};

const holderFromIndex = (index: number): HolderKind =>
  HOLDERS[((index % HOLDERS.length) + HOLDERS.length) % HOLDERS.length];

const LEGACY_HOLDER_MAP: Record<string, HolderKind> = {
  tapeGold: 'washi',
  tapeBlush: 'washi',
  tapeLavender: 'washi',
  tapeStrip: 'washi',
  cornerTape: 'corner',
  dualTape: 'washi',
  dualWashi: 'washi',
  wideWashi: 'washi',
};

type BoardItem = {
  key: string;
  serverId?: string;
  uri: string;
  x: number;
  y: number;
  scale: number;
  holder: HolderKind;
  pendingUpload?: boolean;
};

type DraftPayload = {
  items: BoardItem[];
  serverIds: string[];
  dreams?: Record<DreamKey, boolean>;
};

type BoardSize = {width: number; height: number};

type CollagePieceProps = {
  item: BoardItem;
  selected: boolean;
  board: BoardSize;
  itemWidth: number;
  itemHeight: number;
  token: string | null;
  onSelect: (key: string) => void;
  onChange: (key: string, next: Partial<BoardItem>) => void;
  onDelete: (key: string) => void;
  deleteLabel: string;
};

const resolveHolder = (value: unknown, index: number): HolderKind => {
  if (typeof value === 'string') {
    if ((HOLDERS as readonly string[]).includes(value)) {
      return value as HolderKind;
    }
    // Eski taslaklar çoğunlukla banttı; sırayı yeniden dağıt.
    if (LEGACY_HOLDER_MAP[value]) {
      return holderFromIndex(index);
    }
  }
  return holderFromIndex(index);
};

const normalizeItem = (
  item: Partial<BoardItem> &
    Pick<BoardItem, 'key' | 'uri' | 'x' | 'y' | 'scale'>,
  index: number,
): BoardItem => ({
  key: item.key,
  serverId: item.serverId,
  uri: item.uri,
  x: item.x,
  y: item.y,
  scale: item.scale,
  pendingUpload: item.pendingUpload,
  holder: resolveHolder(item.holder, index),
});

const PhotoHolder = ({kind}: {kind: HolderKind}) => {
  switch (kind) {
    case 'washi':
      return (
        <View pointerEvents="none" style={holderStyles.layer}>
          <View style={[holderStyles.washi, holderStyles.washiGold]} />
        </View>
      );
    case 'corner':
      return (
        <View pointerEvents="none" style={holderStyles.layer}>
          <View style={[holderStyles.cornerPiece, holderStyles.washiBlush]} />
        </View>
      );
    case 'pin':
      return (
        <View pointerEvents="none" style={holderStyles.layer}>
          <View style={holderStyles.pinWrap}>
            <View style={holderStyles.pinHead} />
            <View style={holderStyles.pinShine} />
            <View style={holderStyles.pinNeedle} />
          </View>
        </View>
      );
    case 'starPin':
      return (
        <View pointerEvents="none" style={holderStyles.layer}>
          <View style={holderStyles.starPinWrap}>
            <View style={holderStyles.starPinBase} />
            <Icon name="sparkles" size={14} color={colors.gold} />
          </View>
        </View>
      );
    case 'clip':
      return (
        <View pointerEvents="none" style={holderStyles.layer}>
          <View style={holderStyles.clipWrap}>
            <View style={holderStyles.clipBody} />
            <View style={holderStyles.clipWire} />
          </View>
        </View>
      );
    case 'sideClip':
      return (
        <View pointerEvents="none" style={holderStyles.layer}>
          <View style={holderStyles.sideClipWrap}>
            <View style={holderStyles.sideClipBody} />
            <View style={holderStyles.sideClipWire} />
          </View>
        </View>
      );
    case 'heartPin':
      return (
        <View pointerEvents="none" style={holderStyles.layer}>
          <View style={holderStyles.heartPinWrap}>
            <View style={holderStyles.heartPinBase} />
            <Icon name="heart" size={14} color={colors.primary} />
          </View>
        </View>
      );
    case 'clover':
      return (
        <View pointerEvents="none" style={holderStyles.layer}>
          <View style={holderStyles.cloverWrap}>
            <View style={holderStyles.cloverBase} />
            <Icon name="leaf" size={15} color={colors.primary} />
          </View>
        </View>
      );
    default:
      return null;
  }
};

const CollagePiece = ({
  item,
  selected,
  board,
  itemWidth,
  itemHeight,
  token,
  onSelect,
  onChange,
  onDelete,
  deleteLabel,
}: CollagePieceProps) => {
  const pos = useRef(new Animated.ValueXY({x: item.x, y: item.y})).current;
  const tilt = useMemo(() => tiltFromKey(item.key), [item.key]);
  const latest = useRef({
    item,
    board,
    itemWidth,
    itemHeight,
    onSelect,
    onChange,
  });
  latest.current = {item, board, itemWidth, itemHeight, onSelect, onChange};

  useEffect(() => {
    pos.setValue({x: item.x, y: item.y});
  }, [item.x, item.y, pos]);

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          const {item: it, onSelect: select} = latest.current;
          select(it.key);
        },
        onPanResponderMove: (_e, g) => {
          const {
            item: it,
            board: b,
            itemWidth: w,
            itemHeight: h,
          } = latest.current;
          const maxX = Math.max(0, b.width - w * it.scale);
          const maxY = Math.max(0, b.height - h * it.scale);
          pos.setValue({
            x: Math.min(maxX, Math.max(0, it.x + g.dx)),
            y: Math.min(maxY, Math.max(0, it.y + g.dy)),
          });
        },
        onPanResponderRelease: (_e, g) => {
          const {
            item: it,
            board: b,
            itemWidth: w,
            itemHeight: h,
            onChange: change,
          } = latest.current;
          const maxX = Math.max(0, b.width - w * it.scale);
          const maxY = Math.max(0, b.height - h * it.scale);
          const nx = Math.min(maxX, Math.max(0, it.x + g.dx));
          const ny = Math.min(maxY, Math.max(0, it.y + g.dy));
          pos.setValue({x: nx, y: ny});
          change(it.key, {x: nx, y: ny});
        },
      }),
    [pos],
  );

  const imageSource =
    item.pendingUpload || item.uri.startsWith('file://')
      ? {uri: item.uri}
      : {
          uri: item.uri,
          headers: token ? {Authorization: `Bearer ${token}`} : undefined,
        };

  return (
    <Animated.View
      {...responder.panHandlers}
      style={[
        pieceStyles.wrap,
        {
          width: itemWidth,
          height: itemHeight,
          zIndex: selected ? 40 : 10,
          transform: [
            ...pos.getTranslateTransform(),
            {scale: item.scale},
            {rotate: `${selected ? 0 : tilt}deg`},
          ],
        },
      ]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onSelect(item.key)}
        style={[
          pieceStyles.frame,
          selected ? pieceStyles.frameSelected : null,
        ]}>
        <Image source={imageSource} style={pieceStyles.image} />
      </TouchableOpacity>
      <PhotoHolder kind={item.holder} />
      {selected ? (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={deleteLabel}
          onPress={() => onDelete(item.key)}
          style={pieceStyles.deleteBtn}>
          <Icon name="close" size={14} color={colors.primary} />
        </TouchableOpacity>
      ) : null}
    </Animated.View>
  );
};

const holderStyles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    elevation: 12,
  },
  washi: {
    position: 'absolute',
    top: 2,
    alignSelf: 'center',
    left: '28%',
    width: '44%',
    height: 16,
    borderRadius: 3,
    opacity: 0.92,
    transform: [{rotate: '-6deg'}],
  },
  washiGold: {
    backgroundColor: colors.goldSoft,
  },
  washiBlush: {
    backgroundColor: colors.blush,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  cornerPiece: {
    position: 'absolute',
    top: 10,
    left: -2,
    width: 42,
    height: 15,
    borderRadius: 3,
    opacity: 0.95,
    transform: [{rotate: '-40deg'}],
  },
  pinWrap: {
    position: 'absolute',
    top: -2,
    left: '50%',
    marginLeft: -11,
    width: 22,
    alignItems: 'center',
  },
  pinHead: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.28,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 4,
  },
  pinShine: {
    position: 'absolute',
    top: 5,
    left: 6,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.primarySoft,
  },
  pinNeedle: {
    width: 2.5,
    height: 10,
    marginTop: -1,
    backgroundColor: colors.gold,
    borderRadius: 1,
  },
  starPinWrap: {
    position: 'absolute',
    top: -2,
    left: '50%',
    marginLeft: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.18,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 4,
  },
  starPinBase: {
    position: 'absolute',
    bottom: -6,
    width: 2,
    height: 8,
    backgroundColor: colors.goldSoft,
  },
  clipWrap: {
    position: 'absolute',
    top: -4,
    left: '50%',
    marginLeft: -10,
    width: 20,
    height: 34,
    alignItems: 'center',
  },
  clipBody: {
    width: 18,
    height: 30,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: colors.gold,
    backgroundColor: colors.cream,
  },
  clipWire: {
    position: 'absolute',
    top: 7,
    width: 8,
    height: 16,
    borderRadius: 4,
    borderWidth: 2.5,
    borderColor: colors.goldSoft,
    backgroundColor: colors.white,
  },
  sideClipWrap: {
    position: 'absolute',
    top: 18,
    right: -6,
    width: 18,
    height: 32,
    alignItems: 'center',
    transform: [{rotate: '18deg'}],
  },
  sideClipBody: {
    width: 16,
    height: 28,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  sideClipWire: {
    position: 'absolute',
    top: 6,
    width: 7,
    height: 14,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primaryDark,
    backgroundColor: colors.white,
  },
  heartPinWrap: {
    position: 'absolute',
    top: -2,
    left: '50%',
    marginLeft: -13,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.18,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 4,
  },
  heartPinBase: {
    position: 'absolute',
    bottom: -6,
    width: 2,
    height: 8,
    backgroundColor: colors.goldSoft,
  },
  cloverWrap: {
    position: 'absolute',
    top: 4,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.cream,
    borderWidth: 1.5,
    borderColor: colors.lavender,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.14,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 4,
    transform: [{rotate: '12deg'}],
  },
  cloverBase: {
    position: 'absolute',
    bottom: -5,
    width: 2,
    height: 7,
    backgroundColor: colors.goldSoft,
  },
});

const pieceStyles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    overflow: 'visible',
  },
  frame: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 8,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 6},
    elevation: 5,
  },
  frameSelected: {
    shadowOpacity: 0.26,
    shadowRadius: 16,
    elevation: 8,
  },
  image: {
    flex: 1,
    width: '100%',
    borderRadius: 8,
    backgroundColor: colors.blush,
  },
  deleteBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
    elevation: 14,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
});

const VisionBoardScreen = () => {
  const t = useT();
  const token = useAuthStore(state => state.token);
  const {w1px, h1px, fs1px} = useResponsive();
  const [items, setItems] = useState<BoardItem[]>([]);
  const [serverIds, setServerIds] = useState<string[]>([]);
  const [dreams, setDreams] = useState<Record<DreamKey, boolean>>(DEFAULT_DREAMS);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [board, setBoard] = useState<BoardSize>({width: 0, height: 0});
  const [loading, setLoading] = useState(true);
  const [cacheReady, setCacheReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'danger';
    message: string;
    mode?: 'alert' | 'clearConfirm';
  }>({visible: false, type: 'success', message: '', mode: 'alert'});
  const itemWidth = ITEM_WIDTH * w1px;
  const itemHeight = ITEM_HEIGHT * h1px;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        lead: {
          marginBottom: 14 * h1px,
        },
        leadText: {
          lineHeight: 21 * fs1px,
        },
        hintRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6 * w1px,
          marginBottom: 10 * h1px,
        },
        actions: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10 * w1px,
          marginBottom: 12 * h1px,
        },
        toolBtn: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6 * w1px,
          borderRadius: 16 * fs1px,
          paddingHorizontal: 12 * w1px,
          paddingVertical: 11 * h1px,
        },
        addChip: {
          backgroundColor: colors.blush,
          borderWidth: 1,
          borderColor: colors.borderSoft,
        },
        saveChip: {
          backgroundColor: colors.primary,
        },
        saveChipDisabled: {
          backgroundColor: colors.buttonMuted,
        },
        clearChip: {
          backgroundColor: colors.dangerSoft,
          borderWidth: 1,
          borderColor: colors.dangerBorder,
          flex: 0,
          paddingHorizontal: 14 * w1px,
        },
        clearChipDisabled: {
          opacity: 0.45,
        },
        boardShell: {
          width: '100%',
          borderRadius: 28 * fs1px,
          padding: 2.5 * w1px,
          backgroundColor: colors.primarySoft,
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.14,
          shadowRadius: 18,
          shadowOffset: {width: 0, height: 8},
          elevation: 5,
        },
        board: {
          width: '100%',
          height: 468 * h1px,
          borderRadius: 26 * fs1px,
          overflow: 'hidden',
          borderWidth: 1.5,
          borderColor: colors.white,
        },
        boardInner: {
          flex: 1,
        },
        decorSparkA: {
          position: 'absolute',
          top: 14 * h1px,
          left: 18 * w1px,
          opacity: 0.75,
          zIndex: 2,
        },
        decorSparkB: {
          position: 'absolute',
          top: 120 * h1px,
          right: 16 * w1px,
          opacity: 0.7,
          zIndex: 2,
        },
        decorSparkC: {
          position: 'absolute',
          bottom: 86 * h1px,
          left: 28 * w1px,
          opacity: 0.65,
          zIndex: 2,
        },
        decorSparkD: {
          position: 'absolute',
          bottom: 36 * h1px,
          right: 34 * w1px,
          opacity: 0.7,
          zIndex: 2,
        },
        decorHeartA: {
          position: 'absolute',
          top: 54 * h1px,
          left: 8 * w1px,
          opacity: 0.55,
          zIndex: 2,
          transform: [{rotate: '-18deg'}],
        },
        decorHeartB: {
          position: 'absolute',
          bottom: 54 * h1px,
          right: 10 * w1px,
          opacity: 0.5,
          zIndex: 2,
          transform: [{rotate: '12deg'}],
        },
        decorFlower: {
          position: 'absolute',
          bottom: 18 * h1px,
          left: 108 * w1px,
          opacity: 0.72,
          zIndex: 2,
          transform: [{rotate: '-8deg'}],
        },
        mottoWrap: {
          position: 'absolute',
          top: '42%',
          left: '50%',
          marginLeft: -62 * w1px,
          marginTop: -62 * h1px,
          width: 124 * w1px,
          height: 124 * w1px,
          borderRadius: 62 * w1px,
          backgroundColor: colors.peach,
          borderWidth: 1,
          borderColor: colors.white,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 12 * w1px,
          zIndex: 3,
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowOffset: {width: 0, height: 4},
          elevation: 3,
          transform: [{rotate: '-4deg'}],
        },
        mottoText: {
          textAlign: 'center',
          lineHeight: 18 * fs1px,
        },
        note: {
          position: 'absolute',
          top: 16 * h1px,
          right: 14 * w1px,
          width: 118 * w1px,
          backgroundColor: colors.white,
          borderRadius: 10 * fs1px,
          paddingTop: 16 * h1px,
          paddingBottom: 10 * h1px,
          paddingHorizontal: 10 * w1px,
          zIndex: 4,
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.12,
          shadowRadius: 8,
          shadowOffset: {width: 0, height: 3},
          elevation: 3,
          transform: [{rotate: '3deg'}],
        },
        pin: {
          position: 'absolute',
          top: -6 * h1px,
          alignSelf: 'center',
          left: '50%',
          marginLeft: -7 * w1px,
          width: 14 * w1px,
          height: 14 * w1px,
          borderRadius: 7 * w1px,
          backgroundColor: colors.primary,
          borderWidth: 2,
          borderColor: colors.primarySoft,
          zIndex: 5,
        },
        noteTitleRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4 * w1px,
          marginBottom: 8 * h1px,
        },
        dreamRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6 * w1px,
          marginBottom: 5 * h1px,
        },
        checkBox: {
          width: 14 * w1px,
          height: 14 * w1px,
          borderRadius: 3 * fs1px,
          borderWidth: 1.5,
          borderColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.white,
        },
        checkBoxOn: {
          backgroundColor: colors.primarySoft,
        },
        empty: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 28 * h1px,
          alignItems: 'center',
          zIndex: 5,
        },
        primaryBtn: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8 * w1px,
          backgroundColor: colors.primary,
          borderRadius: 16 * fs1px,
          paddingHorizontal: 16 * w1px,
          paddingVertical: 11 * h1px,
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.16,
          shadowRadius: 8,
          shadowOffset: {width: 0, height: 3},
          elevation: 3,
        },
      }),
    [w1px, h1px, fs1px],
  );

  const showModal = (
    type: 'success' | 'error' | 'danger',
    message: string,
    mode: 'alert' | 'clearConfirm' = 'alert',
  ) => {
    setModal({visible: true, type, message, mode});
  };

  const closeModal = () => {
    setModal(prev => ({...prev, visible: false, mode: 'alert'}));
  };

  const readDraft = async (): Promise<DraftPayload | null> => {
    try {
      const raw = await AsyncStorage.getItem(DRAFT_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as DraftPayload;
      if (!parsed || !Array.isArray(parsed.items)) {
        return null;
      }
      return {
        items: parsed.items,
        serverIds: Array.isArray(parsed.serverIds) ? parsed.serverIds : [],
        dreams: parsed.dreams,
      };
    } catch {
      return null;
    }
  };

  const writeDraft = async (payload: DraftPayload) => {
    try {
      await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
    } catch {
      // ignore cache write errors
    }
  };

  const loadBoard = useCallback(async () => {
    setLoading(true);
    setCacheReady(false);
    try {
      const draft = await readDraft();
      if (draft) {
        setItems(draft.items.map((item, index) => normalizeItem(item, index)));
        setServerIds(draft.serverIds);
        setDreams({...DEFAULT_DREAMS, ...(draft.dreams || {})});
        setLoading(false);
        setCacheReady(true);
        return;
      }

      if (!token) {
        setItems([]);
        setServerIds([]);
        setDreams(DEFAULT_DREAMS);
        setLoading(false);
        setCacheReady(true);
        return;
      }

      const boardData = await fetchVisionBoard();
      const version = Date.now();
      const mapped: BoardItem[] = boardData.items.map((item, index) =>
        normalizeItem(
          {
            key: item.id,
            serverId: item.id,
            uri: visionBoardItemImageUrl(item.id, version),
            x: item.x,
            y: item.y,
            scale: item.scale || 1,
          },
          index,
        ),
      );
      setItems(mapped);
      setServerIds(mapped.map(item => item.serverId!).filter(Boolean));
      await writeDraft({
        items: mapped,
        serverIds: mapped.map(item => item.serverId!).filter(Boolean),
        dreams: DEFAULT_DREAMS,
      });
    } catch {
      const draft = await readDraft();
      if (draft) {
        setItems(draft.items.map((item, index) => normalizeItem(item, index)));
        setServerIds(draft.serverIds);
        setDreams({...DEFAULT_DREAMS, ...(draft.dreams || {})});
      } else {
        showModal('error', t('vision.loadError'));
      }
    } finally {
      setLoading(false);
      setCacheReady(true);
    }
  }, [token, t]);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  useEffect(() => {
    if (!cacheReady || loading) {
      return;
    }
    writeDraft({items, serverIds, dreams});
  }, [items, serverIds, dreams, cacheReady, loading]);

  const onBoardLayout = (e: LayoutChangeEvent) => {
    const {width, height} = e.nativeEvent.layout;
    setBoard({width, height});
  };

  const updateItem = useCallback((key: string, next: Partial<BoardItem>) => {
    setItems(prev => prev.map(it => (it.key === key ? {...it, ...next} : it)));
  }, []);

  const deleteItem = useCallback((key: string) => {
    setItems(prev => prev.filter(it => it.key !== key));
    setSelectedKey(curr => (curr === key ? null : curr));
  }, []);

  const clearAllPhotos = () => {
    setItems([]);
    setSelectedKey(null);
    closeModal();
    showModal('success', t('vision.clearAllDone'));
  };

  const requestClearAll = () => {
    if (items.length === 0) {
      return;
    }
    showModal('danger', t('vision.clearAllConfirm'), 'clearConfirm');
  };

  const toggleDream = (key: DreamKey) => {
    setDreams(prev => ({...prev, [key]: !prev[key]}));
  };

  const addPhoto = async () => {
    try {
      const picked = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        width: 900,
        height: 900,
        compressImageQuality: 0.85,
        cropperToolbarTitle: t('vision.addPhoto'),
        cropperTintColor: colors.primary,
      });
      const path = picked.path.startsWith('file://')
        ? picked.path
        : `file://${picked.path}`;
      const offset = (items.length % 5) * 18 * w1px;
      const next: BoardItem = {
        key: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        uri: path,
        x: Math.min(
          Math.max(16 * w1px + offset, 0),
          Math.max(0, board.width - itemWidth - 16 * w1px),
        ),
        y: Math.min(
          Math.max(56 * h1px + offset, 0),
          Math.max(0, board.height - itemHeight - 24 * h1px),
        ),
        scale: 1,
        holder: holderFromIndex(items.length),
        pendingUpload: true,
      };
      setItems(prev => [...prev, next]);
      setSelectedKey(next.key);
    } catch (err: unknown) {
      const code =
        typeof err === 'object' && err && 'code' in err
          ? String((err as {code?: string}).code)
          : '';
      if (code === 'E_PICKER_CANCELLED') {
        return;
      }
    }
  };

  const saveBoard = async () => {
    if (!token || saving) {
      if (!token) {
        showModal('error', t('vision.loginRequired'));
      }
      return;
    }
    setSaving(true);
    try {
      const keepServerIds = new Set(
        items.map(item => item.serverId).filter(Boolean) as string[],
      );
      for (const id of serverIds) {
        if (!keepServerIds.has(id)) {
          await deleteVisionBoardItem(id);
        }
      }

      const nextItems: BoardItem[] = [];
      for (const item of items) {
        if (item.pendingUpload || !item.serverId) {
          const created = await addVisionBoardItem({
            uri: item.uri,
            type: 'image/jpeg',
            name: 'vision.jpg',
            x: item.x,
            y: item.y,
            scale: item.scale,
          });
          nextItems.push({
            ...item,
            key: created.id,
            serverId: created.id,
            uri: visionBoardItemImageUrl(created.id, Date.now()),
            pendingUpload: false,
          });
        } else {
          nextItems.push(item);
        }
      }

      await saveVisionBoardLayout(
        nextItems
          .filter(item => item.serverId)
          .map(item => ({
            id: item.serverId!,
            x: item.x,
            y: item.y,
            scale: item.scale,
          })),
      );

      const nextServerIds = nextItems
        .map(item => item.serverId!)
        .filter(Boolean);
      setItems(nextItems);
      setServerIds(nextServerIds);
      await writeDraft({items: nextItems, serverIds: nextServerIds, dreams});
      showModal('success', t('vision.saved'));
    } catch (error) {
      const code = visionBoardErrorCode(error);
      if (code === 'board_full') {
        showModal('error', t('vision.boardFull'));
      } else if (code === 'photo_too_large') {
        showModal('error', t('vision.photoTooLarge'));
      } else {
        showModal('error', t('vision.saveError'));
      }
    } finally {
      setSaving(false);
    }
  };

  const canSave =
    Boolean(token) && !saving && (items.length > 0 || serverIds.length > 0);
  const canClear = items.length > 0 && !saving;

  const scrapbookDecor = (
    <>
      <Icon
        name="sparkles"
        size={15}
        color={colors.primary}
        style={styles.decorSparkA}
      />
      <Icon
        name="sparkles"
        size={13}
        color={colors.gold}
        style={styles.decorSparkB}
      />
      <Icon
        name="sparkles"
        size={14}
        color={colors.primary}
        style={styles.decorSparkC}
      />
      <Icon
        name="sparkles"
        size={12}
        color={colors.gold}
        style={styles.decorSparkD}
      />
      <Icon
        name="heart-outline"
        size={18}
        color={colors.primary}
        style={styles.decorHeartA}
      />
      <Icon
        name="heart-outline"
        size={16}
        color={colors.primary}
        style={styles.decorHeartB}
      />
      <Icon
        name="flower-outline"
        size={22}
        color={colors.primary}
        style={styles.decorFlower}
      />

      <View style={styles.mottoWrap} pointerEvents="none">
        <T
          family="serif"
          italic
          size={fontSize.caption}
          weight="600"
          color={colors.primaryDark}
          style={styles.mottoText}>
          {t('vision.motto')}
        </T>
        <Icon
          name="heart"
          size={12}
          color={colors.primary}
          style={{marginTop: 4 * h1px}}
        />
      </View>

      <View style={styles.note}>
        <View style={styles.pin} />
        <View style={styles.noteTitleRow}>
          <T
            family="serif"
            italic
            size={fontSize.caption}
            weight="700"
            color={colors.primaryDark}>
            {t('vision.dreamListTitle')}
          </T>
          <Icon name="heart" size={10} color={colors.primary} />
        </View>
        {DREAM_KEYS.map(key => {
          const checked = dreams[key];
          return (
            <TouchableOpacity
              key={key}
              style={styles.dreamRow}
              activeOpacity={0.8}
              onPress={() => toggleDream(key)}
              accessibilityRole="checkbox"
              accessibilityState={{checked}}>
              <View
                style={[styles.checkBox, checked ? styles.checkBoxOn : null]}>
                {checked ? (
                  <Icon name="checkmark" size={10} color={colors.primary} />
                ) : null}
              </View>
              <T
                size={fontSize.caption}
                weight="500"
                color={colors.textMutedDark}>
                {t(`vision.${key}`)}
              </T>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );

  return (
    <PageLayout title={t('vision.title')}>
      <View style={styles.lead}>
        <T
          size={fontSize.bodySmall}
          weight="400"
          color={colors.textMutedDark}
          style={styles.leadText}>
          {t('vision.subtitle')}
        </T>
      </View>

      <View style={styles.hintRow}>
        <Icon name="move-outline" size={15} color={colors.gold} />
        <T size={fontSize.caption} weight="500" color={colors.textMuted}>
          {t('vision.hint')}
        </T>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.toolBtn, styles.addChip]}
          activeOpacity={0.88}
          onPress={addPhoto}
          accessibilityRole="button"
          accessibilityLabel={t('vision.addPhoto')}>
          <Icon name="add" size={15} color={colors.primary} />
          <T size={fontSize.label} weight="700" color={colors.primaryDark}>
            {t('vision.addMore')}
          </T>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toolBtn,
            styles.clearChip,
            !canClear ? styles.clearChipDisabled : null,
          ]}
          activeOpacity={0.88}
          disabled={!canClear}
          onPress={requestClearAll}
          accessibilityRole="button"
          accessibilityLabel={t('vision.clearAll')}>
          <Icon name="trash-outline" size={15} color={colors.dangerText} />
          <T size={fontSize.label} weight="700" color={colors.dangerText}>
            {t('vision.clearAll')}
          </T>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toolBtn,
            styles.saveChip,
            !canSave ? styles.saveChipDisabled : null,
          ]}
          activeOpacity={0.88}
          disabled={!canSave}
          onPress={saveBoard}
          accessibilityRole="button"
          accessibilityLabel={t('vision.save')}>
          <Icon name="checkmark" size={15} color={colors.textWhite} />
          <T size={fontSize.label} weight="700" color={colors.textWhite}>
            {saving ? t('vision.saving') : t('vision.save')}
          </T>
        </TouchableOpacity>
      </View>

      <View style={styles.boardShell}>
        <LinearGradient
          colors={[colors.peach, colors.cream, colors.lavender]}
          start={{x: 0.1, y: 0}}
          end={{x: 0.9, y: 1}}
          style={styles.board}>
          <View style={styles.boardInner} onLayout={onBoardLayout}>
            {scrapbookDecor}

            {!loading && items.length === 0 ? (
              <View style={styles.empty} pointerEvents="box-none">
                <TouchableOpacity
                  style={styles.primaryBtn}
                  activeOpacity={0.88}
                  onPress={addPhoto}
                  accessibilityRole="button"
                  accessibilityLabel={t('vision.addPhoto')}>
                  <Icon name="image-outline" size={16} color={colors.textWhite} />
                  <T size={fontSize.label} weight="700" color={colors.textWhite}>
                    {t('vision.addPhoto')}
                  </T>
                </TouchableOpacity>
              </View>
            ) : null}

            {items.map(item => (
              <CollagePiece
                key={item.key}
                item={item}
                selected={selectedKey === item.key}
                board={board}
                itemWidth={itemWidth}
                itemHeight={itemHeight}
                token={token}
                onSelect={setSelectedKey}
                onChange={updateItem}
                onDelete={deleteItem}
                deleteLabel={t('vision.delete')}
              />
            ))}
          </View>
        </LinearGradient>
      </View>

      <PopupModal
        visible={modal.visible}
        type={modal.type}
        message={modal.message}
        leftButtonText={
          modal.mode === 'clearConfirm' ? t('common.cancel') : undefined
        }
        rightButtonText={
          modal.mode === 'clearConfirm' ? t('vision.clearAll') : undefined
        }
        onLeftPress={modal.mode === 'clearConfirm' ? closeModal : undefined}
        onRightPress={
          modal.mode === 'clearConfirm' ? clearAllPhotos : undefined
        }
        onClose={closeModal}
      />
    </PageLayout>
  );
};

export default VisionBoardScreen;
