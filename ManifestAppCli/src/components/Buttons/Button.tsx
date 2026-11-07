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
import Icon from '../Icons/Icon';
import T from '../Text/T';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'muted';
export type ButtonSize = 'default' | 'compact';

type Props = {
  buttonText: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  activityIndicatorLoading?: boolean;
  style?: ViewStyle;
  width?: DimensionValue;
  /** @deprecated Prefer `variant`. Kept for existing callers. */
  backgroundColor?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
};

const resolveVariant = (
  variant: ButtonVariant | undefined,
  backgroundColor: string | undefined,
): ButtonVariant => {
  if (variant) {
    return variant;
  }
  switch (backgroundColor) {
    case colors.danger:
    case colors.dangerText:
      return 'danger';
    case colors.buttonMuted:
      return 'muted';
    case colors.blush:
    case colors.peach:
    case colors.cream:
    case colors.primarySoft:
      return 'secondary';
    case colors.primary:
    case colors.primaryDark:
    default:
      return 'primary';
  }
};

const variantChrome = (variant: ButtonVariant) => {
  switch (variant) {
    case 'danger':
      return {borderWidth: 1.5, shadowOpacity: 0.16};
    case 'secondary':
      return {borderWidth: 0, shadowOpacity: 0.14};
    case 'muted':
      return {borderWidth: 1.5, shadowOpacity: 0.14};
    case 'primary':
    default:
      return {borderWidth: 0, shadowOpacity: 0.22};
  }
};

const Button: React.FC<Props> = ({
  buttonText,
  onPress,
  disabled = false,
  loading = false,
  activityIndicatorLoading = false,
  style,
  width = '100%',
  backgroundColor,
  variant,
  size = 'default',
  icon,
}) => {
  const {w1px, h1px} = useResponsive();
  const isBusy = loading || activityIndicatorLoading;
  const isCompact = size === 'compact';
  const resolved = resolveVariant(variant, backgroundColor);
  const theme = colors.buttonThemes[resolved];
  const chrome = variantChrome(resolved);
  const textSize = isCompact ? fontSize.label : fontSize.subtitle;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        buttonView: {
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: width === '100%' ? 'stretch' : 'center',
          width,
          minWidth: 0,
        },
        pressable: {
          width: '100%',
          borderRadius: 999,
          shadowColor: theme.shadow,
          shadowOpacity: chrome.shadowOpacity,
          shadowRadius: isCompact ? 8 : 10,
          shadowOffset: {width: 0, height: isCompact ? 3 : 4},
          elevation: isCompact ? 3 : 4,
        },
        button: {
          borderRadius: 999,
          paddingVertical: (isCompact ? 10 : 12) * h1px,
          paddingHorizontal: (isCompact ? 10 : 18) * w1px,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
          flexDirection: 'row',
          gap: (isCompact ? 4 : 8) * w1px,
          width: '100%',
          minWidth: 0,
          borderWidth: chrome.borderWidth,
          borderColor: theme.border,
          overflow: 'hidden',
        },
        label: {
          flexShrink: 1,
        },
        spinner: {
          marginRight: 2 * w1px,
        },
      }),
    [w1px, h1px, disabled, width, theme, chrome, isCompact],
  );

  return (
    <View style={styles.buttonView}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.86}
        disabled={disabled || isBusy}
        style={[styles.pressable, style]}
        accessibilityRole="button"
        accessibilityLabel={buttonText}
        accessibilityState={{disabled: disabled || isBusy}}>
        <LinearGradient
          colors={[theme.gradient[0], theme.gradient[1]]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.button}>
          {isBusy ? (
            <ActivityIndicator
              size="small"
              color={theme.text}
              style={styles.spinner}
            />
          ) : icon ? (
            <Icon name={icon} size="small" color={theme.text} />
          ) : null}
          <T
            size={textSize}
            weight="700"
            color={theme.text}
            numberOfLines={1}
            style={styles.label}>
            {buttonText}
          </T>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default Button;
