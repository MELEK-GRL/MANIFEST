import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Icon, T} from '@components';
import ScreenFrame from '../ScreenFrame';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';
import {useResponsive} from '../../utils/deviceStore/device';
import {useT} from '../../store/useLocaleStore';
import {useAuthStore} from '../../store/useAuthStore';

const ProfileScreen = () => {
  const t = useT();
  const username = useAuthStore(state => state.username);
  const {w1px, h1px, fs1px} = useResponsive();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.white,
          borderRadius: 22 * fs1px,
          paddingVertical: 22 * h1px,
          paddingHorizontal: 18 * w1px,
          alignItems: 'center',
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowOffset: {width: 0, height: 4},
          elevation: 3,
        },
        avatar: {
          width: 72 * w1px,
          height: 72 * w1px,
          borderRadius: 36 * w1px,
          backgroundColor: colors.primarySoft,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 14 * h1px,
        },
        label: {
          marginBottom: 4 * h1px,
        },
      }),
    [w1px, h1px, fs1px],
  );

  return (
    <ScreenFrame title={t('profile.title')} subtitle={t('profile.subtitle')}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Icon name="person" size="xxl" color={colors.primary} />
        </View>
        <T size={fontSize.caption} weight="600" color={colors.textMuted} style={styles.label}>
          {t('profile.username')}
        </T>
        <T family="serif" size={fontSize.titleLarge} weight="700" color={colors.primaryDark}>
          {username ?? ''}
        </T>
      </View>
    </ScreenFrame>
  );
};

export default ProfileScreen;
