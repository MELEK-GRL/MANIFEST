import React, {useMemo, useState} from 'react';
import {Image, Share, StyleSheet, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation, useRoute, type RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Icon, PageLayout, PopupModal, T} from '@components';
import {getGrabovoiTopic} from '../../data/LuckyNumbers/grabovoi';
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
          top: 36 * h1px,
          right: -40 * w1px,
          width: 220 * w1px,
          height: 220 * h1px,
          opacity: 0.95,
          zIndex: 0,
        },
        topBar: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 14 * h1px,
          zIndex: 2,
        },
        topTitle: {
          flex: 1,
          marginHorizontal: 8 * w1px,
        },
        topActions: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8 * w1px,
        },
        iconBtn: {
          width: 36 * w1px,
          height: 36 * w1px,
          borderRadius: 18 * w1px,
          backgroundColor: colors.white,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: colors.borderSoft,
        },
        titleRow: {
          zIndex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 8 * h1px,
        },
        titleSpark: {
          marginLeft: 8 * w1px,
        },
        meaningCard: {
          zIndex: 1,
          borderRadius: 24 * fs1px,
          paddingTop: 18 * h1px,
          paddingBottom: 20 * h1px,
          paddingHorizontal: 18 * w1px,
          marginBottom: 20 * h1px,
          borderWidth: 1,
          borderColor: colors.borderSoft,
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.12,
          shadowRadius: 16,
          shadowOffset: {width: 0, height: 6},
          elevation: 4,
          overflow: 'hidden',
        },
        meaningAccent: {
          position: 'absolute',
          left: 0,
          top: 18 * h1px,
          bottom: 18 * h1px,
          width: 3 * w1px,
          borderTopRightRadius: 3 * fs1px,
          borderBottomRightRadius: 3 * fs1px,
          backgroundColor: colors.gold,
          opacity: 0.85,
        },
        meaningHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 12 * h1px,
          gap: 10 * w1px,
        },
        meaningBadge: {
          width: 34 * w1px,
          height: 34 * w1px,
          borderRadius: 17 * w1px,
          backgroundColor: colors.white,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: colors.goldSoft,
          shadowColor: colors.gold,
          shadowOpacity: 0.18,
          shadowRadius: 6,
          shadowOffset: {width: 0, height: 2},
          elevation: 2,
        },
        meaningTitle: {
          flex: 1,
          letterSpacing: 0.2,
        },
        meaningDivider: {
          height: StyleSheet.hairlineWidth,
          backgroundColor: colors.goldSoft,
          marginBottom: 12 * h1px,
          opacity: 0.9,
        },
        meaningBody: {
          lineHeight: 23 * fs1px,
          letterSpacing: 0.15,
        },
        list: {
          gap: 10 * h1px,
          paddingBottom: 8 * h1px,
        },
        card: {
          borderRadius: 18 * fs1px,
          paddingVertical: 14 * h1px,
          paddingHorizontal: 14 * w1px,
          borderWidth: 1,
          borderColor: colors.borderSoft,
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: {width: 0, height: 3},
          elevation: 2,
        },
        cardRow: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        cardBody: {
          flex: 1,
          paddingRight: 12 * w1px,
        },
        code: {
          letterSpacing: 0.5,
          marginBottom: 4 * h1px,
        },
        copyRing: {
          width: 44 * w1px,
          height: 44 * w1px,
          borderRadius: 22 * w1px,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.white,
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.14,
          shadowRadius: 8,
          shadowOffset: {width: 0, height: 3},
          elevation: 3,
        },
        copyBtn: {
          width: 38 * w1px,
          height: 38 * w1px,
          borderRadius: 19 * w1px,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.peach,
          borderWidth: 1.5,
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
        <View style={styles.topActions}>
          <View style={styles.iconBtn}>
            <Icon name="search-outline" size="small" color={colors.primary} />
          </View>
        </View>
      </View>

      <View style={styles.titleRow}>
        <T family="serif" size={fontSize.display} weight="700" color={colors.textDark}>
          {text(topic.tr, topic.en)}
        </T>
        <Icon
          name="sparkles"
          size="small"
          color={colors.gold}
          style={styles.titleSpark}
        />
      </View>

      <LinearGradient
        colors={[colors.white, colors.cream, colors.blush]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.meaningCard}>
        <View style={styles.meaningAccent} pointerEvents="none" />
        <View style={styles.meaningHeader}>
          <View style={styles.meaningBadge}>
            <Icon name="sparkles" size={15} color={colors.gold} />
          </View>
          <T
            family="serif"
            size={fontSize.subtitleLarge}
            weight="700"
            color={colors.primaryDark}
            style={styles.meaningTitle}>
            {t('luckyNumbers.areaMeaningTitle')}
          </T>
        </View>
        <View style={styles.meaningDivider} />
        <T
          size={fontSize.bodySmall}
          weight="400"
          color={colors.textMutedDark}
          style={styles.meaningBody}>
          {text(topic.bodyTr, topic.bodyEn)}
        </T>
      </LinearGradient>

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
                    size={fontSize.titleLarge}
                    weight="700"
                    color={colors.textDark}
                    style={styles.code}>
                    {item.code}
                  </T>
                  <T size={fontSize.caption} weight="500" color={colors.textMuted}>
                    {text(item.tr, item.en)}
                  </T>
                </View>
                <View style={styles.copyRing}>
                  <TouchableOpacity
                    style={[styles.copyBtn, isCopied ? styles.copyBtnDone : null]}
                    activeOpacity={0.82}
                    onPress={() => copyCode(item.code, itemKey)}
                    accessibilityRole="button"
                    accessibilityLabel={t('luckyNumbers.copy')}>
                    <Icon
                      name={isCopied ? 'checkmark' : 'copy-outline'}
                      size={17}
                      color={isCopied ? colors.success : colors.primary}
                    />
                  </TouchableOpacity>
                </View>
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
