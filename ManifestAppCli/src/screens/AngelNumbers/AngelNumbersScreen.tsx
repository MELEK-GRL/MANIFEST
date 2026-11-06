import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useT} from '../../store/useLocaleStore';
import {T} from '@components';
import ScreenFrame from '../ScreenFrame';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';
import {useResponsive} from '../../utils/deviceStore/device';

const numbers = [
  {code: '111', meaningKey: 'angelNumbers.n111'},
  {code: '222', meaningKey: 'angelNumbers.n222'},
  {code: '333', meaningKey: 'angelNumbers.n333'},
  {code: '444', meaningKey: 'angelNumbers.n444'},
  {code: '555', meaningKey: 'angelNumbers.n555'},
  {code: '777', meaningKey: 'angelNumbers.n777'},
] as const;

const AngelNumbersScreen = () => {
  const t = useT();
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
        codeWrap: {
          width: 64 * w1px,
          height: 48 * h1px,
          borderRadius: 14 * fs1px,
          backgroundColor: colors.primarySoft,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 14 * w1px,
        },
        textWrap: {
          flex: 1,
        },
      }),
    [w1px, h1px, fs1px],
  );

  return (
    <ScreenFrame
      title={t('angelNumbers.title')}
      subtitle={t('angelNumbers.subtitle')}>
      {numbers.map(item => (
        <View key={item.code} style={styles.card}>
          <View style={styles.codeWrap}>
            <T size={fontSize.subtitle} weight="700" color={colors.primary}>
              {item.code}
            </T>
          </View>
          <View style={styles.textWrap}>
            <T size={fontSize.body} weight="500" color={colors.textDark}>
              {t(item.meaningKey)}
            </T>
          </View>
        </View>
      ))}
    </ScreenFrame>
  );
};

export default AngelNumbersScreen;
