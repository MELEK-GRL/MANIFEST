import React, {useMemo, useState} from 'react';
import {Image, Share, StyleSheet, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation, useRoute, type RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Icon, PageLayout, PopupModal, T} from '@components';
import {getGrabovoiTopic} from '../../data/LuckyNumbers/grabovoi';
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

const LuckyNumbersDetailScreen = () => {
  const t = useT();
  const locale = useLocaleStore(state => state.locale);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route =
    useRoute<RouteProp<RootStackParamList, 'LuckyNumbersDetail'>>();
  const {w1px, h1px, fs1px} = useResponsive();
  const topic = getGrabovoiTopic(route.params.topicId);
  const [copiedVisible, setCopiedVisible] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        bgArt: {
          position: 'absolute',
          top: 8 * h1px,
          right: -48 * w1px,
          width: 210 * w1px,
          height: 210 * h1px,
          opacity: 0.72,
          zIndex: 0,
        },
        topBar: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 18 * h1px,
          zIndex: 2,
        },
        topTitle: {
          flex: 1,
          marginHorizontal: 10 * w1px,
        },
        iconBtn: {
          width: 38 * w1px,
          height: 38 * w1px,
          borderRadius: 19 * w1px,
          backgroundColor: colors.white,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: colors.borderSoft,
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.08,
          shadowRadius: 6,
          shadowOffset: {width: 0, height: 2},
          elevation: 2,
        },
        topicHeader: {
          zIndex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 14 * h1px,
          gap: 12 * w1px,
        },
        topicThumbWrap: {
          width: 58 * w1px,
          height: 58 * w1px,
          borderRadius: 18 * fs1px,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors.borderGlass,
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.1,
          shadowRadius: 8,
          shadowOffset: {width: 0, height: 3},
          elevation: 2,
        },
        topicThumb: {
          width: '100%',
          height: '100%',
          opacity: 0.92,
        },
        topicThumbWash: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: colors.peach,
          opacity: 0.22,
        },
        topicCopy: {
          flex: 1,
          paddingRight: 4 * w1px,
        },
        topicTitleRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6 * w1px,
        },
        topicSubtitle: {
          marginTop: 4 * h1px,
          lineHeight: 18 * fs1px,
        },
        meaningCard: {
          zIndex: 1,
          borderRadius: 22 * fs1px,
          paddingVertical: 16 * h1px,
          paddingHorizontal: 16 * w1px,
          marginBottom: 18 * h1px,
          borderWidth: 1,
          borderColor: colors.borderSoft,
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.1,
          shadowRadius: 12,
          shadowOffset: {width: 0, height: 4},
          elevation: 3,
        },
        meaningHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10 * h1px,
          gap: 8 * w1px,
        },
        meaningBadge: {
          width: 30 * w1px,
          height: 30 * w1px,
          borderRadius: 15 * w1px,
          backgroundColor: colors.blush,
          alignItems: 'center',
          justifyContent: 'center',
        },
        meaningTitle: {
          flex: 1,
        },
        meaningBody: {
          lineHeight: 22 * fs1px,
        },
        section: {
          zIndex: 1,
          marginBottom: 10 * h1px,
        },
        list: {
          zIndex: 1,
          gap: 10 * h1px,
          paddingBottom: 8 * h1px,
        },
        card: {
          borderRadius: 20 * fs1px,
          paddingVertical: 12 * h1px,
          paddingHorizontal: 12 * w1px,
          borderWidth: 1,
          borderColor: colors.borderSoft,
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.1,
          shadowRadius: 12,
          shadowOffset: {width: 0, height: 4},
          elevation: 3,
        },
        cardRow: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        cardBody: {
          flex: 1,
          paddingRight: 10 * w1px,
          justifyContent: 'center',
        },
        code: {
          letterSpacing: 0.6,
          marginBottom: 3 * h1px,
        },
        copyBtn: {
          width: 36 * w1px,
          height: 36 * w1px,
          borderRadius: 18 * w1px,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.blush,
          borderWidth: 1,
          borderColor: colors.white,
        },
        copyBtnDone: {
          backgroundColor: colors.successSoft,
        },
      }),
    [w1px, h1px, fs1px],
  );

  const text = (tr: string, en: string) => (locale === 'en' ? en : tr);

  const copyCode = async (code: string, key: string) => {
    try {
      await Share.share({message: code});
      setCopiedKey(key);
      setCopiedVisible(true);
    } catch {
      setCopiedKey(key);
      setCopiedVisible(true);
    }
  };

  if (!topic) {
    return (
      <PageLayout userHeader={false}>
        <Image
          source={luckImage}
          style={styles.bgArt}
          resizeMode="contain"
          pointerEvents="none"
        />
        <TouchableOpacity
          style={styles.topBar}
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}>
          <View style={styles.iconBtn}>
            <Icon name="chevron-back" size="small" color={colors.primary} />
          </View>
          <T
            family="serif"
            size={fontSize.label}
            weight="700"
            color={colors.textDark}
            style={styles.topTitle}>
            {t('luckyNumbers.title')}
          </T>
        </TouchableOpacity>
        <T size={fontSize.body} weight="500" color={colors.textMuted}>
          {t('luckyNumbers.detailMissing')}
        </T>
      </PageLayout>
    );
  }

  const sequences = topic.sequences;
  const topicImage = topicImages[topic.id] ?? fallbackTopicImage;

  return (
    <PageLayout userHeader={false}>
      <Image
        source={luckImage}
        style={styles.bgArt}
        resizeMode="contain"
        pointerEvents="none"
      />

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconBtn}
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel={t('luckyNumbers.detailBack')}>
          <Icon name="chevron-back" size="small" color={colors.primary} />
        </TouchableOpacity>
        <T
          family="serif"
          size={fontSize.label}
          weight="700"
          color={colors.textDark}
          style={styles.topTitle}
          numberOfLines={1}>
          {t('luckyNumbers.title')}
        </T>
        <View style={styles.iconBtn}>
          <Icon name="sparkles" size={15} color={colors.gold} />
        </View>
      </View>

      <View style={styles.topicHeader}>
        <View style={styles.topicThumbWrap}>
          <Image source={topicImage} style={styles.topicThumb} resizeMode="cover" />
          <View style={styles.topicThumbWash} pointerEvents="none" />
        </View>
        <View style={styles.topicCopy}>
          <View style={styles.topicTitleRow}>
            <T
              family="serif"
              size={fontSize.titleXl}
              weight="700"
              color={colors.textDark}
              numberOfLines={1}>
              {text(topic.tr, topic.en)}
            </T>
            <Icon name="sparkles" size={14} color={colors.gold} />
          </View>
          <T
            size={fontSize.caption}
            weight="500"
            color={colors.textMuted}
            style={styles.topicSubtitle}
            numberOfLines={2}>
            {text(topic.subtitleTr, topic.subtitleEn)}
          </T>
        </View>
      </View>

      <LinearGradient
        colors={colors.gradientTile}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.meaningCard}>
        <View style={styles.meaningHeader}>
          <View style={styles.meaningBadge}>
            <Icon name="sparkles" size={14} color={colors.gold} />
          </View>
          <T
            family="serif"
            size={fontSize.subtitle}
            weight="700"
            color={colors.primaryDark}
            style={styles.meaningTitle}>
            {t('luckyNumbers.areaMeaningTitle')}
          </T>
        </View>
        <T
          size={fontSize.bodySmall}
          weight="400"
          color={colors.textMutedDark}
          style={styles.meaningBody}>
          {text(topic.bodyTr, topic.bodyEn)}
        </T>
      </LinearGradient>

      <View style={styles.section}>
        <T family="serif" size={fontSize.title} weight="700" color={colors.textDark}>
          {t('luckyNumbers.detailSequences')}
        </T>
      </View>

      <View style={styles.list}>
        {sequences.map((item, index) => {
          const itemKey = `${item.code}-${index}`;
          const isCopied = copiedKey === itemKey;
          return (
            <LinearGradient
              key={itemKey}
              colors={colors.gradientTile}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.card}>
              <View style={styles.cardRow}>
                <View style={styles.cardBody}>
                  <T
                    family="serif"
                    size={fontSize.title}
                    weight="700"
                    color={colors.textDark}
                    style={styles.code}>
                    {item.code}
                  </T>
                  <T size={fontSize.caption} weight="500" color={colors.textMuted}>
                    {text(item.tr, item.en)}
                  </T>
                </View>
                <TouchableOpacity
                  style={[styles.copyBtn, isCopied ? styles.copyBtnDone : null]}
                  activeOpacity={0.82}
                  onPress={() => copyCode(item.code, itemKey)}
                  accessibilityRole="button"
                  accessibilityLabel={t('luckyNumbers.copy')}>
                  <Icon
                    name={isCopied ? 'checkmark' : 'copy-outline'}
                    size={16}
                    color={isCopied ? colors.success : colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          );
        })}
      </View>

      <PopupModal
        visible={copiedVisible}
        type="success"
        message={t('luckyNumbers.copied')}
        onClose={() => setCopiedVisible(false)}
      />
    </PageLayout>
  );
};

export default LuckyNumbersDetailScreen;
