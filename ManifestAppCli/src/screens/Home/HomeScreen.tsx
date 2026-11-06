import React, {useMemo} from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import {BottomMenu, Icon, T} from '@components';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';
import {useResponsive} from '../../utils/deviceStore/device';
import {useT} from '../../store/useLocaleStore';
import type {RootStackParamList} from '../../navigation/types';

const heroBg = require('../../assets/images/mobilAppBackround.png');
const imgMessage = require('../../assets/images/dailyMessageBackground.png');
const iconAffirmation = require('../../assets/icons/affirmationIcon.png');
const iconRitual = require('../../assets/icons/ritualIcon.png');
const iconManifest = require('../../assets/icons/manifestIcon.png');
const iconVisionBoard = require('../../assets/icons/visionBoardIcon.png');

type Tile = {
  key: string;
  labelKey:
    | 'home.tileAffirmation'
    | 'home.tileRitual'
    | 'home.tileManifest'
    | 'home.tileVisionBoard';
  image: number;
  route: keyof RootStackParamList;
};

const tiles: Tile[] = [
  {
    key: 'affirmation',
    labelKey: 'home.tileAffirmation',
    image: iconAffirmation,
    route: 'Affirmations',
  },
  {
    key: 'ritual',
    labelKey: 'home.tileRitual',
    image: iconRitual,
    route: 'Manifest',
  },
  {
    key: 'manifest',
    labelKey: 'home.tileManifest',
    image: iconManifest,
    route: 'Manifest',
  },
  {
    key: 'visionBoard',
    labelKey: 'home.tileVisionBoard',
    image: iconVisionBoard,
    route: 'VisionBoard',
  },
];

const HomeScreen = () => {
  const t = useT();
  const insets = useSafeAreaInsets();
  const {w1px, h1px, fs1px} = useResponsive();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
          paddingHorizontal: 22 * w1px,
          paddingBottom: 150 * h1px,
        },
        // Referans: üstte menü/zil boşluğu varmış gibi MANIFEST konumu
        brandWrap: {
          alignItems: 'center',
          paddingTop: 8 * h1px,
          paddingBottom: 8 * h1px,
        },
        sparkle: {
          marginBottom: 4 * h1px,
        },
        brand: {
          letterSpacing: 5 * fs1px,
        },
        tagline: {
          marginTop: 90 * h1px,
          marginBottom: 10 * h1px,
          letterSpacing: 1.6 * fs1px,
        },
        focusTitle: {
          marginTop: 0,
          marginBottom: 16 * h1px,
          paddingHorizontal: 8 * w1px,
        },
        grid: {
          flexDirection: 'row',
          marginBottom: 16 * h1px,
        },
        tile: {
          flex: 1,
          marginHorizontal: 5 * w1px,
        },
        tilePress: {
          width: '100%',
        },
        tileInner: {
          width: '100%',
          height: 100 * h1px,
          borderRadius: 20 * fs1px,
          paddingHorizontal: 4 * w1px,
          paddingTop: 2 * h1px,
          paddingBottom: 4 * h1px,
          alignItems: 'center',
          overflow: 'hidden',
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.12,
          shadowRadius: 10,
          shadowOffset: {width: 0, height: 4},
          elevation: 4,
        },
        tileImage: {
          width: 65 * w1px,
          height: 65 * w1px,
        },
        tileLabel: {
          position: 'absolute',
          left: 2 * w1px,
          right: 2 * w1px,
          bottom: 6 * h1px,
          lineHeight: 12 * fs1px,
          height: 24 * fs1px,
          textAlignVertical: 'center',
        },
        messageCard: {
          height: 112 * h1px,
          borderRadius: 22 * fs1px,
          overflow: 'hidden',
          marginBottom: 20 * h1px,
          justifyContent: 'center',
        },
        messageImage: {
          ...StyleSheet.absoluteFillObject,
          width: '100%',
          height: '100%',
        },
        messageWash: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: colors.messageWash,
        },
        messageContent: {
          paddingVertical: 18 * h1px,
          paddingHorizontal: 18 * w1px,
          maxWidth: '68%',
          zIndex: 1,
        },
        messageTitle: {
          marginBottom: 8 * h1px,
        },
        journeyHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 2 * h1px,
          marginBottom: 12 * h1px,
        },
        journeyLine: {
          flex: 1,
          height: 1,
          backgroundColor: colors.borderSoft,
        },
        journeyTitle: {
          marginHorizontal: 10 * w1px,
        },
        ritualCard: {
          borderRadius: 24 * fs1px,
          paddingVertical: 14 * h1px,
          paddingHorizontal: 16 * w1px,
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.14,
          shadowRadius: 10,
          shadowOffset: {width: 0, height: 4},
          elevation: 4,
        },
        progress: {
          width: 48 * w1px,
          height: 48 * w1px,
          marginRight: 14 * w1px,
          alignItems: 'center',
          justifyContent: 'center',
        },
        progressTrack: {
          ...StyleSheet.absoluteFillObject,
          borderRadius: 24 * w1px,
          borderWidth: 3.5 * fs1px,
          borderColor: colors.goldSoft,
        },
        progressHalf: {
          position: 'absolute',
          top: 0,
          width: 24 * w1px,
          height: 48 * w1px,
          overflow: 'hidden',
        },
        progressHalfRight: {
          right: 0,
        },
        progressHalfLeft: {
          left: 0,
        },
        progressDisc: {
          width: 48 * w1px,
          height: 48 * w1px,
          borderRadius: 24 * w1px,
        },
        progressDiscRight: {
          marginLeft: -24 * w1px,
        },
        progressLeftPivot: {
          width: 48 * w1px,
          height: 48 * w1px,
          transform: [{rotate: '36deg'}],
        },
        progressLeftClip: {
          width: 24 * w1px,
          height: 48 * w1px,
          overflow: 'hidden',
        },
        progressInner: {
          width: 37 * w1px,
          height: 37 * w1px,
          borderRadius: 19 * w1px,
          backgroundColor: colors.cream,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        },
        ritualText: {
          flex: 1,
          marginRight: 8 * w1px,
        },
        ritualTitle: {
          marginBottom: 2 * h1px,
        },
        ritualNext: {
          width: 34 * w1px,
          height: 34 * w1px,
          borderRadius: 17 * w1px,
          backgroundColor: colors.blush,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.12,
          shadowRadius: 6,
          shadowOffset: {width: 0, height: 2},
          elevation: 3,
        },
      }),
    [w1px, h1px, fs1px, insets.top, insets.left, insets.right],
  );

  const open = (name: keyof RootStackParamList) => {
    navigation.reset({index: 0, routes: [{name}]});
  };

  return (
    <ImageBackground
      source={heroBg}
      style={styles.root}
      resizeMode="cover">
      <View style={styles.softOverlay} pointerEvents="none" />
      <View style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          <View style={styles.brandWrap}>
            <Icon
              name="sparkles"
              size="small"
              color={colors.gold}
              style={styles.sparkle}
            />
            <T
              family="serif"
              size={fontSize.brand}
              weight="700"
              color={colors.primaryDark}
              align="center"
              style={styles.brand}>
              {t('home.brand')}
            </T>
          </View>

          <T
            family="sans"
            size={fontSize.caption}
            weight="600"
            color={colors.textMutedDark}
            align="center"
            style={styles.tagline}
            numberOfLines={1}>
            {t('home.tagline')}
          </T>
          <T
            family="serif"
            size={fontSize.titleLarge}
            weight="700"
            color={colors.primaryDark}
            align="center"
            style={styles.focusTitle}>
            {t('home.focusTitle')}
          </T>

          <View style={styles.grid}>
            {tiles.map(tile => (
              <View key={tile.key} style={styles.tile}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => open(tile.route)}
                  style={styles.tilePress}>
                  <LinearGradient
                    colors={colors.gradientTile}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={styles.tileInner}>
                    <Image
                      source={tile.image}
                      style={styles.tileImage}
                      resizeMode="contain"
                    />
                    <T
                      family="sans"
                      size={fontSize.caption}
                      weight="500"
                      color={colors.primary}
                      align="center"
                      numberOfLines={2}
                      style={styles.tileLabel}>
                      {t(tile.labelKey)}
                    </T>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.messageCard}>
            <Image
              source={imgMessage}
              style={styles.messageImage}
              resizeMode="cover"
            />
            <View style={styles.messageWash} pointerEvents="none" />
            <View style={styles.messageContent}>
              <T
                family="serif"
                italic
                size={fontSize.subtitle}
                weight="600"
                color={colors.black}
                style={styles.messageTitle}>
                {t('home.messageTitle')}
              </T>
              <T
                family="serif"
                italic
                size={fontSize.bodySmall}
                weight="600"
                color={colors.textMutedDark}>
                {t('home.messageBody')}
              </T>
            </View>
          </View>

          <View style={styles.journeyHeader}>
            <View style={styles.journeyLine} />
            <T
              family="serif"
              size={fontSize.label}
              weight="600"
              color={colors.textMuted}
              align="center"
              style={styles.journeyTitle}>
              {t('home.journeyTitle')}
            </T>
            <View style={styles.journeyLine} />
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => open('Manifest')}>
            <LinearGradient
              colors={colors.gradientTile}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.ritualCard}>
              <View style={styles.progress}>
                <View style={styles.progressTrack} />
                <View style={[styles.progressHalf, styles.progressHalfRight]}>
                  <LinearGradient
                    colors={colors.gradientProgress}
                    start={{x: 0.3, y: 0}}
                    end={{x: 0.9, y: 1}}
                    style={[styles.progressDisc, styles.progressDiscRight]}
                  />
                </View>
                <View style={[styles.progressHalf, styles.progressHalfLeft]}>
                  <View style={styles.progressLeftPivot}>
                    <View style={styles.progressLeftClip}>
                      <LinearGradient
                        colors={colors.gradientProgress}
                        start={{x: 0.3, y: 0}}
                        end={{x: 0.9, y: 1}}
                        style={styles.progressDisc}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.progressInner}>
                  <T
                    family="sans"
                    size={fontSize.caption}
                    weight="700"
                    color={colors.textDark}>
                    {t('home.ritualProgress')}
                  </T>
                </View>
              </View>
              <View style={styles.ritualText}>
                <T
                  family="serif"
                  size={fontSize.label}
                  weight="700"
                  color={colors.textDark}
                  style={styles.ritualTitle}>
                  {t('home.ritualTitle')}
                </T>
                <T
                  family="sans"
                  size={fontSize.caption}
                  weight="500"
                  color={colors.textMuted}>
                  {t('home.ritualBody')}
                </T>
              </View>
              <View style={styles.ritualNext}>
                <Icon
                  name="chevron-forward"
                  size={18}
                  color={colors.textDark}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
        <BottomMenu />
      </View>
    </ImageBackground>
  );
};

export default HomeScreen;
