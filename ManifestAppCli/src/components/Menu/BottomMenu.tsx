import React, {useMemo} from 'react';
import {View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '../Icons/Icon';
import colors from '../../theme/colors';
import {useResponsive} from '../../utils/deviceStore/device';
import {useT} from '../../store/useLocaleStore';
import type {RootStackParamList} from '../../navigation/types';

const menuButtonImg = require('../../assets/images/MenuButton.png');

const ICON_SIZE = 26;
const CENTER_ICON_SIZE = 96;

type TabKey = 'home' | 'profile' | 'focus' | 'settings' | 'angels';

type Item = {
  key: TabKey;
  labelKey:
    | 'tabs.home'
    | 'tabs.profile'
    | 'tabs.focus'
    | 'tabs.settings'
    | 'tabs.angels';
  icon: string;
  activeIcon: string;
  route?: keyof RootStackParamList;
  center?: boolean;
};

const items: Item[] = [
  {
    key: 'home',
    labelKey: 'tabs.home',
    icon: 'home-outline',
    activeIcon: 'home',
    route: 'Home',
  },
  {
    key: 'profile',
    labelKey: 'tabs.profile',
    icon: 'person-outline',
    activeIcon: 'person',
    route: 'Profile',
  },
  {
    key: 'focus',
    labelKey: 'tabs.focus',
    icon: 'sparkles',
    activeIcon: 'sparkles',
    route: 'Manifest',
    center: true,
  },
  {
    key: 'angels',
    labelKey: 'tabs.angels',
    icon: 'moon-outline',
    activeIcon: 'moon',
    route: 'AngelNumbers',
  },
  {
    key: 'settings',
    labelKey: 'tabs.settings',
    icon: 'settings-outline',
    activeIcon: 'settings',
    route: 'Settings',
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
          paddingHorizontal: 14 * w1px,
          paddingBottom: Math.max(insets.bottom, 10 * h1px),
        },
        sheet: {
          borderRadius: 28 * fs1px,
          paddingVertical: 16 * h1px,
          paddingHorizontal: 12 * w1px,
          flexDirection: 'row',
          alignItems: 'center',
          overflow: 'visible',
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.14,
          shadowRadius: 10,
          shadowOffset: {width: 0, height: 4},
          elevation: 4,
        },
        item: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          height: 52 * h1px,
        },
        iconSlot: {
          width: 40 * w1px,
          height: 40 * w1px,
          alignItems: 'center',
          justifyContent: 'center',
        },
        centerSlot: {
          width: CENTER_ICON_SIZE * w1px,
          height: 52 * h1px,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',
        },
        activeChip: {
          width: 40 * w1px,
          height: 40 * w1px,
          borderRadius: 13 * fs1px,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        shimmer: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: '#FFFFFF33',
          height: '45%',
        },
        centerImage: {
          width: CENTER_ICON_SIZE * w1px,
          height: CENTER_ICON_SIZE * w1px,
        },
      }),
    [w1px, h1px, fs1px, insets.bottom],
  );

  const open = (name?: keyof RootStackParamList) => {
    if (!name || route.name === name) {
      return;
    }
    navigation.reset({
      index: 0,
      routes: [{name}],
    });
  };

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={colors.gradientTile}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.sheet}>
        {items.map(item => {
          const active = item.route ? route.name === item.route : false;

          return (
            <TouchableOpacity
              key={item.key}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={t(item.labelKey)}
              accessibilityState={{selected: active}}
              onPress={() => open(item.route)}
              style={styles.item}>
              {item.center ? (
                <View style={styles.centerSlot}>
                  <Image
                    source={menuButtonImg}
                    style={styles.centerImage}
                    resizeMode="contain"
                  />
                </View>
              ) : active ? (
                <LinearGradient
                  colors={colors.gradientTabActive}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={styles.activeChip}>
                  <View style={styles.shimmer} pointerEvents="none" />
                  <Icon
                    name={item.activeIcon}
                    size={ICON_SIZE}
                    color={colors.textWhite}
                  />
                </LinearGradient>
              ) : (
                <View style={styles.iconSlot}>
                  <Icon
                    name={item.icon}
                    size={ICON_SIZE}
                    color={colors.textLight}
                  />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
    </View>
  );
};

export default BottomMenu;
