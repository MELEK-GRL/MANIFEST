import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useT} from '../../store/useLocaleStore';
import {T} from '@components';
import ScreenFrame from '../ScreenFrame';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';
import {useResponsive} from '../../utils/deviceStore/device';

const stepKeys = [
  'manifest.step1',
  'manifest.step2',
  'manifest.step3',
] as const;

const ManifestScreen = () => {
  const t = useT();
  const {w1px, h1px, fs1px} = useResponsive();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.white,
          borderRadius: 20 * fs1px,
          paddingVertical: 16 * h1px,
          paddingHorizontal: 16 * w1px,
          marginBottom: 12 * h1px,
          flexDirection: 'row',
          alignItems: 'center',
        },
        index: {
          width: 32 * w1px,
          height: 32 * w1px,
          borderRadius: 16 * w1px,
          marginRight: 12 * w1px,
          backgroundColor: colors.backgroundPurpleSoft,
          alignItems: 'center',
          justifyContent: 'center',
        },
        label: {
          flex: 1,
        },
      }),
    [w1px, h1px, fs1px],
  );

  return (
    <ScreenFrame title={t('manifest.title')} subtitle={t('manifest.subtitle')}>
      {stepKeys.map((step, index) => (
        <View key={step} style={styles.card}>
          <View style={styles.index}>
            <T size={fontSize.label} weight="700" color={colors.backgroundPurple}>
              {index + 1}
            </T>
          </View>
          <View style={styles.label}>
            <T size={fontSize.body} weight="500" color={colors.textDark}>
              {t(step)}
            </T>
          </View>
        </View>
      ))}
    </ScreenFrame>
  );
};

export default ManifestScreen;
