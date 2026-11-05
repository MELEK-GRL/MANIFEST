import React, {useMemo, useState} from 'react';
import {
  TextInput as RNTextInput,
  View,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import {useT} from '../../store/useLocaleStore';
import Icon from '../Icons/Icon';
import {useResponsive} from '../../utils/deviceStore/device';
import T from '../Text/T';
import colors from '../../theme/colors';
import {useTypography} from '../../theme/useTypography';
import {fontSize} from '../../constants/typography';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  passwordToggle?: boolean;
};

const TextInput: React.FC<Props> = ({
  label,
  error,
  containerStyle,
  passwordToggle = false,
  secureTextEntry,
  editable = true,
  autoCapitalize = 'none',
  autoCorrect = false,
  spellCheck = false,
  style,
  ...props
}) => {
  const t = useT();
  const {w1px, h1px} = useResponsive();
  const {scale} = useTypography();
  const [visible, setVisible] = useState(false);
  const isPassword = secureTextEntry === true || passwordToggle;
  const showPassword = passwordToggle ? visible : !secureTextEntry;
  const isSoft = editable === false;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          marginBottom: 12 * h1px,
        },
        label: {
          marginBottom: 6 * h1px,
        },
        inputWrap: {
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: error ? '#ef4444' : colors.inputBorder,
          borderRadius: 8 * w1px,
          backgroundColor: isSoft ? '#F9FAFB' : '#fff',
        },
        input: {
          flex: 1,
          paddingVertical: 10 * h1px,
          paddingHorizontal: 12 * w1px,
          fontSize: fontSize.body * scale,
          color: isSoft ? '#9CA3AF' : '#111827',
          paddingRight: passwordToggle ? 44 * w1px : 12 * w1px,
        },
        eyeTouch: {
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          paddingHorizontal: 12 * w1px,
          justifyContent: 'center',
        },
        errorText: {
          marginTop: 4 * h1px,
        },
      }),
    [w1px, h1px, error, passwordToggle, scale, isSoft],
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <T
          size={fontSize.subtitle}
          weight="400"
          color={colors.textGraySoft}
          style={styles.label}>
          {label}
        </T>
      ) : null}

      <View style={styles.inputWrap}>
        <RNTextInput
          placeholderTextColor={colors.buttonGray}
          style={[styles.input, style]}
          {...props}
          editable={editable}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          spellCheck={spellCheck}
          secureTextEntry={isPassword ? !showPassword : secureTextEntry}
        />
        {passwordToggle ? (
          <TouchableOpacity
            style={styles.eyeTouch}
            onPress={() => setVisible(value => !value)}
            activeOpacity={0.7}
            accessibilityLabel={
              showPassword ? t('common.hidePassword') : t('common.showPassword')
            }>
            <Icon
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size="medium"
              color={colors.textGraySoft}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? (
        <T size={fontSize.subtitle} color="#ef4444" style={styles.errorText}>
          {error}
        </T>
      ) : null}
    </View>
  );
};

export default TextInput;
