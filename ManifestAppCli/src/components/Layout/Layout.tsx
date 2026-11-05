import React, {useMemo} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useResponsive} from '../../utils/deviceStore/device';
import colors from '../../theme/colors';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  bgColor?: string;
  paddingVertical?: number;
  paddingHorizontal?: number;
};

const Layout: React.FC<Props> = ({
  children,
  style,
  bgColor = colors.background,
  paddingHorizontal = 16,
  paddingVertical = 0,
}) => {
  const {w1px, h1px} = useResponsive();
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safe: {
          flex: 1,
          backgroundColor: bgColor,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        container: {
          flex: 1,
          paddingHorizontal: paddingHorizontal * w1px,
          paddingVertical: paddingVertical * h1px,
        },
      }),
    [bgColor, w1px, h1px, paddingVertical, paddingHorizontal, insets.left, insets.right],
  );

  return (
    <View style={[styles.safe, style]}>
      <View style={styles.container}>{children}</View>
    </View>
  );
};

export default Layout;
