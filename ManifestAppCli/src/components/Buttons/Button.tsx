import React, {useMemo} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  View,
  DimensionValue,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useResponsive} from '../../utils/deviceStore/device';
import ActivityIndicator from '../ActivityIndicator/ActivityIndicator';
import T from '../Text/T';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';

type Props = {
  buttonText: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  activityIndicatorLoading?: boolean;
  style?: ViewStyle;
  width?: DimensionValue;
  backgroundColor?: string;
};

const Button: React.FC<Props> = ({
  buttonText,
  onPress,
  disabled = false,
  loading = false,
  activityIndicatorLoading = false,
  style,
  width = '100%',
  backgroundColor = colors.primary,
}) => {
  const {w1px, h1px} = useResponsive();
  const isBusy = loading || activityIndicatorLoading;

  const isPrimary =
    backgroundColor === colors.primary ||
    backgroundColor === colors.primaryDark;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        button: {
          backgroundColor: isPrimary ? undefined : backgroundColor,
          borderRadius: 16 * w1px,
          paddingVertical: 10 * h1px,
          paddingHorizontal: 12 * h1px,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
          flexDirection: 'row',
          width: '100%',
          overflow: 'hidden',
        },
        buttonView: {
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          width,
        },
        pressable: {
          width: '100%',
        },
        spinner: {
          marginRight: 8 * w1px,
        },
      }),
    [w1px, h1px, disabled, width, backgroundColor, isPrimary],
  );

  const content = (
    <>
      {isBusy ? (
        <ActivityIndicator
          size="small"
          color={colors.textWhite}
          style={styles.spinner}
        />
      ) : null}
      <T size={fontSize.subtitle} weight="600" color={colors.textWhite}>
        {buttonText}
      </T>
    </>
  );

  return (
    <View style={styles.buttonView}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        disabled={disabled || isBusy}
        style={[styles.pressable, style]}>
        {isPrimary ? (
          <LinearGradient
            colors={colors.gradientPrimary}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={styles.button}>
            {content}
          </LinearGradient>
        ) : (
          <View style={styles.button}>{content}</View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Button;
