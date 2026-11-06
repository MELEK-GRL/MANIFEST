import React, {useMemo, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Icon, PageLayout, PopupModal, T} from '@components';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';
import {useResponsive} from '../../utils/deviceStore/device';
import {useLocaleStore, useT, type LocaleCode} from '../../store/useLocaleStore';
import {useAuthStore} from '../../store/useAuthStore';
import type {RootStackParamList} from '../../navigation/types';

const options: {code: LocaleCode; labelKey: 'settings.turkish' | 'settings.english'}[] = [
  {code: 'tr', labelKey: 'settings.turkish'},
  {code: 'en', labelKey: 'settings.english'},
];

const SettingsScreen = () => {
  const t = useT();
  const locale = useLocaleStore(state => state.locale);
  const setLocale = useLocaleStore(state => state.setLocale);
  const clearSession = useAuthStore(state => state.clearSession);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const {w1px, h1px, fs1px} = useResponsive();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.white,
          borderRadius: 22 * fs1px,
          paddingVertical: 16 * h1px,
          paddingHorizontal: 16 * w1px,
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowOffset: {width: 0, height: 4},
          elevation: 3,
        },
        heading: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 14 * h1px,
        },
        iconCircle: {
          width: 44 * w1px,
          height: 44 * w1px,
          borderRadius: 22 * w1px,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12 * w1px,
        },
        headingText: {
          flex: 1,
        },
        hint: {
          marginTop: 2 * h1px,
        },
        track: {
          flexDirection: 'row',
          backgroundColor: colors.primarySoft,
          borderRadius: 16 * fs1px,
          padding: 4 * w1px,
        },
        option: {
          flex: 1,
          borderRadius: 13 * fs1px,
          paddingVertical: 12 * h1px,
          alignItems: 'center',
        },
        optionGap: {
          marginRight: 6 * w1px,
        },
        logout: {
          marginTop: 14 * h1px,
          backgroundColor: colors.white,
          borderRadius: 22 * fs1px,
          paddingVertical: 14 * h1px,
          paddingHorizontal: 16 * w1px,
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowOffset: {width: 0, height: 4},
          elevation: 3,
        },
        logoutLabel: {
          flex: 1,
        },
      }),
    [w1px, h1px, fs1px],
  );

  const logout = () => {
    setLogoutVisible(false);
    clearSession();
    navigation.reset({index: 0, routes: [{name: 'Login'}]});
  };

  return (
    <PageLayout
      title={t('settings.title')}
      subtitle={t('settings.subtitle')}
      userHeader={false}>
      <View style={styles.card}>
        <View style={styles.heading}>
          <View style={[styles.iconCircle, {backgroundColor: colors.primarySoft}]}>
            <Icon name="language-outline" size="large" color={colors.primary} />
          </View>
          <View style={styles.headingText}>
            <T size={fontSize.label} weight="600" color={colors.textDark}>
              {t('settings.language')}
            </T>
            <T
              size={fontSize.caption}
              weight="500"
              color={colors.textMuted}
              style={styles.hint}>
              {t('settings.languageHint')}
            </T>
          </View>
        </View>
        <View style={styles.track}>
          {options.map((option, index) => {
            const selected = locale === option.code;
            return (
              <TouchableOpacity
                key={option.code}
                activeOpacity={0.85}
                onPress={() => setLocale(option.code)}
                style={[
                  styles.option,
                  index === 0 ? styles.optionGap : null,
                  {backgroundColor: selected ? colors.primary : colors.primarySoft},
                ]}>
                <T
                  size={fontSize.label}
                  weight="600"
                  color={selected ? colors.textWhite : colors.primary}>
                  {t(option.labelKey)}
                </T>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setLogoutVisible(true)}
        style={styles.logout}>
        <View style={[styles.iconCircle, {backgroundColor: colors.dangerSoft}]}>
          <Icon name="log-out-outline" size="large" color={colors.danger} />
        </View>
        <T
          size={fontSize.label}
          weight="600"
          color={colors.dangerText}
          style={styles.logoutLabel}>
          {t('settings.logout')}
        </T>
        <Icon name="chevron-forward" size="small" color={colors.textLight} />
      </TouchableOpacity>
      <PopupModal
        visible={logoutVisible}
        type="danger"
        title={t('settings.logoutTitle')}
        message={t('settings.logoutMessage')}
        leftButtonText={t('common.cancel')}
        rightButtonText={t('settings.logout')}
        onLeftPress={() => setLogoutVisible(false)}
        onRightPress={logout}
        onClose={() => setLogoutVisible(false)}
      />
    </PageLayout>
  );
};

export default SettingsScreen;
