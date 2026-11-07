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

const ITEM_SIZE = 118;
const DRAFT_KEY = '@manifest/vision-board-draft';

type BoardItem = {
  key: string;
  serverId?: string;
  uri: string;
  x: number;
  y: number;
  scale: number;
  pendingUpload?: boolean;
};

type DraftPayload = {
  items: BoardItem[];
  serverIds: string[];
};

type BoardSize = {width: number; height: number};

type CollagePieceProps = {
  item: BoardItem;
  selected: boolean;
  board: BoardSize;
  itemSize: number;
  radius: number;
  token: string | null;
  onSelect: (key: string) => void;
  onChange: (key: string, next: Partial<BoardItem>) => void;
  onDelete: (key: string) => void;
  deleteLabel: string;
};

const CollagePiece = ({
  item,
  selected,
  board,
  itemSize,
  radius,
  token,
  onSelect,
  onChange,
  onDelete,
  deleteLabel,
}: CollagePieceProps) => {
  const pos = useRef(new Animated.ValueXY({x: item.x, y: item.y})).current;
  const latest = useRef({item, board, itemSize, onSelect, onChange});
  latest.current = {item, board, itemSize, onSelect, onChange};

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
          const {item: it, board: b, itemSize: size} = latest.current;
          const maxX = Math.max(0, b.width - size * it.scale);
          const maxY = Math.max(0, b.height - size * it.scale);
          pos.setValue({
            x: Math.min(maxX, Math.max(0, it.x + g.dx)),
            y: Math.min(maxY, Math.max(0, it.y + g.dy)),
          });
        },
        onPanResponderRelease: (_e, g) => {
          const {item: it, board: b, itemSize: size, onChange: change} =
            latest.current;
          const maxX = Math.max(0, b.width - size * it.scale);
          const maxY = Math.max(0, b.height - size * it.scale);
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
          width: itemSize,
          height: itemSize,
          zIndex: selected ? 20 : 1,
          transform: [...pos.getTranslateTransform(), {scale: item.scale}],
        },
      ]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onSelect(item.key)}
        style={[
          pieceStyles.card,
          {borderRadius: radius},
          selected ? pieceStyles.cardSelected : null,
        ]}>
        <Image source={imageSource} style={pieceStyles.image} />
      </TouchableOpacity>
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

const pieceStyles = StyleSheet.create({
  wrap: {
    position: 'absolute',
  },
  card: {
    flex: 1,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderGlass,
    backgroundColor: colors.white,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 3,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: colors.gold,
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
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
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
});

const VisionBoardScreen = () => {
  const t = useT();
  const token = useAuthStore(state => state.token);
  const {w1px, h1px, fs1px} = useResponsive();
  const [items, setItems] = useState<BoardItem[]>([]);
  const [serverIds, setServerIds] = useState<string[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [board, setBoard] = useState<BoardSize>({width: 0, height: 0});
  const [loading, setLoading] = useState(true);
  const [cacheReady, setCacheReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState<{
    visible: boolean;
    type: 'success' | 'error';
    message: string;
  }>({visible: false, type: 'success', message: ''});
  const itemSize = ITEM_SIZE * w1px;
  const pieceRadius = 18 * fs1px;

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
        boardShell: {
          width: '100%',
          borderRadius: 26 * fs1px,
          padding: 3 * w1px,
          backgroundColor: colors.goldSoft,
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.12,
          shadowRadius: 16,
          shadowOffset: {width: 0, height: 6},
          elevation: 4,
        },
        board: {
          width: '100%',
          height: 448 * h1px,
          borderRadius: 24 * fs1px,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors.borderSoft,
        },
        boardInner: {
          flex: 1,
        },
        empty: {
          ...StyleSheet.absoluteFillObject,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 28 * w1px,
        },
        emptyBadge: {
          width: 52 * w1px,
          height: 52 * w1px,
          borderRadius: 26 * w1px,
          backgroundColor: colors.white,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 14 * h1px,
          borderWidth: 1,
          borderColor: colors.goldSoft,
        },
        emptyTitle: {
          marginBottom: 8 * h1px,
          textAlign: 'center',
        },
        emptyBody: {
          textAlign: 'center',
          lineHeight: 21 * fs1px,
          marginBottom: 18 * h1px,
        },
        primaryBtn: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8 * w1px,
          backgroundColor: colors.primary,
          borderRadius: 16 * fs1px,
          paddingHorizontal: 16 * w1px,
          paddingVertical: 11 * h1px,
        },
      }),
    [w1px, h1px, fs1px],
  );

  const showModal = (type: 'success' | 'error', message: string) => {
    setModal({visible: true, type, message});
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
        setItems(draft.items);
        setServerIds(draft.serverIds);
        setLoading(false);
        setCacheReady(true);
        return;
      }

      if (!token) {
        setItems([]);
        setServerIds([]);
        setLoading(false);
        setCacheReady(true);
        return;
      }

      const boardData = await fetchVisionBoard();
      const version = Date.now();
      const mapped: BoardItem[] = boardData.items.map(item => ({
        key: item.id,
        serverId: item.id,
        uri: visionBoardItemImageUrl(item.id, version),
        x: item.x,
        y: item.y,
        scale: item.scale || 1,
      }));
      setItems(mapped);
      setServerIds(mapped.map(item => item.serverId!).filter(Boolean));
      await writeDraft({
        items: mapped,
        serverIds: mapped.map(item => item.serverId!).filter(Boolean),
      });
    } catch {
      const draft = await readDraft();
      if (draft) {
        setItems(draft.items);
        setServerIds(draft.serverIds);
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
    writeDraft({items, serverIds});
  }, [items, serverIds, cacheReady, loading]);

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
          Math.max(0, board.width - itemSize - 16 * w1px),
        ),
        y: Math.min(
          Math.max(24 * h1px + offset, 0),
          Math.max(0, board.height - itemSize - 24 * h1px),
        ),
        scale: 1,
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
      await writeDraft({items: nextItems, serverIds: nextServerIds});
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

  const canSave = Boolean(token) && !saving && (items.length > 0 || serverIds.length > 0);

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
          colors={[colors.cream, colors.blush, colors.lavender]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.board}>
          <View style={styles.boardInner} onLayout={onBoardLayout}>
            {!loading && items.length === 0 ? (
              <View style={styles.empty} pointerEvents="box-none">
                <View style={styles.emptyBadge}>
                  <Icon name="sparkles" size={20} color={colors.gold} />
                </View>
                <T
                  family="serif"
                  size={fontSize.title}
                  weight="700"
                  color={colors.textDark}
                  style={styles.emptyTitle}>
                  {t('vision.emptyTitle')}
                </T>
                <T
                  size={fontSize.bodySmall}
                  weight="400"
                  color={colors.textMutedDark}
                  style={styles.emptyBody}>
                  {t('vision.emptyBody')}
                </T>
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
            ) : (
              items.map(item => (
                <CollagePiece
                  key={item.key}
                  item={item}
                  selected={selectedKey === item.key}
                  board={board}
                  itemSize={itemSize}
                  radius={pieceRadius}
                  token={token}
                  onSelect={setSelectedKey}
                  onChange={updateItem}
                  onDelete={deleteItem}
                  deleteLabel={t('vision.delete')}
                />
              ))
            )}
          </View>
        </LinearGradient>
      </View>

      <PopupModal
        visible={modal.visible}
        type={modal.type}
        message={modal.message}
        onClose={() => setModal(prev => ({...prev, visible: false}))}
      />
    </PageLayout>
  );
};

export default VisionBoardScreen;
