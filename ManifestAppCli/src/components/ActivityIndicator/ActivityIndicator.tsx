import React from 'react';
import {
  ActivityIndicator as NativeActivityIndicator,
  type ColorValue,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import colors from '../../theme/colors';

type Props = {
  size?: 'small' | 'large';
  color?: ColorValue;
  style?: StyleProp<ViewStyle>;
};

const ActivityIndicator: React.FC<Props> = ({
  size = 'small',
  color = colors.primary,
  style,
}) => {
  return <NativeActivityIndicator size={size} color={color} style={style} />;
};

export default ActivityIndicator;
