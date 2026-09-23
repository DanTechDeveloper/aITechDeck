import { Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { Card } from '../components/ui/Card';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { colors, spacing, typography } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'History' | 'HowItWorks'>;

export function PlaceholderScreen({ route }: Props) {
  return (
    <ScreenContainer>
      <Card>
        <Text style={styles.title}>{route.params.title}</Text>
        <Text style={styles.body}>{route.params.body}</Text>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: colors.text, marginBottom: spacing.sm },
  body: { ...typography.body, color: colors.textMuted },
});