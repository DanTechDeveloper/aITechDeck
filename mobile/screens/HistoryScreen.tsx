import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { AppButton } from "../components/ui/AppButton";
import { Card } from "../components/ui/Card";
import { getCategories, getStruggles } from "../api/quiz";
import type { Category, Difficulty, Struggle } from "../api/quiz";
import { clearToken } from "../api/client";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { colors, radius, spacing, typography } from "../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "History">;

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

export function HistoryScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [rows, setRows] = useState<Struggle[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      setLoadError(false);
      Promise.all([getCategories(), getStruggles()])
        .then(([list, flagged]) => {
          if (!active) return;
          setCategories(list);
          setRows(flagged);
          setLoading(false);
        })
        .catch((err) => {
          if (!active) return;
          if (err?.response?.status === 401) {
            clearToken();
            navigation.replace("Auth");
            return;
          }
          setLoadError(true);
          setLoading(false);
        });
      return () => {
        active = false;
      };
    }, [attempt, navigation]),
  );

  if (loadError) {
    return (
      <ScreenContainer>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Cannot load your review. Check your connection.</Text>
        </View>
        <View style={styles.action}>
          <AppButton title="Retry" variant="outline" onPress={() => setAttempt((n) => n + 1)} />
        </View>
      </ScreenContainer>
    );
  }

  if (loading) {
    return (
      <ScreenContainer>
        <Text style={styles.body}>Loading your review…</Text>
      </ScreenContainer>
    );
  }

  if (rows.length === 0) {
    return (
      <ScreenContainer>
        <Card>
          <Text style={styles.title}>No mistakes</Text>
          <Text style={styles.body}>
            Nothing is flagged — you've mastered the questions you took. Keep it up!
          </Text>
        </Card>
      </ScreenContainer>
    );
  }

  const scope = category && difficulty;
  const items = scope
    ? rows.filter((r) => r.category === category && r.difficulty === difficulty!.toLowerCase())
    : [];

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.headline}>Review your mistakes</Text>
        <Text style={styles.subtitle}>
          Pick a category and difficulty to review the questions you flagged.
        </Text>
      </View>

      <Text style={styles.sectionLabel}>Category</Text>
      <View style={styles.chips}>
        {categories.map((c) => {
          const active = category === c.name;
          return (
            <Pressable
              key={c.id}
              onPress={() => setCategory(c.name)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              style={[styles.chip, active && styles.chipSelected]}
            >
              <Text style={[styles.chipText, active && styles.chipTextSelected]}>{c.name}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.sectionLabel, styles.sectionSpacing]}>Difficulty</Text>
      <View style={styles.chips}>
        {DIFFICULTIES.map((d) => {
          const active = difficulty === d;
          return (
            <Pressable
              key={d}
              onPress={() => setDifficulty(d)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              style={[styles.chip, active && styles.chipSelected]}
            >
              <Text style={[styles.chipText, active && styles.chipTextSelected]}>{d}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.list}>
        {scope && items.length === 0 ? (
          <Text style={styles.listEmpty}>
            No flagged mistakes in {category} · {difficulty}. Pick another scope.
          </Text>
        ) : (
          items.map((item) => (
            <Card key={item.question_id}>
              <Text style={styles.question}>{item.question}</Text>
              <View style={styles.answerRow}>
                <Text style={styles.answerWrong}>
                  Your answer: {item.options[item.selectedIndex]}
                </Text>
                <Text style={styles.answerCorrect}>
                  Correct: {item.options[item.answerIndex]}
                </Text>
              </View>
            </Card>
          ))
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: "100%",
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.danger,
    backgroundColor: colors.dangerSoft,
    padding: spacing.md - 4,
    marginBottom: spacing.md,
  },
  bannerText: { ...typography.caption, color: colors.danger },
  action: { marginTop: spacing.sm, alignItems: "center" },
  body: { ...typography.body, color: colors.textMuted },
  header: { width: "100%", marginBottom: spacing.lg },
  headline: { ...typography.headline, color: colors.text },
  subtitle: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
  sectionLabel: {
    width: "100%",
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sectionSpacing: { marginTop: spacing.lg },
  chips: { width: "100%", flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
  },
  chipSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  chipText: { ...typography.body, color: colors.textMuted },
  chipTextSelected: { color: colors.primaryDark, fontWeight: "600" },
  title: { ...typography.title, color: colors.text, marginBottom: spacing.sm },
  list: { width: "100%", marginTop: spacing.lg },
  listEmpty: { ...typography.caption, color: colors.textMuted },
  question: { ...typography.body, color: colors.text, fontWeight: "600", marginBottom: spacing.sm },
  answerRow: { gap: spacing.xs },
  answerWrong: { ...typography.body, color: colors.danger },
  answerCorrect: { ...typography.body, color: colors.primaryDark },
});