import { useEffect, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { AppButton } from '../components/ui/AppButton';
import { Card } from '../components/ui/Card';
import { getUser } from '../api/auth';
import { clearToken } from '../api/client';
import { colors, radius, spacing, typography } from '../theme/tokens';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;
type AuthState = 'loading' | 'authenticated' | 'guest';

export function HomeScreen({ navigation }: Props) {
  const [auth, setAuth] = useState<AuthState>('loading');
  const [name, setName] = useState('');
  const [loadError, setLoadError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    setAuth('loading');
    setLoadError(false);
    getUser()
      .then((user) => {
        if (!active) return;
        setName(user.name);
        setAuth('authenticated');
      })
      .catch((err) => {
        if (!active) return;
        if (err?.response?.status === 401) {
          clearToken();
          setAuth('guest');
        } else {
          setLoadError(true);
        }
      });
    return () => {
      active = false;
    };
  }, [retry]);

  const headerSubtitle = () => {
    if (auth === 'loading' && !loadError) return 'Checking your session…';
    if (auth === 'authenticated') return `Hi, ${name}.`;
    if (loadError) return 'Cannot reach the server. Check your connection.';
    return 'Sign in to save your progress.';
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.headline}>aITechDeck</Text>
        <Text style={styles.subtitle}>{headerSubtitle()}</Text>
        {auth === 'guest' && !loadError ? (
          <View style={styles.guestRow}>
            <View style={styles.guestChip}>
              <Text style={styles.guestChipText}>Guest</Text>
            </View>
            <AppButton
              title="Sign in"
              variant="outline"
              onPress={() => navigation.navigate('Auth')}
            />
          </View>
        ) : null}
        {loadError ? (
          <AppButton
            title="Retry"
            variant="outline"
            onPress={() => setRetry((n) => n + 1)}
          />
        ) : null}
      </View>

      <Card>
        <Text style={styles.cardTitle}>Take a quiz</Text>
        <Text style={styles.cardBody}>
          Pick an IT topic and answer AI-generated questions, then review what you got right and
          wrong.
        </Text>
        <View style={styles.action}>
          <AppButton
            title="Start a quiz"
            onPress={() => navigation.navigate('NewReview', { topic: 'Computer Networks' })}
          />
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Recent activity</Text>
        <Text style={styles.cardBody}>
          No quizzes yet. Your completed quizzes and topic reviews will show up here.
        </Text>
        <View style={styles.action}>
          <AppButton
            title="View history"
            variant="outline"
            onPress={() =>
              navigation.navigate('History', {
                title: 'My quizzes',
                body: 'Completed quizzes and topic reviews will appear here once saved to the backend.',
              })
            }
          />
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>How it works</Text>
        <Text style={styles.cardBody}>
          Answer a short quiz, get a score, and the AI explains the topics you missed with next
          steps.
        </Text>
        <View style={styles.action}>
          <AppButton
            title="Read the guide"
            variant="outline"
            onPress={() =>
              navigation.navigate('HowItWorks', {
                title: 'How it works',
                body: 'Answer AI questions, get a score, and review the topics you missed. Guide coming soon.',
              })
            }
          />
        </View>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.lg, alignItems: 'center' },
  headline: { ...typography.headline, color: colors.text },
  subtitle: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
  guestRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.sm },
  guestChip: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  guestChipText: { ...typography.label, color: colors.primaryDark },
  cardTitle: { ...typography.title, color: colors.text, marginBottom: spacing.sm },
  cardBody: { ...typography.body, color: colors.textMuted },
  action: { marginTop: spacing.lg, alignItems: 'center' },
});