import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {useResponsive} from '../../utils/deviceStore/device';
import T from '../Text/T';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';

type Props = {
  title: string;
};

const PAGE_HEADER_TOP = 20;
const PAGE_HEADER_BOTTOM = 12;

const PageHeader: React.FC<Props> = ({title}) => {
  const {h1px} = useResponsive();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          paddingTop: PAGE_HEADER_TOP * h1px,
          paddingBottom: PAGE_HEADER_BOTTOM * h1px,
          paddingHorizontal: 0,
        },
      }),
    [h1px],
  );

  return (
    <View style={styles.wrap}>
      <T size={fontSize.title} weight="700" color={colors.textDark}>
        {title}
      </T>
    </View>
  );
};

export default PageHeader;
