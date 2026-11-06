import React, {useEffect, useMemo, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from '../Icons/Icon';
import T from '../Text/T';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';
import {useResponsive} from '../../utils/deviceStore/device';
import {useT} from '../../store/useLocaleStore';
import {useAuthStore} from '../../store/useAuthStore';
import {fetchProfile, profilePhotoUrl} from '../../api/auth';
import type {RootStackParamList} from '../../navigation/types';

const AVATAR = 40;

const UserHeader = () => {
  const t = useT();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const token = useAuthStore(state => state.token);
  const username = useAuthStore(state => state.username);
  const photoRevision = useAuthStore(state => state.photoRevision ?? 0);
  const {w1px, h1px} = useResponsive();
  const [hasPhoto, setHasPhoto] = useState(false);
  const initial = username?.trim().charAt(0).toUpperCase();

  useEffect(() => {
    if (!token) {
      setHasPhoto(false);
      return;
    }
    let active = true;
    fetchProfile()
      .then(profile => {
        if (active) {
          setHasPhoto(profile.hasPhoto);
        }
      })
      .catch(() => {
        if (active) {
          setHasPhoto(false);
        }
      });
    return () => {
      active = false;
    };
  }, [token, photoRevision]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          paddingTop: 20 * h1px,
          paddingBottom: 12 * h1px,
          marginLeft: 12 * w1px,
          justifyContent: 'center',
        },
        avatar: {
          width: AVATAR * w1px,
          height: AVATAR * w1px,
          borderRadius: (AVATAR / 2) * w1px,
          backgroundColor: colors.primarySoft,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        photo: {
          width: AVATAR * w1px,
          height: AVATAR * w1px,
        },
      }),
    [w1px, h1px],
  );

  const openProfile = () => {
    if (route.name === 'Profile') {
      return;
    }
    navigation.reset({
      index: 0,
      routes: [{name: 'Profile'}],
    });
  };

  return (
    <View style={styles.wrap}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={openProfile}
        accessibilityRole="button"
        accessibilityLabel={t('tabs.profile')}>
        <View style={styles.avatar}>
          {hasPhoto && token ? (
            <Image
              source={{
                uri: profilePhotoUrl(photoRevision),
                headers: {Authorization: `Bearer ${token}`},
              }}
              style={styles.photo}
            />
          ) : initial ? (
            <T family="serif" size={fontSize.label} weight="700" color={colors.primaryDark}>
              {initial}
            </T>
          ) : (
            <Icon name="person" size="medium" color={colors.primary} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default UserHeader;
