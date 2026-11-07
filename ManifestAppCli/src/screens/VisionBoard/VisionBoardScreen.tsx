import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageCropPicker from 'react-native-image-crop-picker';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  CenterModal,
  Icon,
  PageLayout,
  PopupModal,
  T,
  TextInput,
  VisionBoardWorkspace,
} from '@components';
import {
  addVisionBoardItem,
  deleteVisionBoardItem,
  fetchVisionBoard,
  saveVisionBoardLayout,
  visionBoardErrorCode,
  visionBoardItemImageUrl,
} from '../../api/visionBoard';
import {
  DRAFT_KEY,
  DEFAULT_DREAM_CARD_ID,
  DreamCardPreview,
  ITEM_HEIGHT,
  ITEM_WIDTH,
  MAX_DREAM_CARDS,
  MAX_DREAMS,
  NOTE_WIDTH,
  appendSavedBoard,
  createDefaultDreamCard,
  holderFromIndex,
  normalizeDreamCards,
  normalizeItem,
  noteHeightFor,
  spawnPosForIndex,
  type BoardItem,
  type BoardSize,
  type DraftPayload,
  type DreamCard,
  type DreamItem,
} from '../../components/VisionBoard';
import {useAuthStore} from '../../store/useAuthStore';
import {useT} from '../../store/useLocaleStore';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';
import {useResponsive} from '../../utils/deviceStore/device';
import type {RootStackParamList} from '../../navigation/types';

const VisionBoardScreen = () => {
  const t = useT();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const token = useAuthStore(state => state.token);
  const {w1px, h1px, fs1px} = useResponsive();
  const [items, setItems] = useState<BoardItem[]>([]);
  const [serverIds, setServerIds] = useState<string[]>([]);
  const [dreamCards, setDreamCards] = useState<DreamCard[]>([
    createDefaultDreamCard(),
  ]);
  const [activeDreamCardId, setActiveDreamCardId] = useState(
    DEFAULT_DREAM_CARD_ID,
  );
  const [dreamDraft, setDreamDraft] = useState('');
  const [cardEditor, setCardEditor] = useState<{
    visible: boolean;
    mode: 'create' | 'edit';
    cardId: string | null;
    items: DreamItem[];
  }>({visible: false, mode: 'create', cardId: null, items: []});
  const [editorAddedViaPlus, setEditorAddedViaPlus] = useState(false);
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
        editorBody: {
          width: '100%',
          alignItems: 'center',
          gap: 12 * h1px,
        },
        editorInputRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8 * w1px,
          width: '100%',
        },
        dreamInputWrap: {
          flex: 1,
          marginBottom: 0,
          minWidth: 0,
        },
        dreamInput: {
          paddingVertical: 8 * h1px,
          paddingHorizontal: 12 * w1px,
        },
        dreamIconBtn: {
          width: 38 * w1px,
          height: 38 * w1px,
          borderRadius: 19 * w1px,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.primary,
        },
        dreamIconBtnDisabled: {
          opacity: 0.4,
        },
        editorCount: {
          alignSelf: 'flex-end',
        },
      }),
    [w1px, h1px, fs1px],
  );

  const updateItem = useCallback((key: string, next: Partial<BoardItem>) => {
    setItems(prev => prev.map(it => (it.key === key ? {...it, ...next} : it)));
  }, []);

  const deleteItem = useCallback((key: string) => {
    setItems(prev => prev.filter(it => it.key !== key));
    setSelectedKey(curr => (curr === key ? null : curr));
  }, []);

  const moveDreamCard = useCallback(
    (cardId: string, next: {x: number; y: number}) => {
      setDreamCards(prev =>
        prev.map(card => (card.id === cardId ? {...card, ...next} : card)),
      );
    },
    [],
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
        dreamCards: normalizeDreamCards(parsed.dreamCards, parsed.dreamItems),
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
        const cards = draft.dreamCards || [createDefaultDreamCard()];
        setItems(draft.items.map((item, index) => normalizeItem(item, index)));
        setServerIds(draft.serverIds);
        setDreamCards(cards);
        setActiveDreamCardId(
          cards.find(card => card.isDefault)?.id ||
            cards[0]?.id ||
            DEFAULT_DREAM_CARD_ID,
        );
        setLoading(false);
        setCacheReady(true);
        return;
      }

      if (!token) {
        setItems([]);
        setServerIds([]);
        setDreamCards([createDefaultDreamCard()]);
        setActiveDreamCardId(DEFAULT_DREAM_CARD_ID);
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
      const starterCards = [createDefaultDreamCard()];
      setItems(mapped);
      setServerIds(mapped.map(item => item.serverId!).filter(Boolean));
      setDreamCards(starterCards);
      setActiveDreamCardId(DEFAULT_DREAM_CARD_ID);
      await writeDraft({
        items: mapped,
        serverIds: mapped.map(item => item.serverId!).filter(Boolean),
        dreamCards: starterCards,
      });
    } catch {
      const draft = await readDraft();
      if (draft) {
        const cards = draft.dreamCards || [createDefaultDreamCard()];
        setItems(draft.items.map((item, index) => normalizeItem(item, index)));
        setServerIds(draft.serverIds);
        setDreamCards(cards);
        setActiveDreamCardId(cards[0]?.id || DEFAULT_DREAM_CARD_ID);
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
    writeDraft({items, serverIds, dreamCards});
  }, [items, serverIds, dreamCards, cacheReady, loading]);

  const onBoardLayout = (e: LayoutChangeEvent) => {
    const {width, height} = e.nativeEvent.layout;
    setBoard({width, height});
    if (width <= 0 || height <= 0) {
      return;
    }
    const noteW = NOTE_WIDTH * w1px;
    setDreamCards(prev => {
      let changed = false;
      const next = prev.map(card => {
        const maxX = Math.max(0, width - noteW);
        const maxY = Math.max(0, height - noteHeightFor(card.items.length));
        const x = Math.min(maxX, Math.max(0, card.x));
        const y = Math.min(maxY, Math.max(0, card.y));
        if (x !== card.x || y !== card.y) {
          changed = true;
          return {...card, x, y};
        }
        return card;
      });
      return changed ? next : prev;
    });
  };

  const clearAllBoard = () => {
    setItems([]);
    setSelectedKey(null);
    setDreamCards([createDefaultDreamCard()]);
    setActiveDreamCardId(DEFAULT_DREAM_CARD_ID);
    setDreamDraft('');
    setCardEditor({
      visible: false,
      mode: 'create',
      cardId: null,
      items: [],
    });
    closeModal();
    showModal('success', t('vision.clearAllDone'));
  };

  const requestClearAll = () => {
    const hasPhotos = items.length > 0;
    const hasDreams = dreamCards.some(
      card => card.items.length > 0 || !card.isDefault,
    );
    if (!hasPhotos && !hasDreams) {
      return;
    }
    showModal('danger', t('vision.clearAllConfirm'), 'clearConfirm');
  };

  const removeDream = (cardId: string, itemId: string) => {
    const target = dreamCards.find(card => card.id === cardId);
    if (!target) {
      return;
    }
    const nextItems = target.items.filter(item => item.id !== itemId);
    if (!target.isDefault && nextItems.length === 0 && dreamCards.length > 1) {
      const next = dreamCards.filter(card => card.id !== cardId);
      setDreamCards(next);
      setActiveDreamCardId(curr =>
        curr === cardId
          ? next.find(card => card.isDefault)?.id ||
            next[0]?.id ||
            DEFAULT_DREAM_CARD_ID
          : curr,
      );
      return;
    }
    setDreamCards(prev =>
      prev.map(card =>
        card.id !== cardId ? card : {...card, items: nextItems},
      ),
    );
  };

  const buildDreamCard = (
    index: number,
    items: DreamItem[] = [],
  ): DreamCard => {
    const id = `dream-card-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 6)}`;
    const spawn = spawnPosForIndex(index);
    const maxX = Math.max(0, board.width - NOTE_WIDTH * w1px);
    const maxY = Math.max(
      0,
      board.height - noteHeightFor(items.length) * h1px,
    );
    return {
      id,
      isDefault: false,
      items,
      x: Math.min(spawn.x * w1px, maxX || spawn.x * w1px),
      y: Math.min(spawn.y * h1px, maxY || spawn.y * h1px),
    };
  };

  const makeDreamItem = (text: string): DreamItem => ({
    id: `dream-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    text: text.slice(0, 40),
    checked: false,
  });

  const openEditCardEditor = (cardId: string) => {
    const card = dreamCards.find(c => c.id === cardId);
    if (!card) {
      return;
    }
    setActiveDreamCardId(cardId);
    setSelectedKey(null);
    setDreamDraft('');
    setEditorAddedViaPlus(false);
    setCardEditor({
      visible: true,
      mode: 'edit',
      cardId,
      items: card.items.map(item => ({...item})),
    });
  };

  const openCreateCardEditor = () => {
    const onlyEmptyDefault =
      dreamCards.length === 1 &&
      dreamCards[0]?.isDefault &&
      dreamCards[0].items.length === 0;
    if (onlyEmptyDefault) {
      openEditCardEditor(dreamCards[0].id);
      return;
    }
    if (dreamCards.length >= MAX_DREAM_CARDS) {
      showModal('error', t('vision.dreamCardsMax'));
      return;
    }
    setSelectedKey(null);
    setDreamDraft('');
    setEditorAddedViaPlus(false);
    setCardEditor({
      visible: true,
      mode: 'create',
      cardId: null,
      items: [],
    });
  };

  const closeCardEditor = () => {
    setCardEditor({
      visible: false,
      mode: 'create',
      cardId: null,
      items: [],
    });
    setDreamDraft('');
    setEditorAddedViaPlus(false);
  };

  const addEditorDream = () => {
    const text = dreamDraft.trim();
    if (!text) {
      return;
    }
    if (cardEditor.items.length >= MAX_DREAMS) {
      return;
    }
    setCardEditor(prev => ({
      ...prev,
      items: [...prev.items, makeDreamItem(text)],
    }));
    setDreamDraft('');
    setEditorAddedViaPlus(true);
  };

  const removeEditorDream = (itemId: string) => {
    setCardEditor(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
    }));
  };

  const commitCardEditor = () => {
    if (!editorAddedViaPlus) {
      return;
    }
    const nextItems = cardEditor.items;

    if (cardEditor.mode === 'create') {
      if (nextItems.length === 0) {
        return;
      }
      if (dreamCards.length >= MAX_DREAM_CARDS) {
        closeCardEditor();
        showModal('error', t('vision.dreamCardsMax'));
        return;
      }
      const next = buildDreamCard(dreamCards.length, nextItems);
      setDreamCards(prev =>
        prev.length >= MAX_DREAM_CARDS ? prev : [...prev, next],
      );
      setActiveDreamCardId(next.id);
      closeCardEditor();
      return;
    }

    if (!cardEditor.cardId) {
      closeCardEditor();
      return;
    }
    const editId = cardEditor.cardId;
    setDreamCards(prev => {
      const target = prev.find(card => card.id === editId);
      if (
        target &&
        !target.isDefault &&
        nextItems.length === 0 &&
        prev.length > 1
      ) {
        const next = prev.filter(card => card.id !== editId);
        setActiveDreamCardId(
          next.find(card => card.isDefault)?.id ||
            next[0]?.id ||
            DEFAULT_DREAM_CARD_ID,
        );
        return next;
      }
      return prev.map(card =>
        card.id === editId ? {...card, items: nextItems} : card,
      );
    });
    closeCardEditor();
  };

  const addDreamCard = openCreateCardEditor;

  const deleteDreamCard = (cardId: string) => {
    if (dreamCards.length <= 1) {
      return;
    }
    const target = dreamCards.find(card => card.id === cardId);
    if (!target) {
      return;
    }
    let next = dreamCards.filter(card => card.id !== cardId);
    if (target.isDefault) {
      next = next.map((card, index) =>
        index === 0 ? {...card, isDefault: true} : {...card, isDefault: false},
      );
    }
    setDreamCards(next);
    setActiveDreamCardId(curr =>
      curr === cardId
        ? next.find(card => card.isDefault)?.id ||
          next[0]?.id ||
          DEFAULT_DREAM_CARD_ID
        : curr,
    );
  };

  const selectDreamCard = (cardId: string) => {
    setActiveDreamCardId(cardId);
    setSelectedKey(null);
  };

  const openDreamCard = (cardId: string) => {
    openEditCardEditor(cardId);
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

  const uploadBoardPhotos = async (
    source: BoardItem[],
  ): Promise<BoardItem[]> => {
    const nextItems: BoardItem[] = [];
    for (const item of source) {
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
    return nextItems;
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

      let nextItems = await uploadBoardPhotos(items);
      const layoutPayload = () =>
        nextItems
          .filter(item => item.serverId)
          .map(item => ({
            id: item.serverId!,
            x: item.x,
            y: item.y,
            scale: item.scale,
          }));

      try {
        await saveVisionBoardLayout(layoutPayload());
      } catch (layoutError) {
        // Sunucuda artık yok olan eski id'ler — fotoğrafları yeniden yükle
        if (visionBoardErrorCode(layoutError) !== 'item_missing') {
          throw layoutError;
        }
        nextItems = await uploadBoardPhotos(
          nextItems.map(item => ({
            ...item,
            serverId: undefined,
            pendingUpload: true,
          })),
        );
        await saveVisionBoardLayout(layoutPayload());
      }

      const nextServerIds = nextItems
        .map(item => item.serverId!)
        .filter(Boolean);
      setItems(nextItems);
      setServerIds(nextServerIds);
      await writeDraft({items: nextItems, serverIds: nextServerIds, dreamCards});
      const dreamCount = dreamCards.reduce(
        (sum, card) => sum + card.items.length,
        0,
      );
      await appendSavedBoard({
        photoCount: nextItems.length,
        dreamCount,
        items: nextItems,
        dreamCards,
        coverUri: nextItems[0]?.uri,
      });
      showModal('success', t('vision.saved'));
    } catch (error) {
      const code = visionBoardErrorCode(error);
      if (code === 'board_full') {
        showModal('error', t('vision.boardFull'));
      } else if (code === 'photo_too_large') {
        showModal('error', t('vision.photoTooLarge'));
      } else if (code === 'photo_invalid') {
        showModal('error', t('vision.pickError'));
      } else {
        showModal('error', t('vision.saveError'));
      }
    } finally {
      setSaving(false);
    }
  };

  const hasDreamContent = dreamCards.some(
    card => card.items.length > 0 || !card.isDefault,
  );
  const canSave =
    Boolean(token) &&
    !saving &&
    (items.length > 0 || serverIds.length > 0 || hasDreamContent);
  const canClear = (items.length > 0 || hasDreamContent) && !saving;
  const canWriteEditorDream = cardEditor.items.length < MAX_DREAMS;
  const canCommitEditor = editorAddedViaPlus;

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

      <VisionBoardWorkspace
        hintText={t('vision.hint')}
        showListButton
        addCardDisabled={dreamCards.length >= MAX_DREAM_CARDS}
        saveDisabled={!canSave}
        clearDisabled={!canClear}
        saving={saving}
        onAddCard={addDreamCard}
        onSave={saveBoard}
        onAddPhoto={addPhoto}
        onClear={requestClearAll}
        onOpenList={() => navigation.navigate('VisionBoardList')}
        items={items}
        dreamCards={dreamCards}
        board={board}
        itemWidth={itemWidth}
        itemHeight={itemHeight}
        token={token}
        selectedKey={selectedKey}
        activeDreamCardId={activeDreamCardId}
        onBoardLayout={onBoardLayout}
        onSelectPhoto={setSelectedKey}
        onChangePhoto={updateItem}
        onDeletePhoto={deleteItem}
        onSelectDreamCard={selectDreamCard}
        onOpenDreamCard={openDreamCard}
        onMoveDreamCard={moveDreamCard}
        onDeleteDreamCard={deleteDreamCard}
        onRemoveDream={removeDream}
      />

      <CenterModal
        visible={cardEditor.visible}
        title={t('vision.dreamFillTitle')}
        fixedHeight={false}
        leftButtonText={t('common.cancel')}
        rightButtonText={t('vision.save')}
        onLeftPress={closeCardEditor}
        onRightPress={commitCardEditor}
        rightButtonDisabled={!canCommitEditor}
        rightButtonBackgroundColor={colors.primary}>
        <View style={styles.editorBody}>
          <DreamCardPreview
            items={cardEditor.items}
            title={t('vision.dreamListTitle')}
            emptyLabel={t('vision.dreamEmpty')}
            deleteItemLabel={t('vision.delete')}
            noteWidth={NOTE_WIDTH * w1px * 1.35}
            onRemoveItem={removeEditorDream}
          />
          <View style={styles.editorInputRow}>
            <TextInput
              value={dreamDraft}
              onChangeText={setDreamDraft}
              placeholder={t('vision.dreamPlaceholder')}
              maxLength={40}
              autoCapitalize="sentences"
              returnKeyType="done"
              onSubmitEditing={addEditorDream}
              editable={canWriteEditorDream}
              containerStyle={styles.dreamInputWrap}
              style={styles.dreamInput}
            />
            <TouchableOpacity
              style={[
                styles.dreamIconBtn,
                !canWriteEditorDream || !dreamDraft.trim()
                  ? styles.dreamIconBtnDisabled
                  : null,
              ]}
              activeOpacity={0.85}
              disabled={!canWriteEditorDream || !dreamDraft.trim()}
              onPress={addEditorDream}
              accessibilityRole="button"
              accessibilityLabel={t('vision.dreamAdd')}>
              <Icon name="add" size="small" color={colors.textWhite} />
            </TouchableOpacity>
          </View>
          <T
            size={fontSize.caption}
            weight="600"
            color={colors.textMuted}
            style={styles.editorCount}>
            {t('vision.dreamCount').replace(
              '{count}',
              String(cardEditor.items.length),
            )}
          </T>
        </View>
      </CenterModal>

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
          modal.mode === 'clearConfirm' ? clearAllBoard : undefined
        }
        onClose={closeModal}
      />
    </PageLayout>
  );
};

export default VisionBoardScreen;
