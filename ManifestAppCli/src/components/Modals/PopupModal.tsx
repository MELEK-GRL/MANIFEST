import React, {useMemo} from 'react';
import {View, StyleSheet, Modal} from 'react-native';
import {useT} from '../../store/useLocaleStore';
import Icon from '../Icons/Icon';
import {useResponsive} from '../../utils/deviceStore/device';
import T from '../Text/T';
import Button from '../Buttons/Button';
import {fontSize} from '../../constants/typography';

export type PopupType = 'info' | 'warning' | 'error' | 'success';

type Props = {
  visible: boolean;
  title?: string;
  message?: string;
  type?: PopupType;
  leftButtonText?: string;
  rightButtonText?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
};

const TYPE_CONFIG: Record<
  PopupType,
  {accent: string; titleKey: 'common.ok' | 'common.error' | 'common.warning' | 'common.info'; icon: string}
> = {
  success: {accent: '#22C55E', titleKey: 'common.ok', icon: 'checkmark-circle'},
  error: {accent: '#EF4444', titleKey: 'common.error', icon: 'close-circle'},
  warning: {accent: '#EAB308', titleKey: 'common.warning', icon: 'warning'},
  info: {
    accent: '#3B82F6',
    titleKey: 'common.info',
    icon: 'information-circle',
  },
};

const PopupModal: React.FC<Props> = ({
  visible,
  title,
  message = '',
  type = 'info',
  leftButtonText,
  rightButtonText,
  onLeftPress,
  onRightPress,
}) => {
  const t = useT();
  const {w1px, h1px} = useResponsive();
  const config = TYPE_CONFIG[type];
  const displayTitle = title ?? t(config.titleKey);
  const locked = !leftButtonText && !rightButtonText;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: 'rgba(17, 24, 39, 0.45)',
          justifyContent: 'center',
          alignItems: 'center',
        },
        box: {
          width: 320 * w1px,
          maxWidth: '90%',
          backgroundColor: '#fff',
          borderRadius: 12 * w1px,
          paddingVertical: 24 * h1px,
          paddingHorizontal: 20 * w1px,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 6,
        },
        iconWrap: {
          marginBottom: 16 * h1px,
        },
        title: {
          marginBottom: 10 * h1px,
        },
        message: {
          lineHeight: 22,
        },
        buttonRow: {
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          marginTop: 20 * h1px,
          paddingHorizontal: 4,
        },
        buttonHalf: {
          flex: 1,
          marginHorizontal: 6 * w1px,
        },
      }),
    [w1px, h1px],
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      hardwareAccelerated
      presentationStyle="overFullScreen"
      onRequestClose={() => {
        if (locked) {
          return;
        }
        if (onLeftPress) {
          onLeftPress();
        } else if (onRightPress) {
          onRightPress();
        }
      }}>
      <View style={styles.overlay} pointerEvents="auto">
        <View style={styles.box}>
          <View style={styles.iconWrap}>
            <Icon name={config.icon} size="xxl" color={config.accent} />
          </View>
          <T
            size={fontSize.title}
            weight="700"
            align="center"
            color="#111827"
            style={styles.title}>
            {displayTitle}
          </T>

          <T
            size={fontSize.bodyMedium}
            color="#4B5563"
            align="center"
            style={styles.message}>
            {message}
          </T>

          {leftButtonText || rightButtonText ? (
            <View style={styles.buttonRow}>
              {leftButtonText ? (
                <View style={styles.buttonHalf}>
                  <Button
                    buttonText={leftButtonText}
                    onPress={onLeftPress}
                    width="100%"
                    backgroundColor="#94A3B8"
                  />
                </View>
              ) : null}
              {rightButtonText ? (
                <View style={styles.buttonHalf}>
                  <Button
                    buttonText={rightButtonText}
                    onPress={onRightPress}
                    width="100%"
                  />
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

export default PopupModal;
