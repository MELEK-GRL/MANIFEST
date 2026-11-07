import React, {useCallback, useMemo, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '../Icons/Icon';
import T from '../Text/T';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';
import {useResponsive} from '../../utils/deviceStore/device';
import {CollagePiece, DreamCardPiece} from './VisionBoardPieces';
import {
  BOARD_CANVAS_HEIGHT,
  BOARD_VIEWPORT_HEIGHT,
  NOTE_WIDTH,
  type BoardItem,
  type BoardSize,
  type DreamCard,
} from './types';

type Props = {
  items: BoardItem[];
  dreamCards: DreamCard[];
  board: BoardSize;
  itemWidth: number;
  itemHeight: number;
  token: string | null;
  selectedKey: string | null;
  activeDreamCardId: string;
  motto: string;
  dreamListTitle: string;
  dreamEmpty: string;
  dreamDeleteCard: string;
  deleteLabel: string;
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

const VisionBoardCanvas: React.FC<Props> = ({
  items,
  dreamCards,
  board,
  itemWidth,
  itemHeight,
  token,
  selectedKey,
  activeDreamCardId,
  motto,
  dreamListTitle,
  dreamEmpty,
  dreamDeleteCard,
  deleteLabel,
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
  const {w1px, h1px, fs1px} = useResponsive();
  const [boardScrollEnabled, setBoardScrollEnabled] = useState(true);
  const canvasHeight = BOARD_CANVAS_HEIGHT * h1px;
  const viewportHeight = BOARD_VIEWPORT_HEIGHT * h1px;

  const onDragStart = useCallback(() => setBoardScrollEnabled(false), []);
  const onDragEnd = useCallback(() => setBoardScrollEnabled(true), []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
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
          borderRadius: 26 * fs1px,
          overflow: 'hidden',
          borderWidth: 1.5,
          borderColor: colors.white,
        },
        boardScroll: {
          height: viewportHeight,
        },
        boardInner: {
          width: '100%',
          height: canvasHeight,
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
          top: BOARD_VIEWPORT_HEIGHT * 0.42 * h1px,
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
          lineHeight: 20 * fs1px,
        },
      }),
    [w1px, h1px, fs1px, canvasHeight, viewportHeight],
  );

  return (
    <View style={styles.boardShell}>
      <LinearGradient
        colors={[colors.peach, colors.cream, colors.lavender]}
        start={{x: 0.1, y: 0}}
        end={{x: 0.9, y: 1}}
        style={styles.board}>
        <ScrollView
          style={styles.boardScroll}
          contentContainerStyle={{minHeight: canvasHeight}}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          bounces
          scrollEnabled={boardScrollEnabled}
          keyboardShouldPersistTaps="handled">
          <View style={styles.boardInner} onLayout={onBoardLayout}>
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
                size={fontSize.label}
                weight="600"
                color={colors.primaryDark}
                style={styles.mottoText}>
                {motto}
              </T>
              <Icon
                name="heart"
                size="small"
                color={colors.primary}
                style={{marginTop: 4 * h1px}}
              />
            </View>

            {dreamCards.map(card => (
              <DreamCardPiece
                key={card.id}
                card={card}
                selected={!readOnly && activeDreamCardId === card.id}
                board={board}
                noteWidth={NOTE_WIDTH * w1px}
                title={dreamListTitle}
                emptyLabel={dreamEmpty}
                deleteCardLabel={dreamDeleteCard}
                deleteItemLabel={deleteLabel}
                readOnly={readOnly}
                onSelect={onSelectDreamCard}
                onOpen={onOpenDreamCard}
                onMove={onMoveDreamCard}
                onDeleteCard={onDeleteDreamCard}
                onRemoveItem={onRemoveDream}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              />
            ))}

            {items.map(item => (
              <CollagePiece
                key={item.key}
                item={item}
                selected={!readOnly && selectedKey === item.key}
                board={board}
                itemWidth={itemWidth}
                itemHeight={itemHeight}
                token={token}
                readOnly={readOnly}
                onSelect={onSelectPhoto}
                onChange={onChangePhoto}
                onDelete={onDeletePhoto}
                deleteLabel={deleteLabel}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              />
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default VisionBoardCanvas;
