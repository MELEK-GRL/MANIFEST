import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Icon, T} from '@components';
import {grabovoiDaily, grabovoiData} from '../../data/grabovoi';
import {useLocaleStore, useT} from '../../store/useLocaleStore';
import ScreenFrame from '../ScreenFrame';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';
import {useResponsive} from '../../utils/deviceStore/device';

const actions = [
  {key: 'favorites', icon: 'heart-outline', label: 'luckyNumbers.favorites'},
  {key: 'journal', icon: 'book-outline', label: 'luckyNumbers.journal'},
  {key: 'rituals', icon: 'time-outline', label: 'luckyNumbers.rituals'},
] as const;

const LuckyNumbersScreen = () => {
  const t = useT();
  const locale = useLocaleStore(state => state.locale);
  const {w1px, h1px, fs1px} = useResponsive();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        heroTitle: {
          marginTop: 4 * h1px,
        },
        heroSubtitle: {
          marginTop: 8 * h1px,
        },
        daily: {
          marginTop: 18 * h1px,
          borderRadius: 22 * fs1px,
          paddingHorizontal: 16 * w1px,
          paddingVertical: 16 * h1px,
          overflow: 'hidden',
        },
        dailyTop: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        dailyLabel: {
          flex: 1,
          marginRight: 8 * w1px,
          letterSpacing: 0.6,
        },
        chip: {
          backgroundColor: colors.gold,
          borderRadius: 16 * fs1px,
          paddingHorizontal: 10 * w1px,
          paddingVertical: 6 * h1px,
        },
        sequence: {
          marginTop: 10 * h1px,
        },
        dailyBottom: {
          flexDirection: 'row',
          alignItems: 'flex-end',
          marginTop: 8 * h1px,
        },
        dailyText: {
          flex: 1,
          marginRight: 10 * w1px,
        },
        discover: {
          backgroundColor: colors.white,
          borderRadius: 16 * fs1px,
          paddingHorizontal: 12 * w1px,
          paddingVertical: 8 * h1px,
        },
        actions: {
          flexDirection: 'row',
          marginTop: 14 * h1px,
        },
        action: {
          flex: 1,
          backgroundColor: colors.white,
          borderRadius: 18 * fs1px,
          paddingVertical: 12 * h1px,
          paddingHorizontal: 6 * w1px,
          alignItems: 'center',
          marginRight: 8 * w1px,
        },
        actionLast: {
          marginRight: 0,
        },
        actionLabel: {
          marginTop: 6 * h1px,
        },
        section: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 22 * h1px,
          marginBottom: 12 * h1px,
        },
        grid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        },
        card: {
          width: '48.5%',
          backgroundColor: colors.white,
          borderRadius: 18 * fs1px,
          paddingHorizontal: 12 * w1px,
          paddingVertical: 14 * h1px,
          marginBottom: 10 * h1px,
        },
        cardTop: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        },
        popular: {
          alignSelf: 'flex-start',
          backgroundColor: colors.goldSoft,
          borderRadius: 10 * fs1px,
          paddingHorizontal: 8 * w1px,
          paddingVertical: 3 * h1px,
          marginBottom: 8 * h1px,
        },
        cardTitle: {
          flex: 1,
          marginRight: 6 * w1px,
        },
        cardSubtitle: {
          marginTop: 4 * h1px,
        },
      }),
    [w1px, h1px, fs1px],
  );

  const text = (tr: string, en: string) => (locale === 'en' ? en : tr);

  return (
    <ScreenFrame title={t('luckyNumbers.title')}>
      <T
        family="serif"
        size={fontSize.display}
        weight="700"
        color={colors.textDark}
        style={styles.heroTitle}>
        {t('luckyNumbers.discoverTitle')}
      </T>
      <T
        size={fontSize.body}
        weight="400"
        color={colors.textMuted}
        style={styles.heroSubtitle}>
        {t('luckyNumbers.discoverSubtitle')}
      </T>
      <LinearGradient
        colors={colors.gradientPrimary}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.daily}>
        <View style={styles.dailyTop}>
          <T
            size={fontSize.caption}
            weight="600"
            color={colors.goldSoft}
            style={styles.dailyLabel}>
            {t('luckyNumbers.dailyLabel').toUpperCase()}
          </T>
          <View style={styles.chip}>
            <T size={fontSize.caption} weight="600" color={colors.textWhite}>
              {t('luckyNumbers.dailyExplore')}
            </T>
          </View>
        </View>
        <T
          family="serif"
          size={fontSize.brand}
          weight="700"
          color={colors.gold}
          style={styles.sequence}>
          {grabovoiDaily.sequence}
        </T>
        <View style={styles.dailyBottom}>
          <T
            size={fontSize.caption}
            weight="500"
            color={colors.textWhite}
            style={styles.dailyText}>
            {text(grabovoiDaily.tr, grabovoiDaily.en)}
          </T>
          <View style={styles.discover}>
            <T size={fontSize.caption} weight="600" color={colors.primaryDark}>
              {t('luckyNumbers.discover')}
            </T>
          </View>
        </View>
      </LinearGradient>
      <View style={styles.actions}>
        {actions.map((action, index) => (
          <View
            key={action.key}
            style={[styles.action, index === actions.length - 1 && styles.actionLast]}>
            <Icon name={action.icon} size="medium" color={colors.primary} />
            <T
              size={fontSize.caption}
              weight="600"
              color={colors.textDark}
              align="center"
              style={styles.actionLabel}>
              {t(action.label)}
            </T>
          </View>
        ))}
      </View>
      <View style={styles.section}>
        <T family="serif" size={fontSize.title} weight="700" color={colors.textDark}>
          {t('luckyNumbers.chooseArea')}
        </T>
        <T size={fontSize.caption} weight="600" color={colors.primary}>
          {`${grabovoiData.length} ${t('luckyNumbers.categories')}`}
        </T>
      </View>
      <View style={styles.grid}>
        {grabovoiData.map(topic => (
          <View key={topic.id} style={styles.card}>
            {topic.popular ? (
              <View style={styles.popular}>
                <T size={fontSize.caption} weight="600" color={colors.primaryDark}>
                  {t('luckyNumbers.popular')}
                </T>
              </View>
            ) : null}
            <View style={styles.cardTop}>
              <T
                size={fontSize.label}
                weight="700"
                color={colors.textDark}
                style={styles.cardTitle}>
                {text(topic.tr, topic.en)}
              </T>
              <Icon name="chevron-forward" size="small" color={colors.textLight} />
            </View>
            <T
              size={fontSize.caption}
              weight="500"
              color={colors.textMuted}
              style={styles.cardSubtitle}>
              {text(topic.subtitleTr, topic.subtitleEn)}
            </T>
          </View>
        ))}
      </View>
    </ScreenFrame>
  );
};

export default LuckyNumbersScreen;
