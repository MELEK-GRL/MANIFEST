import React, {useMemo} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Icon, PageHeader, PageLayout, T} from '@components';
import {grabovoiDaily, grabovoiData} from '../../data/LuckyNumbers/grabovoi';
import {
  fallbackTopicImage,
  topicImages,
} from '../../data/LuckyNumbers/topicImages';
import {useLocaleStore, useT} from '../../store/useLocaleStore';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';
import {useResponsive} from '../../utils/deviceStore/device';
import type {RootStackParamList} from '../../navigation/types';

const luckImage = require('../../assets/images/luckImage.png');
const luckBanner = require('../../assets/images/luckBanner.png');

const LuckyNumbersScreen = () => {
  const t = useT();
  const locale = useLocaleStore(state => state.locale);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {w1px, h1px, fs1px} = useResponsive();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        hero: {
          width: '100%',
          marginBottom: 6 * h1px,
          minHeight: 168 * h1px,
        },
        heroArt: {
          position: 'absolute',
          top: 36 * h1px,
          right: -40 * w1px,
          width: 220 * w1px,
          height: 220 * h1px,
          opacity: 0.95,
        },
        heroHeader: {
          zIndex: 2,
          marginBottom: 8 * h1px,
        },
        heroCopy: {
          paddingRight: 128 * w1px,
          zIndex: 2,
        },
        heroTitle: {
          marginBottom: 8 * h1px,
        },
        heroSubtitle: {
          lineHeight: 20 * fs1px,
        },
        dailyWrap: {
          width: '100%',
          marginTop: 34 * h1px,
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
          marginTop: 2 * h1px,
          marginBottom: 10 * h1px,
        },
        list: {
          width: '100%',
          gap: 10 * h1px,
        },
        card: {
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 20 * fs1px,
          paddingHorizontal: 12 * w1px,
          paddingVertical: 8 * h1px,
          borderWidth: 1,
          borderColor: colors.borderSoft,
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.1,
          shadowRadius: 12,
          shadowOffset: {width: 0, height: 4},
          elevation: 3,
        },
        cardThumbWrap: {
          width: 54 * w1px,
          height: 54 * w1px,
          borderRadius: 16 * fs1px,
          marginRight: 12 * w1px,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors.borderGlass,
        },
        cardThumb: {
          width: '100%',
          height: '100%',
          opacity: 0.92,
        },
        cardThumbWash: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: colors.peach,
          opacity: 0.22,
        },
        cardBody: {
          flex: 1,
          paddingRight: 8 * w1px,
          justifyContent: 'center',
        },
        cardTitle: {
          letterSpacing: 0.2,
        },
        cardSubtitle: {
          marginTop: 3 * h1px,
        },
        cardArrow: {
          width: 30 * w1px,
          height: 30 * w1px,
          borderRadius: 15 * w1px,
          backgroundColor: colors.blush,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }),
    [w1px, h1px, fs1px],
  );

  const text = (tr: string, en: string) => (locale === 'en' ? en : tr);

  return (
    <PageLayout userHeader={false}>
      <View style={styles.hero}>
        <Image
          source={luckImage}
          style={styles.heroArt}
          resizeMode="contain"
          pointerEvents="none"
        />
        <View style={styles.heroHeader}>
          <PageHeader title={t('luckyNumbers.title')} />
        </View>
        <View style={styles.heroCopy}>
          <T
            family="serif"
            size={fontSize.titleXl}
            weight="700"
            color={colors.textDark}
            style={styles.heroTitle}>
            {t('luckyNumbers.discoverTitle')}
          </T>
          <T
            size={fontSize.bodySmall}
            weight="400"
            color={colors.textMutedDark}
            style={styles.heroSubtitle}>
            {t('luckyNumbers.discoverSubtitle')}
          </T>
        </View>
      </View>
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
          <TouchableOpacity
            key={topic.id}
            activeOpacity={0.88}
            onPress={() =>
              navigation.navigate('LuckyNumbersDetail', {topicId: topic.id})
            }
            accessibilityRole="button"
            accessibilityLabel={text(topic.tr, topic.en)}>
            <LinearGradient
              colors={colors.gradientTile}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.card}>
              <View style={styles.cardThumbWrap}>
                <Image
                  source={topicImages[topic.id] ?? fallbackTopicImage}
                  style={styles.cardThumb}
                  resizeMode="cover"
                />
                <View style={styles.cardThumbWash} pointerEvents="none" />
              </View>
              <View style={styles.cardBody}>
                <T
                  family="serif"
                  size={fontSize.subtitle}
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
              <View style={styles.cardArrow}>
                <Icon name="chevron-forward" size={16} color={colors.textDark} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </PageLayout>
  );
};

export default LuckyNumbersScreen;
