import React, {useMemo, useRef, useState} from 'react';
import {
  findNodeHandle,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import {Button, Icon, PageLayout, T, TextInput} from '@components';
import colors from '../../theme/colors';
import {fontSize} from '../../constants/typography';
import {useResponsive} from '../../utils/deviceStore/device';
import {useT} from '../../store/useLocaleStore';
import {useAuthStore} from '../../store/useAuthStore';
import {authErrorCode, loginAccount, validatePassword, validateUsername} from '../../api/auth';
import type {RootStackParamList} from '../../navigation/types';

const LoginScreen = () => {
  const t = useT();
  const insets = useSafeAreaInsets();
  const {w1px, h1px, fs1px} = useResponsive();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const setSession = useAuthStore(state => state.setSession);
  const scrollRef = useRef<ScrollView>(null);
  const fields = useRef<Record<string, View | null>>({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{username?: string; password?: string; form?: string}>({});
  const [loading, setLoading] = useState(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        flex: {flex: 1},
        content: {
          flexGrow: 1,
          paddingTop: 28 * h1px,
          paddingBottom: insets.bottom + 28 * h1px,
          justifyContent: 'center',
        },
        brandWrap: {
          alignItems: 'center',
          marginBottom: 22 * h1px,
        },
        sparkle: {
          marginBottom: 6 * h1px,
        },
        brand: {
          letterSpacing: 5 * fs1px,
        },
        tagline: {
          marginTop: 8 * h1px,
          letterSpacing: 1.2 * fs1px,
        },
        card: {
          borderRadius: 24 * fs1px,
          paddingHorizontal: 18 * w1px,
          paddingTop: 22 * h1px,
          paddingBottom: 18 * h1px,
          shadowColor: colors.primaryDark,
          shadowOpacity: 0.12,
          shadowRadius: 12,
          shadowOffset: {width: 0, height: 6},
          elevation: 4,
        },
        title: {
          marginBottom: 16 * h1px,
        },
        formError: {
          marginBottom: 10 * h1px,
        },
        switchWrap: {
          marginTop: 16 * h1px,
          alignItems: 'center',
        },
      }),
    [w1px, h1px, fs1px, insets.bottom],
  );

  const reveal = (key: string) => {
    const field = fields.current[key];
    const scroll = scrollRef.current as ScrollView & {
      scrollResponderScrollNativeHandleToKeyboard?: (
        node: number,
        offset: number,
        preventNegative: boolean,
      ) => void;
    };
    const handle = field ? findNodeHandle(field) : null;
    if (!scroll?.scrollResponderScrollNativeHandleToKeyboard || !handle) {
      return;
    }
    requestAnimationFrame(() => {
      scroll.scrollResponderScrollNativeHandleToKeyboard?.(handle, 80, true);
    });
  };

  const submit = async () => {
    Keyboard.dismiss();
    const usernameCode = validateUsername(username);
    const passwordCode = validatePassword(password);
    const next = {
      username: usernameCode ? t(`auth.${usernameCode}`) : undefined,
      password: passwordCode ? t(`auth.${passwordCode}`) : undefined,
    };
    setErrors(next);
    if (next.username || next.password) {
      return;
    }

    setLoading(true);
    try {
      const session = await loginAccount(username.trim(), password);
      setSession(session.token, session.username);
      navigation.reset({index: 0, routes: [{name: 'Home'}]});
    } catch (error) {
      const code = authErrorCode(error);
      const message = t(`auth.${code}`);
      if (code === 'badCredentials' || code === 'passwordLength') {
        setErrors({password: message});
      } else if (code === 'usernameInvalid') {
        setErrors({username: message});
      } else {
        setErrors({form: message});
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout bottomMenu={false} scroll={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          <View style={styles.brandWrap}>
            <Icon name="sparkles" size="small" color={colors.gold} style={styles.sparkle} />
            <T
              family="serif"
              size={fontSize.brand}
              weight="700"
              color={colors.primaryDark}
              align="center"
              style={styles.brand}>
              {t('home.brand')}
            </T>
            <T
              size={fontSize.caption}
              weight="600"
              color={colors.textMutedDark}
              align="center"
              style={styles.tagline}
              numberOfLines={1}>
              {t('home.tagline')}
            </T>
          </View>

          <LinearGradient
            colors={colors.gradientTile}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.card}>
            <T
              family="serif"
              size={fontSize.titleLarge}
              weight="700"
              color={colors.primaryDark}
              align="center"
              style={styles.title}>
              {t('auth.loginTitle')}
            </T>
            <View
              ref={node => {
                fields.current.username = node;
              }}>
              <TextInput
                label={t('auth.username')}
                value={username}
                onChangeText={setUsername}
                error={errors.username}
                autoCapitalize="none"
                autoComplete="username"
                returnKeyType="next"
                onFocus={() => reveal('username')}
              />
            </View>
            <View
              ref={node => {
                fields.current.password = node;
              }}>
              <TextInput
                label={t('auth.password')}
                value={password}
                onChangeText={setPassword}
                error={errors.password}
                passwordToggle
                secureTextEntry
                maxLength={8}
                autoComplete="password"
                returnKeyType="done"
                onSubmitEditing={submit}
                onFocus={() => reveal('password')}
              />
            </View>
            {errors.form ? (
              <T size={fontSize.caption} color={colors.danger} align="center" style={styles.formError}>
                {errors.form}
              </T>
            ) : null}
            <Button buttonText={t('auth.login')} onPress={submit} loading={loading} />
            <TouchableOpacity
              style={styles.switchWrap}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Register')}>
              <T size={fontSize.label} weight="600" color={colors.primary} align="center">
                {t('auth.needAccount')}
              </T>
            </TouchableOpacity>
          </LinearGradient>
        </ScrollView>
      </KeyboardAvoidingView>
    </PageLayout>
  );
};

export default LoginScreen;
