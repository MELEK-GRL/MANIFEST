import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BottomMenu, PageHeader, T} from '@components';
import colors from '../theme/colors';
import {fontSize} from '../constants/typography';
import {useResponsive} from '../utils/deviceStore/device';

type Props = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

const ScreenFrame: React.FC<Props> = ({title, subtitle, children}) => {
  const {w1px, h1px} = useResponsive();
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        gradient: {
          flex: 1,
        },
        safe: {
          flex: 1,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        content: {
          paddingHorizontal: 20 * w1px,
          paddingBottom: 140 * h1px,
        },
        subtitle: {
          marginTop: 6 * h1px,
        },
        body: {
          marginTop: 16 * h1px,
        },
      }),
    [w1px, h1px, insets.top, insets.left, insets.right],
  );

  return (
    <LinearGradient
      colors={[colors.backgroundTop, colors.backgroundBottom]}
      style={styles.gradient}>
      <View style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          <PageHeader title={title} />
          {subtitle ? (
            <T
              size={fontSize.body}
              weight="400"
              color={colors.textLight}
              style={styles.subtitle}>
              {subtitle}
            </T>
          ) : null}
          <View style={styles.body}>{children}</View>
        </ScrollView>
        <BottomMenu />
      </View>
    </LinearGradient>
  );
};

export default ScreenFrame;
