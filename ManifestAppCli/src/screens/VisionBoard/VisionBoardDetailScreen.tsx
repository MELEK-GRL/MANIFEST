import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import {useNavigation, useRoute, type RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  Button,
  CenterModal,
  Icon,
  PageLayout,
  PopupModal,
  T,
  TextInput,
  VisionBoardCanvas,
} from '@components';
import {
  addVisionBoardItem,
  deleteVisionBoardItem,
  saveVisionBoardLayout,
  visionBoardErrorCode,
  visionBoardItemImageUrl,
} from '../../api/visionBoard';
import {
  DEFAULT_DREAM_CARD_ID,
  DreamCardPreview,
  ITEM_HEIGHT,
  ITEM_WIDTH,
  MAX_DREAM_CARDS,
  MAX_DREAMS,
  NOTE_WIDTH,
  createDefaultDreamCard,
  getSavedBoard,
  holderFromIndex,
  noteHeightFor,
  spawnPosForIndex,
  updateSavedBoard,
  type BoardItem,
  type BoardSize,
  type DreamCard,
  type DreamItem,
} from '../../components/VisionBoard';
import {useAuthStore} from '../../store/useAuthStore';
import {useLocaleStore, useT} from '../../store/useLocaleStore';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';
import {useResponsive} from '../../utils/deviceStore/device';
import type {RootStackParamList} from '../../navigation/types';

const VisionBoardDetailScreen = () => {
  const t = useT();
  const locale = useLocaleStore(state => state.locale);
  const token = useAuthStore(state => state.token);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route =
    useRoute<RouteProp<RootStackParamList, 'VisionBoardDetail'>>();
  const {w1px, h1px} = useResponsive();
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<BoardItem[]>([]);
  const [serverIds, setServerIds] = useState<string[]>([]);
  const [dreamCards, setDreamCards] = useState<DreamCard[]>([
    createDefaultDreamCard(),
  ]);
  const [activeDreamCardId, setActiveDreamCardId] = useState(
    DEFAULT_DREAM_CARD_ID,
  );
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [dreamDraft, setDreamDraft] = useState('');
  const [cardEditor, setCardEditor] = useState<{
    visible: boolean;
    mode: 'create' | 'edit';
    cardId: string | null;
    items: DreamItem[];
  }>({visible: false, mode: 'create', cardId: null, items: []});
  const [board, setBoard] = useState<BoardSize>({width: 0, height: 0});
  const [savedAt, setSavedAt] = useState('');
  const [modal, setModal] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'danger';
    message: string;
    mode?: 'alert' | 'clearConfirm';
  }>({visible: false, type: 'success', message: '', mode: 'alert'});
  const itemWidth = ITEM_WIDTH * w1px;
  const itemHeight = ITEM_HEIGHT * h1px;

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

  const onBoardLayout = useCallback((e: LayoutChangeEvent) => {
    const {width, height} = e.nativeEvent.layout;
    setBoard({width, height});
  }, []);

  const moveDreamCard = useCallback(
    (cardId: string, next: {x: number; y: number}) => {
      setDreamCards(prev =>
        prev.map(card => (card.id === cardId ? {...card, ...next} : card)),
      );
    },
    [],
  );

  const updateItem = useCallback((key: string, next: Partial<BoardItem>) => {
    setItems(prev => prev.map(it => (it.key === key ? {...it, ...next} : it)));
  }, []);

  const deleteItem = useCallback((key: string) => {
    setItems(prev => prev.filter(it => it.key !== key));
    setSelectedKey(curr => (curr === key ? null : curr));
  }, []);

  const savedLabel = useMemo(() => {
    if (!savedAt) {
      return '';
    }
    try {
      return new Date(savedAt).toLocaleString(
        locale === 'tr' ? 'tr-TR' : 'en-US',
        {dateStyle: 'medium', timeStyle: 'short'},
      );
    } catch {
      return savedAt;
    }
  }, [savedAt, locale]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        topBar: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 12 * h1px,
          gap: 10 * w1px,
        },
        backBtn: {
          width: 38 * w1px,
          height: 38 * w1px,
          borderRadius: 19 * w1px,
          backgroundColor: colors.white,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: colors.borderSoft,
        },
        topText: {
          flex: 1,
          gap: 2 * h1px,
        },
        hintRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6 * w1px,
          marginBottom: 10 * h1px,
        },
        actions: {
          gap: 8 * h1px,
          marginBottom: 14 * h1px,
        },
        actionsRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8 * w1px,
        },
        actionBtn: {
          flex: 1,
          minWidth: 0,
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
        empty: {
          paddingVertical: 40 * h1px,
          alignItems: 'center',
        },
      }),
    [w1px, h1px],
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    getSavedBoard(route.params.boardId)
      .then(entry => {
        if (!active) {
          return;
        }
        if (!entry) {
          setMissing(true);
          return;
        }
        setMissing(false);
        setItems(entry.items);
        setServerIds(
          entry.items.map(item => item.serverId!).filter(Boolean),
        );
        const cards =
          entry.dreamCards?.length > 0
            ? entry.dreamCards
            : [createDefaultDreamCard()];
        setDreamCards(cards);
        setActiveDreamCardId(
          cards.find(card => card.isDefault)?.id ||
            cards[0]?.id ||
            DEFAULT_DREAM_CARD_ID,
        );
        setSavedAt(entry.savedAt);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [route.params.boardId]);

  const makeDreamItem = (text: string): DreamItem => ({
    id: `dream-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    text: text.slice(0, 40),
    checked: false,
  });

  const buildDreamCard = (
    index: number,
    nextItems: DreamItem[] = [],
  ): DreamCard => {
    const id = `dream-card-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 6)}`;
    const spawn = spawnPosForIndex(index);
    const maxX = Math.max(0, board.width - NOTE_WIDTH * w1px);
    const maxY = Math.max(
      0,
      board.height - noteHeightFor(nextItems.length) * h1px,
    );
    return {
      id,
      isDefault: false,
      items: nextItems,
      x: Math.min(spawn.x * w1px, maxX || spawn.x * w1px),
      y: Math.min(spawn.y * h1px, maxY || spawn.y * h1px),
    };
  };

  const openEditCardEditor = (cardId: string) => {
    const card = dreamCards.find(c => c.id === cardId);
    if (!card) {
      return;
    }
    setActiveDreamCardId(cardId);
    setSelectedKey(null);
    setDreamDraft('');
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
  };

  const addEditorDream = () => {
    const text = dreamDraft.trim();
    if (!text || cardEditor.items.length >= MAX_DREAMS) {
      return;
    }
    setCardEditor(prev => ({
      ...prev,
      items: [...prev.items, makeDreamItem(text)],
    }));
    setDreamDraft('');
  };

  const removeEditorDream = (itemId: string) => {
    setCardEditor(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
    }));
  };

  const commitCardEditor = () => {
    const pending = dreamDraft.trim();
    let nextItems = cardEditor.items;
    if (pending && nextItems.length < MAX_DREAMS) {
      nextItems = [...nextItems, makeDreamItem(pending)];
    }
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

  const clearAllBoard = () => {
    setItems([]);
    setSelectedKey(null);
    setDreamCards([createDefaultDreamCard()]);
    setActiveDreamCardId(DEFAULT_DREAM_CARD_ID);
    setDreamDraft('');
    closeCardEditor();
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

      const dreamCount = dreamCards.reduce(
        (sum, card) => sum + card.items.length,
        0,
      );
      const updated = await updateSavedBoard(route.params.boardId, {
        photoCount: nextItems.length,
        dreamCount,
        items: nextItems,
        dreamCards,
        coverUri: nextItems[0]?.uri,
      });
      if (!updated) {
        navigation.goBack();
        return;
      }
      setSavedAt(updated.savedAt);
      showModal('success', t('vision.updated'));
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

  const hasDreamContent = dreamCards.some(
    card => card.items.length > 0 || !card.isDefault,
  );
  // Boş board kaydı da silinebilsin diye detayda Kaydet her zaman açık
  const canSave = Boolean(token) && !saving;
  const canClear = (items.length > 0 || hasDreamContent) && !saving;
  const canWriteEditorDream = cardEditor.items.length < MAX_DREAMS;
  const canCommitEditor =
    cardEditor.mode === 'edit' ||
    cardEditor.items.length > 0 ||
    Boolean(dreamDraft.trim());

  return (
    <PageLayout title={t('vision.detailTitle')}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel={t('common.cancel')}>
          <Icon name="chevron-back" size="small" color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.topText}>
          <T size={fontSize.subtitle} weight="700" color={colors.primaryDark}>
            {t('vision.detailTitle')}
          </T>
          {savedLabel ? (
            <T size={fontSize.caption} weight="500" color={colors.textMuted}>
              {savedLabel}
            </T>
          ) : null}
        </View>
      </View>

      {!loading && missing ? (
        <View style={styles.empty}>
          <T size={fontSize.body} color={colors.textMuted} align="center">
            {t('vision.savedEmpty')}
          </T>
        </View>
      ) : (
        <>
          <View style={styles.hintRow}>
            <Icon name="create-outline" size="small" color={colors.gold} />
            <T size={fontSize.caption} weight="500" color={colors.textMuted}>
              {t('vision.detailHint')}
            </T>
          </View>

          <View style={styles.actions}>
            <View style={styles.actionsRow}>
              <View style={styles.actionBtn}>
                <Button
                  buttonText={t('vision.addMore')}
                  icon="add"
                  variant="secondary"
                  size="compact"
                  disabled={dreamCards.length >= MAX_DREAM_CARDS}
                  onPress={openCreateCardEditor}
                />
              </View>
              <View style={styles.actionBtn}>
                <Button
                  buttonText={saving ? t('vision.saving') : t('vision.save')}
                  icon="checkmark"
                  variant="primary"
                  size="compact"
                  disabled={!canSave}
                  loading={saving}
                  onPress={saveBoard}
                />
              </View>
            </View>
            <View style={styles.actionsRow}>
              <View style={styles.actionBtn}>
                <Button
                  buttonText={t('vision.addPhoto')}
                  icon="image-outline"
                  variant="secondary"
                  size="compact"
                  onPress={addPhoto}
                />
              </View>
              <View style={styles.actionBtn}>
                <Button
                  buttonText={t('vision.clearAll')}
                  icon="trash-outline"
                  variant="danger"
                  size="compact"
                  disabled={!canClear}
                  onPress={requestClearAll}
                />
              </View>
            </View>
          </View>

          <VisionBoardCanvas
            items={items}
            dreamCards={dreamCards}
            board={board}
            itemWidth={itemWidth}
            itemHeight={itemHeight}
            token={token}
            selectedKey={selectedKey}
            activeDreamCardId={activeDreamCardId}
            motto={t('vision.motto')}
            dreamListTitle={t('vision.dreamListTitle')}
            dreamEmpty={t('vision.dreamEmpty')}
            dreamDeleteCard={t('vision.dreamDeleteCard')}
            deleteLabel={t('vision.delete')}
            onBoardLayout={onBoardLayout}
            onSelectPhoto={setSelectedKey}
            onChangePhoto={updateItem}
            onDeletePhoto={deleteItem}
            onSelectDreamCard={id => {
              setActiveDreamCardId(id);
              setSelectedKey(null);
            }}
            onOpenDreamCard={openEditCardEditor}
            onMoveDreamCard={moveDreamCard}
            onDeleteDreamCard={deleteDreamCard}
            onRemoveDream={removeDream}
          />
        </>
      )}

      <CenterModal
        visible={cardEditor.visible}
        title={t('vision.dreamFillTitle')}
        fixedHeight={false}
        leftButtonText={t('common.cancel')}
        rightButtonText={t('vision.save')}
        onLeftPress={closeCardEditor}
        onRightPress={commitCardEditor}
        rightButtonBackgroundColor={
          canCommitEditor ? colors.primary : colors.buttonMuted
        }>
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

export default VisionBoardDetailScreen;
