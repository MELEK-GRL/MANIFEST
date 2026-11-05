import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useT} from '../../store/useLocaleStore';
import {Icon, T} from '@components';
import ScreenFrame from '../ScreenFrame';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';
import {useResponsive} from '../../utils/deviceStore/device';

const HomeScreen = () => {
  const t = useT();
  const {w1px, h1px, fs1px} = useResponsive();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.white,
          borderRadius: 24 * fs1px,
          padding: 20 * w1px,
          shadowColor: '#3A3496',
          shadowOpacity: 0.08,
          shadowRadius: 16,
          shadowOffset: {width: 0, height: 8},
          elevation: 4,
        },
        iconWrap: {
          width: 48 * w1px,
          height: 48 * w1px,
          borderRadius: 16 * fs1px,
          backgroundColor: colors.backgroundPurpleSoft,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 14 * h1px,
        },
        text: {
          marginTop: 8 * h1px,
        },
      }),
    [w1px, h1px, fs1px],
  );

  return (
    <ScreenFrame title={t('home.title')} subtitle={t('home.subtitle')}>
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Icon name="sunny-outline" size="large" color={colors.backgroundPurple} />
        </View>
        <T size={fontSize.title} weight="700" color={colors.textDark}>
          {t('home.today')}
        </T>
        <T
          size={fontSize.body}
          weight="400"
          color={colors.textGraySoft}
          style={styles.text}>
          {t('home.body')}
        </T>
      </View>
    </ScreenFrame>
  );
};

export default HomeScreen;
