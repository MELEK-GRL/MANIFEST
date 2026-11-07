import React, {useEffect, useMemo, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import {useResponsive} from '../../utils/deviceStore/device';
import T from '../Text/T';
import Icon from '../Icons/Icon';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';
import {useT} from '../../store/useLocaleStore';
import {useAuthStore} from '../../store/useAuthStore';
import {fetchProfile, profilePhotoUrl} from '../../api/auth';
import type {RootStackParamList} from '../../navigation/types';

const AVATAR = 60;
const PAGE_HEADER_TOP = 20;
const PAGE_HEADER_BOTTOM = 12;

type Props = {
  title: string;
  showProfile?: boolean;
};

const PageHeader: React.FC<Props> = ({title, showProfile = true}) => {
  const t = useT();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const token = useAuthStore(state => state.token);
  const username = useAuthStore(state => state.username);
  const photoRevision = useAuthStore(state => state.photoRevision ?? 0);
  const {w1px, h1px, fs1px} = useResponsive();
  const [hasPhoto, setHasPhoto] = useState(false);
  const initial = username?.trim().charAt(0).toUpperCase();

  useEffect(() => {
    if (!showProfile || !token) {
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
  }, [token, photoRevision, showProfile]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: PAGE_HEADER_TOP * h1px,
          paddingBottom: PAGE_HEADER_BOTTOM * h1px,
          paddingHorizontal: 0,
        },
        title: {
          flex: 1,
          paddingRight: 12 * w1px,
        },
        ring: {
          padding: 1.5 * fs1px,
          borderRadius: ((AVATAR + 3) / 2) * w1px,
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.14,
          shadowRadius: 8,
          shadowOffset: {width: 0, height: 3},
          elevation: 3,
        },
        avatar: {
          width: AVATAR * w1px,
          height: AVATAR * w1px,
          borderRadius: (AVATAR / 2) * w1px,
          backgroundColor: colors.primarySoft,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.lavender,
        },
        photo: {
          width: '100%',
          height: '100%',
        },
      }),
    [w1px, h1px, fs1px],
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
      <View style={styles.title}>
        <T family="serif" size={fontSize.title} weight="700" color={colors.textDark}>
          {title}
        </T>
      </View>
      {showProfile ? (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={openProfile}
          accessibilityRole="button"
          accessibilityLabel={t('tabs.profile')}>
          <LinearGradient
            colors={[colors.goldSoft, colors.lavender, colors.goldSoft]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.ring}>
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
                <T
                  family="serif"
                  size={fontSize.label}
                  weight="700"
                  color={colors.primaryDark}>
                  {initial}
                </T>
              ) : (
                <Icon name="person" size="medium" color={colors.primary} />
              )}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default PageHeader;
