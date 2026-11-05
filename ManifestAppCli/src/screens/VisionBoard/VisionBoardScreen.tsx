import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useT} from '../../store/useLocaleStore';
import {Icon, T} from '@components';
import ScreenFrame from '../ScreenFrame';
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
        },
        tile: {
          width: '48%',
          backgroundColor: colors.white,
          borderRadius: 22 * fs1px,
          minHeight: 140 * h1px,
          marginBottom: 12 * h1px,
          padding: 16 * w1px,
          justifyContent: 'space-between',
        },
      }),
    [w1px, h1px, fs1px],
  );

  return (
    <ScreenFrame title={t('vision.title')} subtitle={t('vision.subtitle')}>
      <View style={styles.grid}>
        {tiles.map(tile => (
          <View key={tile.titleKey} style={styles.tile}>
            <Icon name={tile.icon} size="large" color={colors.backgroundPurple} />
            <T size={fontSize.subtitle} weight="600" color={colors.textDark}>
              {t(tile.titleKey)}
            </T>
          </View>
        ))}
      </View>
    </ScreenFrame>
  );
};

export default VisionBoardScreen;
