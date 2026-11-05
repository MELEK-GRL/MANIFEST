import React, {useMemo} from 'react';
import {Text, TextStyle, StyleSheet, TextProps} from 'react-native';
import {fontSize} from '../../constants/typography';
import {useTypography} from '../../theme/useTypography';
import type {FontFamilyVariant, FontWeightToken} from '../../theme/typography';
import colors from '../../theme/colors';

type Props = TextProps & {
  children: React.ReactNode;
  size?: number;
  weight?: FontWeightToken;
  family?: FontFamilyVariant;
  italic?: boolean;
  color?: string;
  align?: 'left' | 'center' | 'right';
  style?: TextStyle;
};

const T: React.FC<Props> = ({
  children,
  size = fontSize.body,
  weight = '600',
  family = 'sans',
  italic = false,
  color = colors.textDark,
  align = 'left',
  style,
  ...rest
}) => {
  const {resolveFontFamily, scale} = useTypography();
  const resolvedFamily = resolveFontFamily(family, weight, italic);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        text: {
          fontSize: size * scale,
          // Weight baked into font file for non-italic; italic may use light weight boost.
          fontWeight: italic ? weight : '400',
          fontStyle: 'normal',
          color,
          textAlign: align,
          fontFamily: resolvedFamily,
        },
      }),
    [size, color, align, resolvedFamily, scale, italic, weight],
  );

  return (
    <Text style={[styles.text, style]} {...rest}>
      {children}
    </Text>
  );
};

export default T;
