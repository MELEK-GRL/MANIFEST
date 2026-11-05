import React, {useMemo} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from '../Icons/Icon';
import T from '../Text/T';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';
import {useResponsive} from '../../utils/deviceStore/device';
import {useT} from '../../store/useLocaleStore';
import type {RootStackParamList} from '../../navigation/types';

type Item = {
  name: keyof RootStackParamList;
  labelKey: 'tabs.home' | 'tabs.manifest' | 'tabs.vision' | 'tabs.affirmation';
  icon: string;
  activeIcon: string;
};

const items: Item[] = [
  {name: 'Home', labelKey: 'tabs.home', icon: 'home-outline', activeIcon: 'home'},
  {
    name: 'Manifestasyon',
    labelKey: 'tabs.manifest',
    icon: 'sparkles-outline',
    activeIcon: 'sparkles',
  },
  {
    name: 'VisionBoard',
    labelKey: 'tabs.vision',
    icon: 'images-outline',
    activeIcon: 'images',
  },
  {
    name: 'Olumlamalar',
    labelKey: 'tabs.affirmation',
    icon: 'heart-outline',
    activeIcon: 'heart',
  },
];

const BottomMenu = () => {
  const t = useT();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const {w1px, h1px, fs1px} = useResponsive();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: 16 * w1px,
          paddingBottom: Math.max(insets.bottom, 12 * h1px),
        },
        sheet: {
          backgroundColor: colors.white,
          borderRadius: 28 * fs1px,
          paddingTop: 10 * h1px,
          paddingBottom: 12 * h1px,
          paddingHorizontal: 8 * w1px,
          shadowColor: colors.backgroundPurple,
          shadowOpacity: 0.16,
          shadowRadius: 18,
          shadowOffset: {width: 0, height: 8},
          elevation: 12,
        },
        handle: {
          alignSelf: 'center',
          width: 36 * w1px,
          height: 4 * h1px,
          borderRadius: 4,
          backgroundColor: colors.backgroundPurpleSoft,
          marginBottom: 10 * h1px,
        },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        item: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 8 * h1px,
          borderRadius: 18 * fs1px,
        },
        itemActive: {
          backgroundColor: colors.backgroundPurpleSoft,
        },
        label: {
          marginTop: 4 * h1px,
        },
      }),
    [w1px, h1px, fs1px, insets.bottom],
  );

  const open = (name: keyof RootStackParamList) => {
    if (route.name === name) {
      return;
    }
    navigation.reset({
      index: 0,
      routes: [{name}],
    });
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.row}>
          {items.map(item => {
            const active = route.name === item.name;
            return (
              <TouchableOpacity
                key={item.name}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityState={{selected: active}}
                onPress={() => open(item.name)}
                style={active ? [styles.item, styles.itemActive] : styles.item}>
                <Icon
                  name={active ? item.activeIcon : item.icon}
                  size="medium"
                  color={
                    active ? colors.backgroundPurple : colors.textLight
                  }
                />
                <T
                  size={fontSize.caption}
                  weight={active ? '700' : '500'}
                  color={active ? colors.backgroundPurple : colors.textLight}
                  align="center"
                  numberOfLines={1}
                  style={styles.label}>
                  {t(item.labelKey)}
                </T>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default BottomMenu;
