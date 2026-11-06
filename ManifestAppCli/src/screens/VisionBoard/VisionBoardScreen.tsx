import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useT} from '../../store/useLocaleStore';
import {Icon, PageLayout, T} from '@components';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';
import {useResponsive} from '../../utils/deviceStore/device';

const tiles = [
  {titleKey: 'vision.life', icon: 'home-outline'},
  {titleKey: 'vision.body', icon: 'leaf-outline'},
  {titleKey: 'vision.relationship', icon: 'people-outline'},
  {titleKey: 'vision.creation', icon: 'color-palette-outline'},
] as const;

const VisionBoardScreen = () => {
  const t = useT();
  const {w1px, h1px, fs1px} = useResponsive();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        grid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          width: '100%',
        },
        tile: {
          width: '48.5%',
          marginBottom: 12 * h1px,
        },
        tileInner: {
          minHeight: 140 * h1px,
          borderRadius: 22 * fs1px,
          padding: 16 * w1px,
          justifyContent: 'space-between',
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.14,
          shadowRadius: 10,
          shadowOffset: {width: 0, height: 4},
          elevation: 4,
        },
      }),
    [w1px, h1px, fs1px],
  );

  return (
    <PageLayout title={t('vision.title')} subtitle={t('vision.subtitle')}>
      <View style={styles.grid}>
        {tiles.map(tile => (
          <View key={tile.titleKey} style={styles.tile}>
            <LinearGradient
              colors={colors.gradientTile}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.tileInner}>
              <Icon name={tile.icon} size="large" color={colors.primary} />
              <T
                family="serif"
                size={fontSize.subtitle}
                weight="600"
                color={colors.textDark}>
                {t(tile.titleKey)}
              </T>
            </LinearGradient>
          </View>
        ))}
      </View>
    </PageLayout>
  );
};

export default VisionBoardScreen;
