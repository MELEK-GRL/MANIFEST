import React, {useMemo} from 'react';
import {StyleSheet, TouchableOpacity, View, Modal} from 'react-native';
import {useT} from '../../store/useLocaleStore';
import Icon from '../Icons/Icon';
import {useResponsive} from '../../utils/deviceStore/device';
import T from '../Text/T';
import Button from '../Buttons/Button';
import {fontSize} from '../../constants/typography';
import colors from '../../theme/colors';

export type PopupType = 'info' | 'warning' | 'error' | 'danger' | 'success';

type Props = {
  visible: boolean;
  title?: string;
  message?: string;
  type?: PopupType;
  leftButtonText?: string;
  rightButtonText?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  onClose?: () => void;
};

const TYPE_CONFIG: Record<
  PopupType,
  {
    accent: string;
    soft: string;
    titleKey: 'common.ok' | 'common.error' | 'common.warning' | 'common.info' | 'common.danger';
    icon: string;
  }
> = {
  success: {
    accent: colors.success,
    soft: colors.successSoft,
    titleKey: 'common.ok',
    icon: 'checkmark-circle-outline',
  },
  error: {
    accent: colors.danger,
    soft: colors.dangerSoft,
    titleKey: 'common.error',
    icon: 'close-circle-outline',
  },
  danger: {
    accent: colors.danger,
    soft: colors.dangerSoft,
    titleKey: 'common.danger',
    icon: 'alert-circle-outline',
  },
  warning: {
    accent: colors.warning,
    soft: colors.warningSoft,
    titleKey: 'common.warning',
    icon: 'warning-outline',
  },
  info: {
    accent: colors.info,
    soft: colors.infoSoft,
    titleKey: 'common.info',
    icon: 'information-circle-outline',
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
  onClose,
}) => {
  const t = useT();
  const {w1px, h1px, fs1px} = useResponsive();
  const config = TYPE_CONFIG[type];
  const displayTitle = title ?? t(config.titleKey);
  const showButtons = Boolean(leftButtonText || rightButtonText);
  const confirmColor =
    type === 'danger' || type === 'error' ? colors.danger : colors.primary;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: colors.overlay,
          justifyContent: 'center',
          alignItems: 'center',
        },
        box: {
          width: 320 * w1px,
          maxWidth: '90%',
          backgroundColor: colors.white,
          borderRadius: 22 * fs1px,
          paddingTop: 22 * h1px,
          paddingBottom: 20 * h1px,
          paddingHorizontal: 20 * w1px,
          alignItems: 'center',
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.14,
          shadowRadius: 16,
          shadowOffset: {width: 0, height: 6},
          elevation: 6,
        },
        close: {
          position: 'absolute',
          top: 12 * h1px,
          right: 12 * w1px,
          width: 32 * w1px,
          height: 32 * w1px,
          alignItems: 'center',
          justifyContent: 'center',
        },
        iconWrap: {
          width: 64 * w1px,
          height: 64 * w1px,
          borderRadius: 32 * w1px,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 8 * h1px,
          marginBottom: 14 * h1px,
        },
        title: {
          marginBottom: 8 * h1px,
        },
        message: {
          lineHeight: 22 * h1px,
        },
        buttonRow: {
          flexDirection: 'row',
          width: '100%',
          marginTop: 20 * h1px,
        },
        buttonHalf: {
          flex: 1,
        },
        buttonGap: {
          marginRight: 10 * w1px,
        },
      }),
    [w1px, h1px, fs1px],
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      hardwareAccelerated
      presentationStyle="overFullScreen"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <TouchableOpacity
            style={styles.close}
            onPress={onClose}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={t('common.cancel')}>
            <Icon name="close-outline" size="medium" color={colors.textMuted} />
          </TouchableOpacity>
          <View style={[styles.iconWrap, {backgroundColor: config.soft}]}>
            <Icon name={config.icon} size="xl" color={config.accent} />
          </View>
          <T
            size={fontSize.title}
            weight="700"
            align="center"
            color={colors.textDark}
            style={styles.title}>
            {displayTitle}
          </T>
          <T
            size={fontSize.body}
            color={colors.textMuted}
            align="center"
            style={styles.message}>
            {message}
          </T>
          {showButtons ? (
            <View style={styles.buttonRow}>
              {leftButtonText ? (
                <View style={[styles.buttonHalf, rightButtonText ? styles.buttonGap : null]}>
                  <Button
                    buttonText={leftButtonText}
                    onPress={onLeftPress}
                    width="100%"
                    backgroundColor={colors.buttonMuted}
                  />
                </View>
              ) : null}
              {rightButtonText ? (
                <View style={styles.buttonHalf}>
                  <Button
                    buttonText={rightButtonText}
                    onPress={onRightPress}
                    width="100%"
                    backgroundColor={confirmColor}
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
