import React, {useMemo} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation, useRoute, type RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Icon, PageLayout, T} from '@components';
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

const LuckyNumbersDetailScreen = () => {
  const t = useT();
  const locale = useLocaleStore(state => state.locale);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route =
    useRoute<RouteProp<RootStackParamList, 'LuckyNumbersDetail'>>();
  const {w1px, h1px, fs1px} = useResponsive();
  const topic = getGrabovoiTopic(route.params.topicId);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        back: {
          alignSelf: 'flex-start',
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 14 * h1px,
          paddingVertical: 4 * h1px,
        },
        backIcon: {
          marginRight: 4 * w1px,
        },
        hero: {
          width: '100%',
          borderRadius: 22 * fs1px,
          overflow: 'hidden',
          marginBottom: 18 * h1px,
          borderWidth: 1,
          borderColor: colors.borderSoft,
        },
        heroImage: {
          width: '100%',
          height: 168 * h1px,
        },
        heroWash: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: colors.messageWash,
          opacity: 0.55,
        },
        subtitle: {
          marginTop: 6 * h1px,
          marginBottom: 10 * h1px,
        },
        body: {
          marginBottom: 18 * h1px,
          lineHeight: 22 * fs1px,
        },
        sectionLabel: {
          marginBottom: 12 * h1px,
        },
        list: {
          width: '100%',
          gap: 10 * h1px,
        },
        sequenceCard: {
          borderRadius: 18 * fs1px,
          paddingHorizontal: 14 * w1px,
          paddingVertical: 14 * h1px,
          borderWidth: 1,
          borderColor: colors.borderSoft,
        },
        sequenceCode: {
          letterSpacing: 1.2 * fs1px,
          marginBottom: 6 * h1px,
        },
      }),
    [w1px, h1px, fs1px],
  );

  const text = (tr: string, en: string) => (locale === 'en' ? en : tr);

  if (!topic) {
    return (
      <PageLayout title={t('luckyNumbers.title')} userHeader={false}>
        <TouchableOpacity
          style={styles.back}
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}>
          <Icon
            name="chevron-back"
            size="small"
            color={colors.primary}
            style={styles.backIcon}
          />
          <T size={fontSize.label} weight="600" color={colors.primary}>
            {t('luckyNumbers.detailBack')}
          </T>
        </TouchableOpacity>
        <T size={fontSize.body} weight="500" color={colors.textMuted}>
          {t('luckyNumbers.detailMissing')}
        </T>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={text(topic.tr, topic.en)} userHeader={false}>
      <TouchableOpacity
        style={styles.back}
        activeOpacity={0.85}
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        accessibilityLabel={t('luckyNumbers.detailBack')}>
        <Icon
          name="chevron-back"
          size="small"
          color={colors.primary}
          style={styles.backIcon}
        />
        <T size={fontSize.label} weight="600" color={colors.primary}>
          {t('luckyNumbers.detailBack')}
        </T>
      </TouchableOpacity>

      <View style={styles.hero}>
        <Image
          source={topicImages[topic.id] ?? fallbackTopicImage}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroWash} pointerEvents="none" />
      </View>

      <T size={fontSize.body} weight="500" color={colors.textMuted} style={styles.subtitle}>
        {text(topic.subtitleTr, topic.subtitleEn)}
      </T>
      <T size={fontSize.bodySmall} weight="400" color={colors.textMutedDark} style={styles.body}>
        {text(topic.bodyTr, topic.bodyEn)}
      </T>

      <T
        family="serif"
        size={fontSize.title}
        weight="700"
        color={colors.textDark}
        style={styles.sectionLabel}>
        {t('luckyNumbers.detailSequences')}
      </T>

      <View style={styles.list}>
        {topic.sequences.map(item => (
          <LinearGradient
            key={item.code}
            colors={colors.gradientTile}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.sequenceCard}>
            <T
              family="serif"
              size={fontSize.titleLarge}
              weight="700"
              color={colors.primaryDark}
              style={styles.sequenceCode}>
              {item.code}
            </T>
            <T size={fontSize.caption} weight="500" color={colors.textMuted}>
              {text(item.tr, item.en)}
            </T>
          </LinearGradient>
        ))}
      </View>
    </PageLayout>
  );
};

export default LuckyNumbersDetailScreen;
