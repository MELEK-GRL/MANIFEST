import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Image,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import {ActivityIndicator, Icon, PageLayout, PopupModal, T} from '@components';
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

function isPickerCancel(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    ((error as {code?: string}).code === 'E_PICKER_CANCELLED' ||
      (error as {code?: string}).code === 'E_NO_LIBRARY_PERMISSION')
  );
}

async function ensureGalleryPermission() {
  if (Platform.OS !== 'android') {
    return true;
  }
  if (Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
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
          width: 156 * w1px,
          height: 156 * w1px,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',
        },
        avatar: {
          width: 140 * w1px,
          height: 140 * w1px,
          borderRadius: 70 * w1px,
          backgroundColor: colors.primarySoft,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.16,
          shadowRadius: 12,
          shadowOffset: {width: 0, height: 6},
          elevation: 4,
        },
        photo: {
          width: 140 * w1px,
          height: 140 * w1px,
        },
        badge: {
          position: 'absolute',
          right: 6 * w1px,
          bottom: 6 * h1px,
          width: 42 * w1px,
          height: 42 * w1px,
          borderRadius: 21 * w1px,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          elevation: 8,
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

  const pickPhoto = useCallback(async () => {
    if (uploading) {
      return;
    }

    const allowed = await ensureGalleryPermission();
    if (!allowed) {
      setPhotoError(t('profile.photoError'));
      return;
    }

    try {
      // Android: open after press ends so Activity can launch cleanly.
      await new Promise<void>(resolve => setTimeout(resolve, 80));

      const cropped = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        width: 800,
        height: 800,
        cropping: true,
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

      if (cropped.size > maxPhotoBytes) {
        setPhotoError(t('profile.photoTooLarge'));
        return;
      }

      const uri = cropped.path.startsWith('file://')
        ? cropped.path
        : `file://${cropped.path}`;
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
    } catch (error) {
      if (isPickerCancel(error)) {
        return;
      }
      setPhotoError(t('profile.photoError'));
    }
  }, [t, uploading]);

  return (
    <PageLayout
      title={t('profile.title')}
      subtitle={t('profile.subtitle')}
      userHeader={false}>
      <View style={styles.page}>
        <View style={styles.ring}>
          <Pressable
            disabled={uploading}
            onPress={pickPhoto}
            accessibilityRole="button"
            accessibilityLabel={t(hasPhoto ? 'profile.changePhoto' : 'profile.addPhoto')}>
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
          </Pressable>
          <Pressable
            style={styles.badge}
            disabled={uploading}
            onPress={pickPhoto}
            hitSlop={16}
            accessibilityRole="button"
            accessibilityLabel={t(hasPhoto ? 'profile.changePhoto' : 'profile.addPhoto')}>
            {uploading ? (
              <ActivityIndicator size="small" color={colors.textWhite} />
            ) : (
              <Icon name="camera-outline" size="medium" color={colors.textWhite} />
            )}
          </Pressable>
        </View>
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
    </PageLayout>
  );
};

export default ProfileScreen;
