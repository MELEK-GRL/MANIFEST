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
import {
  authErrorCode,
  registerAccount,
  validateEmail,
  validatePassword,
  validateUsername,
} from '../../api/auth';
import type {RootStackParamList} from '../../navigation/types';

const RegisterScreen = () => {
  const t = useT();
  const insets = useSafeAreaInsets();
  const {w1px, h1px, fs1px} = useResponsive();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const setSession = useAuthStore(state => state.setSession);
  const scrollRef = useRef<ScrollView>(null);
  const fields = useRef<Record<string, View | null>>({});
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    passwordAgain?: string;
    form?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        flex: {flex: 1},
        content: {
          flexGrow: 1,
          paddingTop: 20 * h1px,
          paddingBottom: insets.bottom + 24 * h1px,
        },
        brandWrap: {
          alignItems: 'center',
          marginBottom: 18 * h1px,
        },
        sparkle: {
          marginBottom: 6 * h1px,
        },
        brand: {
          letterSpacing: 5 * fs1px,
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
    [w1px, h1px, fs1px, insets.top, insets.bottom],
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
    const emailCode = validateEmail(email);
    const passwordCode = validatePassword(password);
    const againCode = password !== passwordAgain ? 'passwordMismatch' : null;
    const next = {
      username: usernameCode ? t(`auth.${usernameCode}`) : undefined,
      email: emailCode ? t(`auth.${emailCode}`) : undefined,
      password: passwordCode ? t(`auth.${passwordCode}`) : undefined,
      passwordAgain: againCode ? t(`auth.${againCode}`) : undefined,
    };
    setErrors(next);
    if (next.username || next.email || next.password || next.passwordAgain) {
      return;
    }

    setLoading(true);
    try {
      const session = await registerAccount(username.trim(), email.trim(), password);
      setSession(session.token, session.username);
      navigation.reset({index: 0, routes: [{name: 'Home'}]});
    } catch (error) {
      const code = authErrorCode(error);
      const message = t(`auth.${code}`);
      if (code === 'usernameTaken' || code === 'usernameInvalid') {
        setErrors({username: message});
      } else if (code === 'emailTaken' || code === 'emailInvalid') {
        setErrors({email: message});
      } else if (code === 'passwordLength') {
        setErrors({password: message});
      } else {
        setErrors({form: message});
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout bottomMenu={false} scroll={false} paddingHorizontal={22}>
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
              {t('auth.registerTitle')}
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
                maxLength={32}
                onFocus={() => reveal('username')}
              />
            </View>
            <View
              ref={node => {
                fields.current.email = node;
              }}>
              <TextInput
                label={t('auth.email')}
                value={email}
                onChangeText={setEmail}
                error={errors.email}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                maxLength={128}
                onFocus={() => reveal('email')}
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
                autoComplete="password-new"
                onFocus={() => reveal('password')}
              />
            </View>
            <View
              ref={node => {
                fields.current.passwordAgain = node;
              }}>
              <TextInput
                label={t('auth.passwordAgain')}
                value={passwordAgain}
                onChangeText={setPasswordAgain}
                error={errors.passwordAgain}
                passwordToggle
                secureTextEntry
                maxLength={8}
                autoComplete="password-new"
                returnKeyType="done"
                onSubmitEditing={submit}
                onFocus={() => reveal('passwordAgain')}
              />
            </View>
            {errors.form ? (
              <T size={fontSize.caption} color={colors.danger} align="center" style={styles.formError}>
                {errors.form}
              </T>
            ) : null}
            <Button buttonText={t('auth.register')} onPress={submit} loading={loading} />
            <TouchableOpacity
              style={styles.switchWrap}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Login')}>
              <T size={fontSize.label} weight="600" color={colors.primary} align="center">
                {t('auth.haveAccount')}
              </T>
            </TouchableOpacity>
          </LinearGradient>
        </ScrollView>
      </KeyboardAvoidingView>
    </PageLayout>
  );
};

export default RegisterScreen;
