import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { AppInput } from '../components/ui/AppInput';
import { AppButton } from '../components/ui/AppButton';
import { Card } from '../components/ui/Card';
import { login, register } from '../api/auth';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Mode = 'login' | 'register';

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
};

type Status = { type: 'success' | 'error'; message: string } | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const isRegister = mode === 'register';

  const validate = (): Errors => {
    const e: Errors = {};
    if (isRegister && !name.trim()) e.name = 'Name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!EMAIL_RE.test(email.trim())) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    else if (isRegister && password.length < 8) e.password = 'Password must be at least 8 characters';
    if (isRegister && !passwordConfirm) e.passwordConfirm = 'Re-enter your password';
    else if (isRegister && passwordConfirm !== password) e.passwordConfirm = 'Passwords do not match';
    return e;
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setErrors({});
    setStatus(null);
    if (next === 'register') {
      setPasswordConfirm('');
      setPassword('');
    }
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    setStatus(null);
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    try {
      const res = isRegister
        ? await register({
            name: name.trim(),
            email: email.trim(),
            password,
            password_confirmation: password,
          })
        : await login({ email: email.trim(), password });
      if (isRegister) {
        setStatus({ type: 'success', message: `Account created. Welcome, ${res.user.name}!` });
      }
      navigation.replace('Home');
    } catch (err: any) {
      if (err?.response?.data?.message) {
        setStatus({ type: 'error', message: err.response.data.message });
      } else if (err?.message === 'Network Error' || !err?.response) {
        setStatus({
          type: 'error',
          message: 'Cannot reach the server. Check your connection and try again.',
        });
      } else {
        setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.headline}>aITechDeck</Text>
        <Text style={styles.subtitle}>
          {isRegister ? 'Create an account to start taking quizzes.' : 'Sign in to continue your progress.'}
        </Text>
      </View>

      <Card>
        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, !isRegister && styles.tabActive]}
            onPress={() => switchMode('login')}
            disabled={submitting}
            accessibilityRole="tab"
            accessibilityState={{ selected: !isRegister, disabled: submitting }}
          >
            <Text style={[styles.tabText, !isRegister && styles.tabTextActive]}>Sign in</Text>
          </Pressable>
          <Pressable
            style={[styles.tab, isRegister && styles.tabActive]}
            onPress={() => switchMode('register')}
            disabled={submitting}
            accessibilityRole="tab"
            accessibilityState={{ selected: isRegister, disabled: submitting }}
          >
            <Text style={[styles.tabText, isRegister && styles.tabTextActive]}>Create account</Text>
          </Pressable>
        </View>

        <View style={styles.rule} />

        {isRegister ? (
          <AppInput
            label="Name"
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            autoComplete="name"
            textContentType="name"
            error={errors.name}
          />
        ) : null}

        <AppInput
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          error={errors.email}
        />

        <AppInput
          label="Password"
          placeholder="Minimum 8 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete={isRegister ? 'new-password' : 'password'}
          textContentType={isRegister ? 'newPassword' : 'password'}
          error={errors.password}
        />

        {isRegister ? (
          <AppInput
            label="Confirm password"
            placeholder="Repeat your password"
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            textContentType="newPassword"
            error={errors.passwordConfirm}
          />
        ) : null}

        {status ? (
          <View
            style={[styles.banner, status.type === 'success' ? styles.bannerSuccess : styles.bannerError]}
          >
            <Text
              style={[
                styles.bannerText,
                status.type === 'success' ? styles.bannerTextSuccess : styles.bannerTextError,
              ]}
            >
              {status.message}
            </Text>
          </View>
        ) : null}

        <View style={styles.action}>
          <AppButton
            title={isRegister ? 'Create account' : 'Sign in'}
            loading={submitting}
            loadingLabel={isRegister ? 'Creating account' : 'Signing in'}
            onPress={handleSubmit}
          />
        </View>
      </Card>

      <Pressable
        style={styles.footer}
        onPress={() => switchMode(isRegister ? 'login' : 'register')}
        disabled={submitting}
        accessibilityRole="button"
        accessibilityState={{ disabled: submitting }}
      >
        <Text style={styles.footerText}>
          {isRegister ? 'Already have an account? ' : 'New to aITechDeck? '}
          <Text style={styles.footerLink}>{isRegister ? 'Sign in' : 'Create an account'}</Text>
        </Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.md, alignItems: 'center' },
  headline: { ...typography.headline, color: colors.text },
  subtitle: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
  tabs: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.sm,
    justifyContent: 'center',
  },
  tab: { paddingVertical: spacing.xs, paddingHorizontal: spacing.xs },
  tabText: { ...typography.label, color: colors.textMuted },
  tabTextActive: { color: colors.primary, fontWeight: '700' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  rule: { height: 1, backgroundColor: colors.border, marginBottom: spacing.md },
  banner: {
    borderRadius: radius.sm,
    borderWidth: 1,
    padding: spacing.md - 4,
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },
  bannerSuccess: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  bannerError: { backgroundColor: colors.dangerSoft, borderColor: colors.danger },
  bannerText: { ...typography.caption, color: colors.text },
  bannerTextSuccess: { color: colors.primaryDark },
  bannerTextError: { color: colors.danger },
  action: { marginTop: spacing.sm, alignItems: 'center' },
  footer: {
    marginTop: spacing.lg,
    alignItems: 'center',
    alignSelf: 'center',
  },
  footerText: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
  footerLink: { color: colors.primary, fontWeight: '600' },
});