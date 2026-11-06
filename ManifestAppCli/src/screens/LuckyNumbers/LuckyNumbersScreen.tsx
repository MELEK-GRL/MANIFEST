import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {T} from '@components';
import {grabovoiData} from '../../data/grabovoi';
import {useT, useLocaleStore} from '../../store/useLocaleStore';
import ScreenFrame from '../ScreenFrame';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';
import {useResponsive} from '../../utils/deviceStore/device';

const LuckyNumbersScreen = () => {
  const t = useT();
  const locale = useLocaleStore(state => state.locale);
  const {w1px, h1px, fs1px} = useResponsive();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.white,
          borderRadius: 22 * fs1px,
          paddingVertical: 16 * h1px,
          paddingHorizontal: 16 * w1px,
          marginBottom: 12 * h1px,
          flexDirection: 'row',
          alignItems: 'center',
        },
        index: {
          width: 40 * w1px,
          height: 40 * w1px,
          borderRadius: 14 * fs1px,
          backgroundColor: colors.primarySoft,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 14 * w1px,
        },
        title: {
          flex: 1,
        },
      }),
    [w1px, h1px, fs1px],
  );

  return (
    <ScreenFrame
      title={t('luckyNumbers.title')}
      subtitle={t('luckyNumbers.subtitle')}>
      {grabovoiData.map((topic, index) => (
        <View key={topic.id} style={styles.card}>
          <View style={styles.index}>
            <T size={fontSize.label} weight="700" color={colors.primary}>
              {index + 1}
            </T>
          </View>
          <T
            size={fontSize.body}
            weight="600"
            color={colors.textDark}
            style={styles.title}>
            {locale === 'en' ? topic.en : topic.tr}
          </T>
        </View>
      ))}
    </ScreenFrame>
  );
};

export default LuckyNumbersScreen;
