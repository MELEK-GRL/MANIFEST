import React, {useEffect, useMemo, useRef} from 'react';
import {
  Animated,
  Image,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from '../Icons/Icon';
import T from '../Text/T';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';
import {resolveHolder, tiltFromKey, type HolderKind} from './holders';
import {
  noteHeightFor,
  type BoardItem,
  type BoardSize,
  type DreamCard,
  type DreamItem,
} from './types';

export const normalizeItem = (
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
  onDragStart?: () => void;
  onDragEnd?: () => void;
  deleteLabel: string;
  readOnly?: boolean;
};

export const PhotoHolder = ({kind}: {kind: HolderKind}) => {
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

export const CollagePiece = ({
  item,
  selected,
  board,
  itemWidth,
  itemHeight,
  token,
  onSelect,
  onChange,
  onDelete,
  onDragStart,
  onDragEnd,
  deleteLabel,
  readOnly = false,
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
    onDragStart,
    onDragEnd,
    readOnly,
  });
  latest.current = {
    item,
    board,
    itemWidth,
    itemHeight,
    onSelect,
    onChange,
    onDragStart,
    onDragEnd,
    readOnly,
  };

  useEffect(() => {
    pos.setValue({x: item.x, y: item.y});
  }, [item.x, item.y, pos]);

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !latest.current.readOnly,
        onMoveShouldSetPanResponder: () => !latest.current.readOnly,
        onPanResponderGrant: () => {
          if (latest.current.readOnly) {
            return;
          }
          const {item: it, onSelect: select, onDragStart: start} =
            latest.current;
          start?.();
          select(it.key);
        },
        onPanResponderMove: (_e, g) => {
          if (latest.current.readOnly) {
            return;
          }
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
          if (latest.current.readOnly) {
            return;
          }
          const {
            item: it,
            board: b,
            itemWidth: w,
            itemHeight: h,
            onChange: change,
            onDragEnd: end,
          } = latest.current;
          const maxX = Math.max(0, b.width - w * it.scale);
          const maxY = Math.max(0, b.height - h * it.scale);
          const nx = Math.min(maxX, Math.max(0, it.x + g.dx));
          const ny = Math.min(maxY, Math.max(0, it.y + g.dy));
          pos.setValue({x: nx, y: ny});
          change(it.key, {x: nx, y: ny});
          end?.();
        },
        onPanResponderTerminate: () => {
          latest.current.onDragEnd?.();
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
        disabled={readOnly}
        onPress={() => onSelect(item.key)}
        style={[
          pieceStyles.frame,
          selected ? pieceStyles.frameSelected : null,
        ]}>
        <Image source={imageSource} style={pieceStyles.image} />
      </TouchableOpacity>
      <PhotoHolder kind={item.holder} />
      {selected && !readOnly ? (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={deleteLabel}
          onPress={() => onDelete(item.key)}
          style={pieceStyles.deleteBtn}>
          <Icon name="close" size="small" color={colors.primary} />
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

type DreamCardPieceProps = {
  card: DreamCard;
  selected: boolean;
  board: BoardSize;
  noteWidth: number;
  title: string;
  emptyLabel: string;
  deleteCardLabel: string;
  deleteItemLabel: string;
  /** Sürüklerken seçim — modal açmaz */
  onSelect: (id: string) => void;
  /** Kısa dokunuş — düzenleme modalı */
  onOpen: (id: string) => void;
  onMove: (id: string, next: {x: number; y: number}) => void;
  onDeleteCard: (id: string) => void;
  onRemoveItem: (cardId: string, itemId: string) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  readOnly?: boolean;
};

export const DreamCardPiece = ({
  card,
  selected,
  board,
  noteWidth,
  title,
  emptyLabel,
  deleteCardLabel,
  deleteItemLabel,
  onSelect,
  onOpen,
  onMove,
  onDeleteCard,
  onRemoveItem,
  onDragStart,
  onDragEnd,
  readOnly = false,
}: DreamCardPieceProps) => {
  const cardHeight = noteHeightFor(card.items.length);
  const pos = useRef(new Animated.ValueXY({x: card.x, y: card.y})).current;
  const tilt = useMemo(() => tiltFromKey(card.id), [card.id]);
  const didDrag = useRef(false);
  const latest = useRef({
    card,
    board,
    noteWidth,
    cardHeight,
    onSelect,
    onMove,
    onDragStart,
    onDragEnd,
    readOnly,
  });
  latest.current = {
    card,
    board,
    noteWidth,
    cardHeight,
    onSelect,
    onMove,
    onDragStart,
    onDragEnd,
    readOnly,
  };

  useEffect(() => {
    pos.setValue({x: card.x, y: card.y});
  }, [card.x, card.y, pos]);

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_e, g) =>
          !latest.current.readOnly &&
          (Math.abs(g.dx) > 6 || Math.abs(g.dy) > 6),
        onPanResponderGrant: () => {
          if (latest.current.readOnly) {
            return;
          }
          didDrag.current = true;
          const {card: c, onSelect: select, onDragStart: start} =
            latest.current;
          start?.();
          select(c.id);
        },
        onPanResponderMove: (_e, g) => {
          if (latest.current.readOnly) {
            return;
          }
          const {
            card: c,
            board: b,
            noteWidth: w,
            cardHeight: h,
          } = latest.current;
          const maxX = Math.max(0, b.width - w);
          const maxY = Math.max(0, b.height - h);
          pos.setValue({
            x: Math.min(maxX, Math.max(0, c.x + g.dx)),
            y: Math.min(maxY, Math.max(0, c.y + g.dy)),
          });
        },
        onPanResponderRelease: (_e, g) => {
          if (latest.current.readOnly) {
            return;
          }
          const {
            card: c,
            board: b,
            noteWidth: w,
            cardHeight: h,
            onMove: move,
            onDragEnd: end,
          } = latest.current;
          const maxX = Math.max(0, b.width - w);
          const maxY = Math.max(0, b.height - h);
          const nx = Math.min(maxX, Math.max(0, c.x + g.dx));
          const ny = Math.min(maxY, Math.max(0, c.y + g.dy));
          pos.setValue({x: nx, y: ny});
          move(c.id, {x: nx, y: ny});
          end?.();
        },
        onPanResponderTerminate: () => {
          latest.current.onDragEnd?.();
        },
      }),
    [pos],
  );

  return (
    <Animated.View
      {...responder.panHandlers}
      style={[
        dreamCardStyles.wrap,
        {
          width: noteWidth,
          zIndex: selected ? 45 : 12,
          transform: [
            ...pos.getTranslateTransform(),
            {rotate: `${selected ? 0 : tilt}deg`},
          ],
        },
      ]}>
      <TouchableOpacity
        activeOpacity={1}
        disabled={readOnly}
        onPressIn={() => {
          didDrag.current = false;
        }}
        onPress={() => {
          if (readOnly || didDrag.current) {
            didDrag.current = false;
            return;
          }
          onOpen(card.id);
        }}
        style={[
          dreamCardStyles.note,
          selected ? dreamCardStyles.noteSelected : null,
        ]}>
        <View style={dreamCardStyles.pin} />
        <View style={dreamCardStyles.titleRow}>
          <T
            family="serif"
            italic
            size={fontSize.label}
            weight="700"
            color={colors.primaryDark}>
            {title}
          </T>
          <Icon name="heart" size="small" color={colors.primary} />
        </View>
        {card.items.length === 0 ? (
          <T
            size={fontSize.caption}
            weight="400"
            color={colors.textLight}
            style={dreamCardStyles.emptyText}>
            {emptyLabel}
          </T>
        ) : (
          card.items.map(item => (
            <View key={item.id} style={dreamCardStyles.row}>
              <T
                size={fontSize.caption}
                weight="500"
                color={colors.textMutedDark}
                numberOfLines={1}
                style={dreamCardStyles.itemText}>
                {item.text}
              </T>
              {!readOnly ? (
                <TouchableOpacity
                  onPress={() => onRemoveItem(card.id, item.id)}
                  hitSlop={{top: 6, bottom: 6, left: 6, right: 6}}
                  accessibilityRole="button"
                  accessibilityLabel={deleteItemLabel}>
                  <Icon name="close" size="small" color={colors.textLight} />
                </TouchableOpacity>
              ) : null}
            </View>
          ))
        )}
      </TouchableOpacity>
      {selected && !readOnly && !card.isDefault ? (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={deleteCardLabel}
          onPress={() => onDeleteCard(card.id)}
          style={pieceStyles.deleteBtn}>
          <Icon name="close" size="small" color={colors.primary} />
        </TouchableOpacity>
      ) : null}
    </Animated.View>
  );
};

const dreamCardStyles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    overflow: 'visible',
  },
  note: {
    backgroundColor: colors.cream,
    borderRadius: 10,
    paddingTop: 16,
    paddingBottom: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    elevation: 3,
  },
  noteSelected: {
    borderColor: colors.primary,
    shadowOpacity: 0.2,
  },
  preview: {
    position: 'relative',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  pin: {
    position: 'absolute',
    top: -6,
    alignSelf: 'center',
    left: '50%',
    marginLeft: -7,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.primarySoft,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 5,
  },
  itemText: {
    flex: 1,
  },
});

type DreamCardPreviewProps = {
  items: DreamItem[];
  title: string;
  emptyLabel: string;
  deleteItemLabel: string;
  noteWidth: number;
  onRemoveItem: (itemId: string) => void;
};

/** Board kartıyla aynı görünüm — CenterModal içinde doldurmak için */
export const DreamCardPreview = ({
  items,
  title,
  emptyLabel,
  deleteItemLabel,
  noteWidth,
  onRemoveItem,
}: DreamCardPreviewProps) => (
  <View style={[dreamCardStyles.note, {width: noteWidth}, dreamCardStyles.preview]}>
    <View style={dreamCardStyles.pin} />
    <View style={dreamCardStyles.titleRow}>
      <T
        family="serif"
        italic
        size={fontSize.label}
        weight="700"
        color={colors.primaryDark}>
        {title}
      </T>
      <Icon name="heart" size="small" color={colors.primary} />
    </View>
    {items.length === 0 ? (
      <T
        size={fontSize.caption}
        weight="400"
        color={colors.textLight}
        style={dreamCardStyles.emptyText}>
        {emptyLabel}
      </T>
    ) : (
      items.map(item => (
        <View key={item.id} style={dreamCardStyles.row}>
          <T
            size={fontSize.caption}
            weight="500"
            color={colors.textMutedDark}
            numberOfLines={1}
            style={dreamCardStyles.itemText}>
            {item.text}
          </T>
          <TouchableOpacity
            onPress={() => onRemoveItem(item.id)}
            hitSlop={{top: 6, bottom: 6, left: 6, right: 6}}
            accessibilityRole="button"
            accessibilityLabel={deleteItemLabel}>
            <Icon name="close" size="small" color={colors.textLight} />
          </TouchableOpacity>
        </View>
      ))
    )}
  </View>
);
