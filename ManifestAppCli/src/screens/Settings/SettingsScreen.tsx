import React, {useMemo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {T} from '@components';
import ScreenFrame from '../ScreenFrame';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';
import {useResponsive} from '../../utils/deviceStore/device';
import {useLocaleStore, useT, type LocaleCode} from '../../store/useLocaleStore';

const options: {code: LocaleCode; labelKey: 'settings.turkish' | 'settings.english'}[] = [
  {code: 'tr', labelKey: 'settings.turkish'},
  {code: 'en', labelKey: 'settings.english'},
];

const SettingsScreen = () => {
  const t = useT();
  const locale = useLocaleStore(state => state.locale);
  const setLocale = useLocaleStore(state => state.setLocale);
  const {w1px, h1px, fs1px} = useResponsive();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.white,
          borderRadius: 22 * fs1px,
          paddingVertical: 18 * h1px,
          paddingHorizontal: 18 * w1px,
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowOffset: {width: 0, height: 4},
          elevation: 3,
        },
        label: {
          marginBottom: 12 * h1px,
        },
        row: {
          flexDirection: 'row',
        },
        option: {
          flex: 1,
          borderRadius: 16 * fs1px,
          paddingVertical: 12 * h1px,
          alignItems: 'center',
          borderWidth: 1,
        },
        optionGap: {
          marginRight: 10 * w1px,
        },
      }),
    [w1px, h1px, fs1px],
  );

  return (
    <ScreenFrame title={t('settings.title')} subtitle={t('settings.subtitle')}>
      <View style={styles.card}>
        <T size={fontSize.label} weight="600" color={colors.textMutedDark} style={styles.label}>
          {t('settings.language')}
        </T>
        <View style={styles.row}>
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
                  {
                    backgroundColor: selected ? colors.primary : colors.white,
                    borderColor: selected ? colors.primary : colors.borderSoft,
                  },
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
    </ScreenFrame>
  );
};

export default SettingsScreen;
