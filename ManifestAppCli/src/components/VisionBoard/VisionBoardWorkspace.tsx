import React, {useMemo} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '../Icons/Icon';
import T from '../Text/T';
import {useT} from '../../store/useLocaleStore';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';
import {useResponsive} from '../../utils/deviceStore/device';
import VisionBoardCanvas from './VisionBoardCanvas';
import type {BoardItem, BoardSize, DreamCard} from './types';

type ToolTone = 'soft' | 'primary' | 'danger';

type ToolProps = {
  icon: string;
  label: string;
  tone?: ToolTone;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  ring: number;
  face: number;
  iconPx: number;
};

const ToolButton = ({
  icon,
  label,
  tone = 'soft',
  disabled = false,
  loading = false,
  onPress,
  ring,
  face,
  iconPx,
}: ToolProps) => {
  const isPrimary = tone === 'primary';
  const isDanger = tone === 'danger';
  const ringColors = isPrimary
    ? colors.gradientProgress
    : isDanger
      ? ([colors.dangerSoft, colors.blush] as [string, string])
      : ([colors.goldSoft, colors.lavender] as [string, string]);
  const faceColors = isPrimary
    ? colors.gradientPrimary
    : isDanger
      ? ([colors.dangerSoft, colors.blush] as [string, string])
      : colors.gradientTile;
  const iconColor = isPrimary
    ? colors.textWhite
    : isDanger
      ? colors.dangerText
      : colors.primary;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      activeOpacity={0.82}
      disabled={disabled || loading}
      onPress={onPress}
      style={{opacity: disabled ? 0.38 : 1}}>
      <LinearGradient
        colors={ringColors}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={{
          width: ring,
          height: ring,
          borderRadius: ring / 2,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 1.5,
          shadowColor: isPrimary ? colors.primaryDark : colors.gold,
          shadowOpacity: isPrimary ? 0.18 : 0.1,
          shadowRadius: isPrimary ? 8 : 5,
          shadowOffset: {width: 0, height: 2},
          elevation: isPrimary ? 2 : 1,
        }}>
        <LinearGradient
          colors={faceColors}
          start={{x: 0.1, y: 0}}
          end={{x: 0.9, y: 1}}
          style={{
            width: face,
            height: face,
            borderRadius: face / 2,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {loading ? (
            <ActivityIndicator size="small" color={iconColor} />
          ) : (
            <Icon name={icon} size={iconPx} color={iconColor} />
          )}
        </LinearGradient>
      </LinearGradient>
    </TouchableOpacity>
  );
};

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
  const {w1px, h1px, fs1px} = useResponsive();
  const ring = 44 * w1px;
  const face = 40 * w1px;
  const toolIcon = 18;

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
          marginBottom: 12 * h1px,
        },
        bar: {
          borderRadius: 22 * fs1px,
          marginBottom: 14 * h1px,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.goldSoft,
          backgroundColor: colors.blush,
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.1,
          shadowRadius: 8,
          shadowOffset: {width: 0, height: 3},
          elevation: 2,
        },
        barInner: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 6 * h1px,
          paddingHorizontal: 8 * w1px,
          borderRadius: 22 * fs1px,
          overflow: 'hidden',
        },
        divider: {
          width: StyleSheet.hairlineWidth,
          height: 28 * h1px,
          backgroundColor: colors.goldSoft,
          opacity: 0.7,
        },
      }),
    [w1px, h1px, fs1px],
  );

  return (
    <View style={styles.root}>
      <View style={styles.hintRow}>
        <Icon name={hintIcon} size="small" color={colors.gold} />
        <T size={fontSize.caption} weight="500" color={colors.textMuted}>
          {hintText}
        </T>
      </View>

      <View style={styles.bar}>
        <LinearGradient
          colors={colors.gradientTile}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.barInner}>
          <ToolButton
            icon="add"
            label={t('vision.addMore')}
            disabled={addCardDisabled}
            onPress={onAddCard}
            ring={ring}
            face={face}
            iconPx={toolIcon}
          />
          <View style={styles.divider} />
          <ToolButton
            icon="image-outline"
            label={t('vision.addPhoto')}
            onPress={onAddPhoto}
            ring={ring}
            face={face}
            iconPx={toolIcon}
          />
          <View style={styles.divider} />
          <ToolButton
            icon="checkmark"
            label={saving ? t('vision.saving') : t('vision.save')}
            tone="primary"
            disabled={saveDisabled}
            loading={saving}
            onPress={onSave}
            ring={ring}
            face={face}
            iconPx={toolIcon}
          />
          <View style={styles.divider} />
          <ToolButton
            icon="trash-outline"
            label={t('vision.clearAll')}
            tone="danger"
            disabled={clearDisabled}
            onPress={onClear}
            ring={ring}
            face={face}
            iconPx={toolIcon}
          />
          {showListButton ? (
            <>
              <View style={styles.divider} />
              <ToolButton
                icon="albums-outline"
                label={t('vision.listButton')}
                onPress={onOpenList}
                ring={ring}
                face={face}
                iconPx={toolIcon}
              />
            </>
          ) : null}
        </LinearGradient>
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
    </View>
  );
};

export default VisionBoardWorkspace;
