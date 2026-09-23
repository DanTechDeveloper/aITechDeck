import { View, StyleSheet } from 'react-native';
import type { ReactNode } from 'react';
import { colors, radius, spacing } from '../../theme/tokens';

export function Card({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
  },
});