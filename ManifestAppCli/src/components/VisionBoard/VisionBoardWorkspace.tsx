import React, {useMemo} from 'react';
import {StyleSheet, View, type LayoutChangeEvent} from 'react-native';
import Button from '../Buttons/Button';
import Icon from '../Icons/Icon';
import T from '../Text/T';
import {useT} from '../../store/useLocaleStore';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';
import {useResponsive} from '../../utils/deviceStore/device';
import VisionBoardCanvas from './VisionBoardCanvas';
import type {BoardItem, BoardSize, DreamCard} from './types';

type Props = {
  hintIcon?: string;
  hintText: string;
  showListButton?: boolean;
  addCardDisabled?: boolean;
  saveDisabled?: boolean;
  clearDisabled?: boolean;
  saving?: boolean;
  onAddCard: () => void;
  onSave: () => void;
  onAddPhoto: () => void;
  onClear: () => void;
  onOpenList?: () => void;
  items: BoardItem[];
  dreamCards: DreamCard[];
  board: BoardSize;
  itemWidth: number;
  itemHeight: number;
  token: string | null;
  selectedKey: string | null;
  activeDreamCardId: string;
  readOnly?: boolean;
  onBoardLayout: (e: LayoutChangeEvent) => void;
  onSelectPhoto: (key: string) => void;
  onChangePhoto: (key: string, next: Partial<BoardItem>) => void;
  onDeletePhoto: (key: string) => void;
  onSelectDreamCard: (id: string) => void;
  onOpenDreamCard: (id: string) => void;
  onMoveDreamCard: (id: string, next: {x: number; y: number}) => void;
  onDeleteDreamCard: (id: string) => void;
  onRemoveDream: (cardId: string, itemId: string) => void;
};

const VisionBoardWorkspace: React.FC<Props> = ({
  hintIcon = 'move-outline',
  hintText,
  showListButton = false,
  addCardDisabled = false,
  saveDisabled = false,
  clearDisabled = false,
  saving = false,
  onAddCard,
  onSave,
  onAddPhoto,
  onClear,
  onOpenList,
  items,
  dreamCards,
  board,
  itemWidth,
  itemHeight,
  token,
  selectedKey,
  activeDreamCardId,
  readOnly = false,
  onBoardLayout,
  onSelectPhoto,
  onChangePhoto,
  onDeletePhoto,
  onSelectDreamCard,
  onOpenDreamCard,
  onMoveDreamCard,
  onDeleteDreamCard,
  onRemoveDream,
}) => {
  const t = useT();
  const {w1px, h1px} = useResponsive();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          width: '100%',
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
        listBtn: {
          marginTop: 16 * h1px,
        },
      }),
    [w1px, h1px],
  );

  return (
    <View style={styles.root}>
      <View style={styles.hintRow}>
        <Icon name={hintIcon} size="small" color={colors.gold} />
        <T size={fontSize.caption} weight="500" color={colors.textMuted}>
          {hintText}
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
              disabled={addCardDisabled}
              onPress={onAddCard}
            />
          </View>
          <View style={styles.actionBtn}>
            <Button
              buttonText={saving ? t('vision.saving') : t('vision.save')}
              icon="checkmark"
              variant="primary"
              size="compact"
              disabled={saveDisabled}
              loading={saving}
              onPress={onSave}
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
              onPress={onAddPhoto}
            />
          </View>
          <View style={styles.actionBtn}>
            <Button
              buttonText={t('vision.clearAll')}
              icon="trash-outline"
              variant="danger"
              size="compact"
              disabled={clearDisabled}
              onPress={onClear}
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
        readOnly={readOnly}
        onBoardLayout={onBoardLayout}
        onSelectPhoto={onSelectPhoto}
        onChangePhoto={onChangePhoto}
        onDeletePhoto={onDeletePhoto}
        onSelectDreamCard={onSelectDreamCard}
        onOpenDreamCard={onOpenDreamCard}
        onMoveDreamCard={onMoveDreamCard}
        onDeleteDreamCard={onDeleteDreamCard}
        onRemoveDream={onRemoveDream}
      />

      {showListButton ? (
        <View style={styles.listBtn}>
          <Button
            buttonText={t('vision.listButton')}
            icon="albums-outline"
            variant="secondary"
            size="compact"
            onPress={onOpenList}
          />
        </View>
      ) : null}
    </View>
  );
};

export default VisionBoardWorkspace;
