import React, {useMemo} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {useResponsive} from '../../utils/deviceStore/device';
import {fontSize} from '../../constants/typography';
import colors from '../../theme/colors';
import Icon from '../Icons/Icon';
import T from '../Text/T';

type Props = {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
};

const EmptyState: React.FC<Props> = ({title, subtitle, style}) => {
  const {w1px, h1px} = useResponsive();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 40 * h1px,
          paddingHorizontal: 20 * w1px,
        },
        iconWrap: {
          width: 88 * w1px,
          height: 88 * w1px,
          borderRadius: 44 * w1px,
          backgroundColor: colors.backgroundPurpleSoft,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16 * h1px,
          borderWidth: 1,
          borderColor: 'rgba(116, 83, 224, 0.15)',
        },
        title: {
          width: '100%',
          marginBottom: subtitle ? 8 * h1px : 0,
        },
        subtitle: {
          width: '100%',
        },
      }),
    [w1px, h1px, subtitle],
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconWrap}>
        <Icon
          name="document-text-outline"
          size="xxl"
          color={colors.backgroundPurple}
        />
      </View>
      <T
        size={fontSize.subtitle}
        weight="400"
        color="#6B7280"
        align="center"
        style={styles.title}>
        {title}
      </T>
      {subtitle ? (
        <T
          size={fontSize.body}
          weight="400"
          color="#9CA3AF"
          align="center"
          style={styles.subtitle}>
          {subtitle}
        </T>
      ) : null}
    </View>
  );
};

export default EmptyState;
