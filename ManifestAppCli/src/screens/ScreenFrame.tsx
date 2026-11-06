import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BottomMenu, PageHeader, T, UserHeader} from '@components';
import colors from '../theme/colors';
import {fontSize} from '../constants/typography';
import {useResponsive} from '../utils/deviceStore/device';

type Props = {
  title: string;
  subtitle?: string;
  userHeader?: boolean;
  children?: React.ReactNode;
};

const ScreenFrame: React.FC<Props> = ({
  title,
  subtitle,
  userHeader = true,
  children,
}) => {
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
          paddingBottom: 150 * h1px,
        },
        headerRow: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        title: {
          flex: 1,
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
    <LinearGradient colors={colors.gradientHero} style={styles.gradient}>
      <View style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          <View style={styles.headerRow}>
            <View style={styles.title}>
              <PageHeader title={title} />
            </View>
            {userHeader ? <UserHeader /> : null}
          </View>
          {subtitle ? (
            <T
              size={fontSize.body}
              weight="400"
              color={colors.textMuted}
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
