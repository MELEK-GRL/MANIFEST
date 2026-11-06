import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useT} from '../../store/useLocaleStore';
import {T} from '@components';
import ScreenFrame from '../ScreenFrame';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';
import {useResponsive} from '../../utils/deviceStore/device';

const lineKeys = [
  'affirmations.line1',
  'affirmations.line2',
  'affirmations.line3',
] as const;

const AffirmationsScreen = () => {
  const t = useT();
  const {w1px, h1px, fs1px} = useResponsive();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.white,
          borderRadius: 22 * fs1px,
          paddingVertical: 18 * h1px,
          paddingHorizontal: 18 * w1px,
          marginBottom: 12 * h1px,
          borderLeftWidth: 4 * w1px,
          borderLeftColor: colors.primary,
        },
      }),
    [w1px, h1px, fs1px],
  );

  return (
    <ScreenFrame
      title={t('affirmations.title')}
      subtitle={t('affirmations.subtitle')}>
      {lineKeys.map(line => (
        <View key={line} style={styles.card}>
          <T size={fontSize.bodyMedium} weight="500" color={colors.textDark}>
            {t(line)}
          </T>
        </View>
      ))}
    </ScreenFrame>
  );
};

export default OlumlamalarScreen;
