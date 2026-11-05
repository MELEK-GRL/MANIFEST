import React, {useMemo} from 'react';
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
import colors from '../../theme/colors';
import {useTypography} from '../../theme/useTypography';
import {fontSize} from '../../constants/typography';

type Props = TextInputProps & {
  value: string;
  onChangeText: (text: string) => void;
  containerStyle?: ViewStyle;
};

const Search: React.FC<Props> = ({
  value,
  onChangeText,
  placeholder,
  containerStyle,
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

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          marginBottom: 12 * h1px,
        },
        inputWrap: {
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: colors.borderSoft,
          borderRadius: 12 * w1px,
          backgroundColor: colors.backgroundSoft,
          paddingLeft: 12 * w1px,
        },
        input: {
          flex: 1,
          paddingVertical: 10 * h1px,
          paddingHorizontal: 8 * w1px,
          fontSize: fontSize.body * scale,
          color: colors.textDark,
        },
        clear: {
          paddingHorizontal: 12 * w1px,
          paddingVertical: 10 * h1px,
        },
      }),
    [w1px, h1px, scale],
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.inputWrap}>
        <Icon
          name="search-outline"
          size="medium"
          color={colors.textMuted}
        />
        <RNTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder ?? t('common.search')}
          placeholderTextColor={colors.textLight}
          style={[styles.input, style]}
          editable={editable}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          spellCheck={spellCheck}
          returnKeyType="search"
          {...props}
        />
        {value.length > 0 ? (
          <TouchableOpacity
            style={styles.clear}
            onPress={() => onChangeText('')}
            activeOpacity={0.7}
            accessibilityLabel={t('common.clearSearch')}>
            <Icon name="close-circle" size="medium" color={colors.textLight} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default Search;
