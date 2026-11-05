import React from 'react';
import {ColorValue, StyleProp, TextStyle} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {iconSize, type IconSizeKey} from '../../constants/icons';
import colors from '../../theme/colors';
import {useResponsive} from '../../utils/deviceStore/device';

type Props = {
  name: string;
  size?: number | IconSizeKey;
  color?: ColorValue;
  style?: StyleProp<TextStyle>;
};

const Icon: React.FC<Props> = ({
  name,
  size = 'medium',
  color = colors.textDark,
  style,
}) => {
  const {fs1px} = useResponsive();
  const baseSize = typeof size === 'number' ? size : iconSize[size];

  return (
    <Ionicons
      name={name}
      size={baseSize * fs1px}
      color={color}
      style={style}
    />
  );
};

export default Icon;
