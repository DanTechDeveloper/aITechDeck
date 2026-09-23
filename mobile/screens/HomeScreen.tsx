import { useEffect, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { AppButton } from '../components/ui/AppButton';
import { Card } from '../components/ui/Card';
import { getUser } from '../api/auth';
import { colors, radius, spacing, typography } from '../theme/tokens';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    getUser()
      .then((user) => setName(user.name))
      .catch(() => setName(null));
  }, []);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.headline}>aITechDeck</Text>
        <Text style={styles.subtitle}>
          {name ? `Hi, ${name}.` : 'Quizzes and reviews for IT courses.'}
        </Text>
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
  cardTitle: { ...typography.title, color: colors.text, marginBottom: spacing.sm },
  cardBody: { ...typography.body, color: colors.textMuted },
  action: { marginTop: spacing.lg, alignItems: 'center' },
});