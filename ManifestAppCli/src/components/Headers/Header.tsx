import React, {useMemo} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useResponsive} from '../../utils/deviceStore/device';
import Icon from '../Icons/Icon';
import T from '../Text/T';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';
import {iconSize} from '../../constants/icons';

type Props = {
  title: string;
  onRightPress?: () => void;
  rightIconName?: string;
};

const Header: React.FC<Props> = ({
  title,
  onRightPress,
  rightIconName = 'settings-outline',
}) => {
  const {w1px, h1px, fs1px} = useResponsive();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          zIndex: 20,
          elevation: 20,
        },
        header: {
          paddingLeft: 14 * w1px,
          paddingRight: 20 * w1px,
          paddingVertical: h1px * 14,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: h1px * 110,
          borderBottomRightRadius: fs1px * 14,
          borderBottomLeftRadius: fs1px * 14,
          overflow: 'hidden',
        },
        headerView: {
          marginTop: h1px * 18,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
        },
        title: {
          flex: 1,
          marginRight: 10 * w1px,
        },
        iconButton: {
          width: iconSize.xl * w1px,
          height: iconSize.xl * h1px,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }),
    [w1px, h1px, fs1px],
  );

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={[colors.backgroundPurpleDark, '#8B6FEB']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={styles.header}>
        <View style={styles.headerView}>
          <View style={styles.title}>
            <T
              size={fontSize.titleLarge}
              weight="700"
              color={colors.textWhite}
              numberOfLines={1}>
              {title}
            </T>
          </View>
          {onRightPress ? (
            <TouchableOpacity
              onPress={onRightPress}
              activeOpacity={0.8}
              style={styles.iconButton}
              accessibilityRole="button">
              <Icon
                name={rightIconName}
                size="xl"
                color={colors.textWhite}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </LinearGradient>
    </View>
  );
};

export default Header;
