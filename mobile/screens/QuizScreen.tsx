import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { AppButton } from "../components/ui/AppButton";
import { Card } from "../components/ui/Card";
import { colors, radius, spacing, typography } from "../theme/tokens";
import { getCategories, getQuiz } from "../api/quiz";
import type { Category, Difficulty, QuizQuestion } from "../api/quiz";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "NewReview">;

type Stage =
  | { name: "setup" }
  | { name: "question"; index: number }
  | { name: "result" };

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

export function QuizScreen({ navigation, route }: Props) {
  const [stage, setStage] = useState<Stage>({ name: "setup" });
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    getCategories()
      .then((list) => {
        setCategories(list);
        if (list.some((c) => c.name === route.params.topic)) {
          setCategory(route.params.topic);
        }
      })
      .catch(() => setCategoriesError("Cannot load categories. Check your connection."));
  }, [route.params.topic]);

  const index = stage.name === "question" ? stage.index : 0;
  const question = stage.name === "question" ? questions[index] : null;
  const total = questions.length;
  const isLast = index === total - 1;

  const select = (optionIndex: number) => setSelected(optionIndex);

  const start = async () => {
    if (!category || !difficulty) return;
    setLoading(true);
  setLoadError(null);
    try {
      setQuestions(await getQuiz(category, difficulty));
      setStage({ name: "question", index: 0 });
    } catch {
      setLoadError("Could not load this quiz. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    setAnswers((prev) => [...prev, selected!]);
    setSelected(null);
    setStage(isLast ? { name: "result" } : { name: "question", index: index + 1 });
  };

  const retake = () => {
    setAnswers([]);
    setSelected(null);
    setStage({ name: "question", index: 0 });
  };

  if (stage.name === "setup") {
    const ready = category !== null && difficulty !== null;
    return (
      <ScreenContainer>
        <View style={styles.header}>
          <Text style={styles.headline}>Set up your quiz</Text>
          <Text style={styles.subtitle}>Choose a category and difficulty to continue.</Text>
        </View>

        {categoriesError ? (
          <View style={[styles.banner, styles.bannerError]}>
            <Text style={[styles.bannerText, styles.bannerTextError]}>{categoriesError}</Text>
            <View style={styles.action}>
              <AppButton
                title="Try again"
                variant="outline"
                onPress={() => {
                  setCategoriesError(null);
                  getCategories()
                    .then((list) => {
                      setCategories(list);
                      if (list.some((c) => c.name === route.params.topic)) {
                        setCategory(route.params.topic);
                      }
                    })
                    .catch(() => setCategoriesError("Cannot load categories. Check your connection."));
                }}
              />
            </View>
          </View>
        ) : (
          <>
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
                    <Text style={[styles.chipText, active && styles.chipTextSelected]}>
                      {c.name}
                    </Text>
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
          </>
        )}

        {loadError ? (
          <View style={[styles.banner, styles.bannerError]}>
            <Text style={[styles.bannerText, styles.bannerTextError]}>{loadError}</Text>
          </View>
        ) : null}

        <View style={styles.footer}>
          <AppButton title="Continue" disabled={!ready || loading} loading={loading} onPress={start} />
        </View>
      </ScreenContainer>
    );
  }

  if (stage.name === "result") {
    const correct = questions.reduce(
      (acc, q, i) => acc + (answers[i] === q.answerIndex ? 1 : 0),
      0,
    );

    return (
      <ScreenContainer>
        <View style={styles.resultCard}>
          <Text style={styles.resultHeadline}>
            You got {correct} of {total} correct
          </Text>
          <Text style={styles.resultSubtitle}>
            {category} · {difficulty} — review each item below and retake when ready.
          </Text>
        </View>

        {questions.map((q, i) => {
          const ok = answers[i] === q.answerIndex;
          return (
            <Card key={i}>
              <Text style={styles.cardTitle}>
                #{i + 1} {ok ? "Correct" : "Missed"}
              </Text>
              <Text style={styles.cardBody}>{q.question}</Text>
              {!ok ? (
                <Text style={styles.correctText}>
                  Correct answer: {q.options[q.answerIndex]}
                </Text>
              ) : null}
            </Card>
          );
        })}

        <View style={styles.footer}>
          <AppButton title="Retake quiz" variant="outline" onPress={retake} />
          <View style={styles.footerGap} />
          <AppButton title="Back to home" onPress={() => navigation.popToTop()} />
        </View>
      </ScreenContainer>
    );
  }

  if (!question) {
    return (
      <ScreenContainer>
        <View style={[styles.banner, styles.bannerError]}>
          <Text style={[styles.bannerText, styles.bannerTextError]}>
            No questions here. Go back and start again.
          </Text>
        </View>
        <View style={styles.footer}>
          <AppButton title="Back to home" onPress={() => navigation.popToTop()} />
        </View>
      </ScreenContainer>
    );
  }

  const progress = (index / total) * 100;

  return (
    <ScreenContainer>
      <View style={styles.progressRow}>
        <Text style={styles.progressLabel}>
          {category} · {difficulty} · Question {index + 1} of {total}
        </Text>
        <Pressable
          onPress={() => {
            setAnswers([]);
            setSelected(null);
            setStage({ name: "setup" });
          }}
          accessibilityRole="button"
          style={styles.changeLink}
        >
          <Text style={styles.changeLinkText}>Change config</Text>
        </Pressable>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <Card>
        <Text style={styles.questionText}>{question.question}</Text>
      </Card>

      <View style={styles.options}>
        {question.options.map((option, oi) => {
          const isSelected = selected === oi;
          return (
            <Pressable
              key={oi}
              onPress={() => select(oi)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              style={[styles.option, isSelected && styles.optionSelected]}
            >
              <View style={[styles.optionDot, isSelected && styles.optionDotSelected]} />
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <AppButton title={isLast ? "Submit" : "Next"} disabled={selected === null} onPress={next} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
  banner: {
    width: "100%",
    borderRadius: radius.sm,
    borderWidth: 1,
    padding: spacing.md - 4,
    marginBottom: spacing.md,
  },
  bannerError: { backgroundColor: colors.dangerSoft, borderColor: colors.danger },
  bannerText: { ...typography.caption, color: colors.text },
  bannerTextError: { color: colors.danger },
  action: { marginTop: spacing.sm, alignItems: "center" },
  progressRow: {
    width: "100%",
    marginBottom: spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: { ...typography.label, color: colors.textMuted },
  changeLink: { paddingVertical: spacing.xs, paddingHorizontal: spacing.xs },
  changeLinkText: { ...typography.label, color: colors.primary },
  progressTrack: {
    width: "100%",
    height: 4,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
    overflow: "hidden",
  },
  progressFill: { height: 4, backgroundColor: colors.primary },
  questionText: { ...typography.title, color: colors.text, lineHeight: 32 },
  options: { width: "100%", marginTop: spacing.md, gap: spacing.sm },
  option: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
  },
  optionSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  optionDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.borderStrong,
  },
  optionDotSelected: { borderColor: colors.primary, backgroundColor: colors.primary },
  optionText: { ...typography.body, color: colors.text, flex: 1 },
  optionTextSelected: { color: colors.primaryDark, fontWeight: "600" },
  footer: {
    width: "100%",
    marginTop: spacing.lg,
    alignItems: "center",
    flexDirection: "row",
  },
  footerGap: { width: spacing.md },
  resultCard: { width: "100%", marginBottom: spacing.md },
  resultHeadline: { ...typography.headline, color: colors.text, textAlign: "center" },
  resultSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  cardTitle: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.xs,
    textTransform: "uppercase",
  },
  cardBody: { ...typography.body, color: colors.text, marginBottom: spacing.xs },
  correctText: { ...typography.body, color: colors.primaryDark },
});