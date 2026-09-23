import { useState } from 'react';
import { Text, TextInput, StyleSheet, View, Platform } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme/tokens';

type Props = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 'name' | 'email' | 'password' | 'new-password';
  error?: string;
  returnKeyType?: 'next' | 'done';
  onSubmitEditing?: () => void;
  textContentType?: 'name' | 'emailAddress' | 'password' | 'newPassword';
};

export function AppInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoComplete,
  textContentType,
  error,
  returnKeyType,
  onSubmitEditing,
}: Props) {
  const [focused, setFocused] = useState(false);
  const boxStyle = [
    styles.box,
    focused && styles.boxFocused,
    !!error && styles.boxError,
    !!error && focused && styles.boxError,
  ];

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={boxStyle}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        textContentType={Platform.OS === 'ios' ? textContentType : undefined}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel={label}
        accessibilityState={{ disabled: false }}
        aria-invalid={!!error}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', marginBottom: spacing.sm + spacing.xs },
  label: { ...typography.label, color: colors.text, marginBottom: spacing.xs + 2 },
  box: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + spacing.xs,
    backgroundColor: colors.surface,
    ...typography.input,
    color: colors.text,
  },
  boxFocused: { borderColor: colors.focusRing },
  boxError: { borderColor: colors.danger, backgroundColor: colors.dangerSoft },
  error: { ...typography.caption, color: colors.danger, marginTop: spacing.xs + 2 },
});