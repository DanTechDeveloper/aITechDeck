import { Pressable, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme/tokens';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  variant?: 'solid' | 'outline';
  action?: 'primary' | 'secondary' | 'negative';
};

export function AppButton({
  title,
  onPress,
  disabled,
  loading,
  loadingLabel,
  variant = 'solid',
  action = 'primary',
}: Props) {
  const bg =
    action === 'negative' ? colors.danger : action === 'secondary' ? colors.textMuted : colors.primary;
  const isOutline = variant === 'outline';
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={loading ? loadingLabel : title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.btn,
        { borderColor: bg },
        (() => {
          if (isDisabled) return styles.disabled;
          if (isOutline) return styles.outline;
          return { backgroundColor: bg };
        })(),
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? bg : colors.textOnPrimary} size="small" />
      ) : (
        <Text style={[styles.text, { color: isOutline ? bg : colors.textOnPrimary }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 96,
    minHeight: 48,
    flexDirection: 'row',
  },
  text: { ...typography.label, fontWeight: '600' },
  outline: { backgroundColor: 'transparent' },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.55, backgroundColor: colors.border, borderColor: colors.border },
});