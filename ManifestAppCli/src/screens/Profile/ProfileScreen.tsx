import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import {ActivityIndicator, Icon, PopupModal, T} from '@components';
import ScreenFrame from '../ScreenFrame';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';
import {useResponsive} from '../../utils/deviceStore/device';
import {useT} from '../../store/useLocaleStore';
import {useAuthStore} from '../../store/useAuthStore';
import {
  authErrorCode,
  fetchProfile,
  profilePhotoUrl,
  uploadProfilePhoto,
} from '../../api/auth';

const maxPhotoBytes = 8_000_000;

function isCropCancel(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as {code?: string}).code === 'E_PICKER_CANCELLED'
  );
}

const ProfileScreen = () => {
  const t = useT();
  const token = useAuthStore(state => state.token);
  const username = useAuthStore(state => state.username);
  const {w1px, h1px} = useResponsive();
  const [email, setEmail] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [photoVersion, setPhotoVersion] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const initial = username?.trim().charAt(0).toUpperCase();

  const loadProfile = useCallback(() => {
    fetchProfile()
      .then(profile => {
        setHasPhoto(profile.hasPhoto);
        setEmail(profile.email);
      })
      .catch(() => setHasPhoto(false));
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        page: {
          alignItems: 'center',
          paddingTop: 18 * h1px,
        },
        ring: {
          width: 112 * w1px,
          height: 112 * w1px,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.16,
          shadowRadius: 12,
          shadowOffset: {width: 0, height: 6},
          elevation: 4,
        },
        avatar: {
          width: 112 * w1px,
          height: 112 * w1px,
          borderRadius: 56 * w1px,
          backgroundColor: colors.primarySoft,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        photo: {
          width: 112 * w1px,
          height: 112 * w1px,
        },
        badge: {
          position: 'absolute',
          right: 2 * w1px,
          bottom: 2 * h1px,
          width: 32 * w1px,
          height: 32 * w1px,
          borderRadius: 16 * w1px,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        },
        details: {
          alignSelf: 'stretch',
          marginTop: 28 * h1px,
          borderTopWidth: 1,
          borderTopColor: colors.borderSoft,
        },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 14 * h1px,
          borderBottomWidth: 1,
          borderBottomColor: colors.borderSoft,
        },
        iconCircle: {
          width: 40 * w1px,
          height: 40 * w1px,
          borderRadius: 20 * w1px,
          backgroundColor: colors.primarySoft,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12 * w1px,
        },
        rowText: {
          flex: 1,
        },
        rowValue: {
          marginTop: 2 * h1px,
        },
      }),
    [w1px, h1px],
  );

  const photoSource = previewUri
    ? {uri: previewUri}
    : hasPhoto && token
      ? {
          uri: profilePhotoUrl(photoVersion),
          headers: {Authorization: `Bearer ${token}`},
        }
      : null;

  const pickPhoto = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.8,
    });
    if (result.didCancel || !result.assets?.length) {
      return;
    }

    const asset = result.assets[0];
    if (!asset.uri) {
      setPhotoError(t('profile.photoInvalid'));
      return;
    }

    let cropped;
    try {
      cropped = await ImageCropPicker.openCropper({
        path: asset.uri,
        mediaType: 'photo',
        width: 800,
        height: 800,
        cropperCircleOverlay: true,
        showCropFrame: false,
        showCropGuidelines: false,
        compressImageQuality: 0.8,
        forceJpg: true,
        cropperToolbarTitle: t('profile.cropTitle'),
        cropperChooseText: t('profile.cropChoose'),
        cropperCancelText: t('common.cancel'),
        cropperTintColor: colors.primary,
      });
    } catch (error) {
      if (isCropCancel(error)) {
        return;
      }
      setPhotoError(t('profile.photoError'));
      return;
    }

    if (cropped.size > maxPhotoBytes) {
      setPhotoError(t('profile.photoTooLarge'));
      return;
    }

    const uri = cropped.path.startsWith('file://') ? cropped.path : `file://${cropped.path}`;
    const type = cropped.mime === 'image/jpg' ? 'image/jpeg' : cropped.mime;
    if (type !== 'image/jpeg' && type !== 'image/png') {
      setPhotoError(t('profile.photoInvalid'));
      return;
    }

    setPreviewUri(uri);
    setUploading(true);
    try {
      await uploadProfilePhoto(uri, type, cropped.filename ?? 'photo.jpg');
      setHasPhoto(true);
      setPhotoVersion(value => value + 1);
      useAuthStore.getState().bumpPhoto();
    } catch (error) {
      setPreviewUri(null);
      const code = authErrorCode(error);
      setPhotoError(
        code === 'photoInvalid' || code === 'photoTooLarge'
          ? t(`profile.${code}`)
          : t('profile.photoError'),
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScreenFrame title={t('profile.title')} subtitle={t('profile.subtitle')}>
      <View style={styles.page}>
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={uploading}
          onPress={pickPhoto}
          accessibilityRole="button"
          accessibilityLabel={t(hasPhoto ? 'profile.changePhoto' : 'profile.addPhoto')}>
          <View style={styles.ring}>
            <View style={styles.avatar}>
              {photoSource ? (
                <Image source={photoSource} style={styles.photo} />
              ) : initial ? (
                <T family="serif" size={fontSize.display} weight="700" color={colors.primaryDark}>
                  {initial}
                </T>
              ) : (
                <Icon name="person" size="xxl" color={colors.primary} />
              )}
            </View>
            <View style={styles.badge}>
              {uploading ? (
                <ActivityIndicator size="small" color={colors.textWhite} />
              ) : (
                <Icon name="camera-outline" size="small" color={colors.textWhite} />
              )}
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.details}>
          <View style={styles.row}>
            <View style={styles.iconCircle}>
              <Icon name="person-outline" size="medium" color={colors.primary} />
            </View>
            <View style={styles.rowText}>
              <T size={fontSize.caption} weight="600" color={colors.textMuted}>
                {t('auth.username')}
              </T>
              <T
                size={fontSize.label}
                weight="600"
                color={colors.textDark}
                style={styles.rowValue}>
                {username ?? ''}
              </T>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.iconCircle}>
              <Icon name="mail-outline" size="medium" color={colors.primary} />
            </View>
            <View style={styles.rowText}>
              <T size={fontSize.caption} weight="600" color={colors.textMuted}>
                {t('auth.email')}
              </T>
              <T
                size={fontSize.label}
                weight="600"
                color={colors.textDark}
                style={styles.rowValue}>
                {email}
              </T>
            </View>
          </View>
        </View>
      </View>
      <PopupModal
        visible={photoError !== null}
        type="error"
        message={photoError ?? ''}
        onClose={() => setPhotoError(null)}
      />
    </ScreenFrame>
  );
};

export default ProfileScreen;
