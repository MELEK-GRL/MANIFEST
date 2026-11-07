import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Icon, PageLayout, T} from '@components';
import {
  loadSavedBoards,
  type SavedVisionBoard,
} from '../../components/VisionBoard';
import {useAuthStore} from '../../store/useAuthStore';
import {useLocaleStore, useT} from '../../store/useLocaleStore';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';
import {useResponsive} from '../../utils/deviceStore/device';
import type {RootStackParamList} from '../../navigation/types';

const VisionBoardListScreen = () => {
  const t = useT();
  const locale = useLocaleStore(state => state.locale);
  const token = useAuthStore(state => state.token);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {w1px, h1px, fs1px} = useResponsive();
  const [boards, setBoards] = useState<SavedVisionBoard[]>([]);
  const [loading, setLoading] = useState(true);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        topBar: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 16 * h1px,
          gap: 10 * w1px,
        },
        backBtn: {
          width: 38 * w1px,
          height: 38 * w1px,
          borderRadius: 19 * w1px,
          backgroundColor: colors.white,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: colors.borderSoft,
        },
        topText: {
          flex: 1,
          gap: 2 * h1px,
        },
        list: {
          gap: 10 * h1px,
        },
        card: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12 * w1px,
          padding: 12 * w1px,
          borderRadius: 18 * fs1px,
          backgroundColor: colors.white,
          borderWidth: 1,
          borderColor: colors.borderSoft,
        },
        cover: {
          width: 56 * w1px,
          height: 56 * w1px,
          borderRadius: 14 * fs1px,
          backgroundColor: colors.lavender,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        coverImage: {
          width: '100%',
          height: '100%',
        },
        body: {
          flex: 1,
          minWidth: 0,
          gap: 2 * h1px,
        },
        empty: {
          paddingVertical: 40 * h1px,
          alignItems: 'center',
        },
      }),
    [w1px, h1px, fs1px],
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setBoards(await loadSavedBoards());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refresh();
    });
    return unsubscribe;
  }, [navigation, refresh]);

  return (
    <PageLayout title={t('vision.listTitle')}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel={t('common.cancel')}>
          <Icon name="chevron-back" size="small" color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.topText}>
          <T size={fontSize.subtitle} weight="700" color={colors.primaryDark}>
            {t('vision.listTitle')}
          </T>
          <T size={fontSize.caption} weight="500" color={colors.textMuted}>
            {t('vision.listSubtitle')}
          </T>
        </View>
      </View>

      <View style={styles.list}>
        {!loading && boards.length === 0 ? (
          <View style={styles.empty}>
            <T size={fontSize.body} color={colors.textMuted} align="center">
              {t('vision.savedEmpty')}
            </T>
          </View>
        ) : (
          boards.map(entry => {
            let dateLabel = entry.savedAt;
            try {
              dateLabel = new Date(entry.savedAt).toLocaleString(
                locale === 'tr' ? 'tr-TR' : 'en-US',
                {dateStyle: 'medium', timeStyle: 'short'},
              );
            } catch {
              // keep raw
            }
            return (
              <TouchableOpacity
                key={entry.id}
                style={styles.card}
                activeOpacity={0.88}
                onPress={() =>
                  navigation.navigate('VisionBoardDetail', {boardId: entry.id})
                }
                accessibilityRole="button"
                accessibilityLabel={t('vision.savedOpen')}>
                <View style={styles.cover}>
                  {entry.coverUri ? (
                    <Image
                      source={{
                        uri: entry.coverUri,
                        headers: token
                          ? {Authorization: `Bearer ${token}`}
                          : undefined,
                      }}
                      style={styles.coverImage}
                    />
                  ) : (
                    <Icon name="heart" size="small" color={colors.primary} />
                  )}
                </View>
                <View style={styles.body}>
                  <T
                    size={fontSize.label}
                    weight="700"
                    color={colors.primaryDark}
                    numberOfLines={1}>
                    {dateLabel}
                  </T>
                  <T
                    size={fontSize.caption}
                    weight="500"
                    color={colors.textMuted}
                    numberOfLines={1}>
                    {t('vision.savedMeta')
                      .replace('{photos}', String(entry.photoCount))
                      .replace('{dreams}', String(entry.dreamCount))}
                  </T>
                </View>
                <Icon
                  name="chevron-forward"
                  size="small"
                  color={colors.primary}
                />
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </PageLayout>
  );
};

export default VisionBoardListScreen;
