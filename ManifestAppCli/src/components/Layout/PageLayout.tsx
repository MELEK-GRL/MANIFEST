import React, {useMemo} from 'react';
import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomMenu from '../Menu/BottomMenu';
import PageHeader from '../Headers/PageHeader';
import T from '../Text/T';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';
import {useResponsive} from '../../utils/deviceStore/device';

/** Shared page edge — screens stay full-bleed inside this inset. */
export const PAGE_EDGE = 16;

type Props = {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  userHeader?: boolean;
  cornerArt?: ImageSourcePropType;
  bottomMenu?: boolean;
  scroll?: boolean;
  softOverlay?: boolean;
  background?: 'gradient' | ImageSourcePropType;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

const PageLayout: React.FC<Props> = ({
  children,
  title,
  subtitle,
  userHeader = true,
  cornerArt,
  bottomMenu = true,
  scroll = true,
  softOverlay = false,
  background = 'gradient',
  contentContainerStyle,
}) => {
  const {w1px, h1px} = useResponsive();
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
        },
        softOverlay: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: colors.backgroundWash,
        },
        safe: {
          flex: 1,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        content: {
          flexGrow: 1,
          paddingHorizontal: PAGE_EDGE * w1px,
          paddingTop: 12 * h1px,
          paddingBottom: bottomMenu
            ? 150 * h1px
            : Math.max(insets.bottom, 12 * h1px) + 24 * h1px,
        },
        page: {
          position: 'relative',
          width: '100%',
        },
        cornerArt: {
          position: 'absolute',
          top: -16 * h1px,
          right: -48 * w1px,
          width: 300 * w1px,
          height: 260 * h1px,
          zIndex: 0,
        },
        header: {
          width: '100%',
          zIndex: 2,
        },
        subtitle: {
          marginTop: 6 * h1px,
        },
        body: {
          marginTop: title ? 16 * h1px : 0,
          width: '100%',
          zIndex: 1,
        },
        bodyFill: {
          flex: 1,
          width: '100%',
          zIndex: 1,
        },
      }),
    [
      w1px,
      h1px,
      insets.top,
      insets.left,
      insets.right,
      insets.bottom,
      bottomMenu,
      title,
    ],
  );

  const page = (
    <View style={scroll ? styles.page : [styles.page, styles.bodyFill]}>
      {cornerArt ? (
        <Image
          source={cornerArt}
          style={styles.cornerArt}
          resizeMode="contain"
          pointerEvents="none"
        />
      ) : null}
      {title ? (
        <View style={styles.header}>
          <PageHeader title={title} showProfile={userHeader} />
        </View>
      ) : null}
      {subtitle ? (
        <T
          size={fontSize.body}
          weight="400"
          color={colors.textMuted}
          style={styles.subtitle}>
          {subtitle}
        </T>
      ) : null}
      <View style={title ? styles.body : styles.bodyFill}>{children}</View>
    </View>
  );

  const frame = (
    <View style={styles.safe}>
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, contentContainerStyle]}>
          {page}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.bodyFill, contentContainerStyle]}>
          {page}
        </View>
      )}
      {bottomMenu ? <BottomMenu /> : null}
    </View>
  );

  if (background === 'gradient') {
    return (
      <LinearGradient colors={colors.gradientHero} style={styles.root}>
        {frame}
      </LinearGradient>
    );
  }

  return (
    <ImageBackground source={background} style={styles.root} resizeMode="cover">
      {softOverlay ? (
        <View style={styles.softOverlay} pointerEvents="none" />
      ) : null}
      {frame}
    </ImageBackground>
  );
};

export default PageLayout;
