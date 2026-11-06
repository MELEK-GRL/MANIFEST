import React, {useMemo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Icon, PageLayout, T} from '@components';
import {grabovoiDaily, grabovoiData} from '../../data/LuckyNumbers/grabovoi';
import {useLocaleStore, useT} from '../../store/useLocaleStore';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';
import {useResponsive} from '../../utils/deviceStore/device';

const luckImage = require('../../assets/images/luckImage.png');
const luckBanner = require('../../assets/images/luckBanner.png');
const luckMany = require('../../assets/images/luckmany.png');

const topicImages: Record<string, number> = {
  money: require('../../assets/images/luckyPage/para.png'),
  career: require('../../assets/images/luckyPage/is.png'),
  love: require('../../assets/images/luckyPage/ask.png'),
  growth: require('../../assets/images/luckyPage/ozguven.png'),
  spirit: require('../../assets/images/luckyPage/dunya.png'),
  health: require('../../assets/images/luckyPage/saglik.png'),
  family: require('../../assets/images/luckyPage/aile.png'),
  nature: require('../../assets/images/luckyPage/doga.png'),
};

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
        dailyWrap: {
          width: '100%',
          marginTop: 18 * h1px,
          borderRadius: 22 * fs1px,
          overflow: 'hidden',
        },
        dailyBg: {
          ...StyleSheet.absoluteFillObject,
          width: '100%',
          height: '100%',
          borderRadius: 22 * fs1px,
          opacity: 1,
        },
        dailyWash: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: colors.messageWash,
          borderRadius: 22 * fs1px,
          opacity: 0.28,
        },
        daily: {
          paddingLeft: 96 * w1px,
          paddingRight: 22 * w1px,
          paddingTop: 24 * h1px,
          paddingBottom: 24 * h1px,
          zIndex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        dailyCopy: {
          width: '100%',
          maxWidth: 220 * w1px,
          alignItems: 'center',
        },
        dailyLabel: {
          letterSpacing: 1.2 * fs1px,
        },
        sequence: {
          marginTop: 8 * h1px,
          letterSpacing: 1.4 * fs1px,
        },
        dailyText: {
          marginTop: 8 * h1px,
          lineHeight: 18 * fs1px,
        },
        section: {
          marginTop: 10 * h1px,
          marginBottom: 12 * h1px,
        },
        list: {
          width: '100%',
        },
        card: {
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.background,
          borderRadius: 18 * fs1px,
          paddingHorizontal: 12 * w1px,
          paddingVertical: 6 * h1px,
          marginBottom: 10 * h1px,
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.12,
          shadowRadius: 10,
          shadowOffset: {width: 0, height: 4},
          elevation: 4,
        },
        cardThumbWrap: {
          width: 52 * w1px,
          height: 52 * w1px,
          borderRadius: 16 * fs1px,
          marginRight: 12 * w1px,
          overflow: 'hidden',
        },
        cardThumb: {
          width: '100%',
          height: '100%',
        },
        cardThumbWash: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: colors.messageWash,
          opacity: 0.85,
        },
        cardBody: {
          flex: 1,
          paddingRight: 4 * w1px,
        },
        cardTitle: {
          marginRight: 2 * w1px,
        },
        cardSubtitle: {
          marginTop: 4 * h1px,
        },
        cardArrow: {
          marginLeft: 2 * w1px,
        },
      }),
    [w1px, h1px, fs1px],
  );

  const text = (tr: string, en: string) => (locale === 'en' ? en : tr);

  return (
    <PageLayout title={t('luckyNumbers.title')} cornerArt={luckImage}>
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
      <View style={styles.dailyWrap} collapsable={false}>
        <Image source={luckBanner} style={styles.dailyBg} resizeMode="stretch" />
        <View style={styles.dailyWash} pointerEvents="none" />
        <View style={styles.daily}>
          <View style={styles.dailyCopy}>
            <T
              size={fontSize.caption}
              weight="600"
              color={colors.goldSoft}
              align="center"
              style={styles.dailyLabel}>
              {t('luckyNumbers.dailyLabel').toUpperCase()}
            </T>
            <T
              family="serif"
              size={fontSize.titleXl}
              weight="700"
              color={colors.gold}
              align="center"
              style={styles.sequence}>
              {grabovoiDaily.sequence}
            </T>
            <T
              size={fontSize.caption}
              weight="500"
              color={colors.textWhite}
              align="center"
              numberOfLines={2}
              style={styles.dailyText}>
              {text(grabovoiDaily.tr, grabovoiDaily.en)}
            </T>
          </View>
        </View>
      </View>
      <View style={styles.section}>
        <T family="serif" size={fontSize.title} weight="700" color={colors.textDark}>
          {t('luckyNumbers.chooseArea')}
        </T>
      </View>
      <View style={styles.list}>
        {grabovoiData.map(topic => (
          <View key={topic.id} style={styles.card}>
            <View style={styles.cardThumbWrap}>
              <Image
                source={topicImages[topic.id] ?? luckMany}
                style={styles.cardThumb}
                resizeMode="cover"
              />
              <View style={styles.cardThumbWash} pointerEvents="none" />
            </View>
            <View style={styles.cardBody}>
              <T
                family="serif"
                size={fontSize.label}
                weight="700"
                color={colors.textDark}
                style={styles.cardTitle}
                numberOfLines={1}>
                {text(topic.tr, topic.en)}
              </T>
              <T
                size={fontSize.caption}
                weight="500"
                color={colors.textMuted}
                style={styles.cardSubtitle}
                numberOfLines={1}>
                {text(topic.subtitleTr, topic.subtitleEn)}
              </T>
            </View>
            <Icon
              name="chevron-forward"
              size="small"
              color={colors.textLight}
              style={styles.cardArrow}
            />
          </View>
        ))}
      </View>
    </PageLayout>
  );
};

export default LuckyNumbersScreen;
