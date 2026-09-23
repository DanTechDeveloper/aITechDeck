import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { AppButton } from "../components/ui/AppButton";
import { Card } from "../components/ui/Card";
import { getCategories, getStruggles, masterStruggle } from "../api/quiz";
import type { Category, Difficulty, Struggle } from "../api/quiz";
import { clearToken } from "../api/client";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { colors, radius, spacing, typography } from "../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Study">;

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

type Stage =
  | { name: "setup" }
  | { name: "loading" }
  | { name: "error" }
  | { name: "empty"; category: string; difficulty: Difficulty }
  | { name: "ready"; category: string; difficulty: Difficulty; items: Struggle[]; index: number };

export function StudyScreen({ navigation }: Props) {
  const [stage, setStage] = useState<Stage>({ name: "setup" });
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [category, setCategory] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (stage.name !== "setup") return;
      let active = true;
      setCategoriesError(null);
      getCategories()
        .then((list) => {
          if (active) setCategories(list);
        })
        .catch((err) => {
          if (err?.response?.status === 401) {
            clearToken();
            navigation.replace("Auth");
            return;
          }
          if (active) setCategoriesError("Cannot load categories. Check your connection.");
        });
      return () => {
        active = false;
      };
    }, [stage.name, attempt, navigation]),
  );

  const startSession = async () => {
    if (!category || !difficulty) return;
    setBanner(null);
    setStage({ name: "loading" });
    try {
      const rows = await getStruggles();
      const scope = difficulty.toLowerCase();
      const items = rows.filter((r) => r.category === category && r.difficulty === scope);
      if (items.length === 0) {
        setStage({ name: "empty", category, difficulty });
        return;
      }
      setPicked(null);
      setChecked(false);
      // ponytail: biased shuffle, swap to Fisher-Yates if strictly uniform order matters
      const shuffled = [...items].sort(() => Math.random() - 0.5);
      setStage({ name: "ready", category, difficulty, items: shuffled, index: 0 });
    } catch (err: any) {
      if (err?.response?.status === 401) {
        clearToken();
        navigation.replace("Auth");
        return;
      }
      setStage({ name: "error" });
    }
  };

  const changeScope = () => {
    setPicked(null);
    setChecked(false);
    setBanner(null);
    setStage({ name: "setup" });
  };

  const checkAnswer = () => {
    if (picked === null) return;
    setBanner(null);
    setChecked(true);
  };

  const stillLearning = () => {
    if (stage.name !== "ready") return;
    setBanner(null);
    setPicked(null);
    setChecked(false);
    setStage({
      name: "ready",
      category: stage.category,
      difficulty: stage.difficulty,
      items: stage.items,
      index: (stage.index + 1) % stage.items.length,
    });
  };

  const gotIt = async () => {
    if (stage.name !== "ready") return;
    const item = stage.items[stage.index];
    setBanner(null);
    try {
      await masterStruggle(item.question_id);
      const rest = stage.items.filter((s) => s.question_id !== item.question_id);
      if (rest.length === 0) {
        setStage({ name: "empty", category: stage.category, difficulty: stage.difficulty });
        return;
      }
      setPicked(null);
      setChecked(false);
      setStage({
        name: "ready",
        category: stage.category,
        difficulty: stage.difficulty,
        items: rest,
        index: Math.min(stage.index, rest.length - 1),
      });
    } catch (err: any) {
      if (err?.response?.status === 401) {
        clearToken();
        navigation.replace("Auth");
        return;
      }
      setBanner("Could not save your progress. Check your connection and try again.");
    }
  };

  if (stage.name === "setup") {
    const ready = category !== null && difficulty !== null;
    return (
      <ScreenContainer>
        <View style={styles.header}>
          <Text style={styles.headline}>Choose your study scope</Text>
          <Text style={styles.subtitle}>
            Pick a category and difficulty to practice from your flagged mistakes.
          </Text>
        </View>

        {categoriesError ? (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>{categoriesError}</Text>
            <View style={styles.bannerAction}>
              <AppButton title="Try again" variant="outline" onPress={() => setAttempt((n) => n + 1)} />
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
          </>
        )}

        <View style={styles.footer}>
          <AppButton title="Start studying" disabled={!ready} onPress={startSession} />
        </View>
      </ScreenContainer>
    );
  }

  if (stage.name === "error") {
    return (
      <ScreenContainer>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Cannot load your review. Check your connection.</Text>
        </View>
        <View style={styles.bannerAction}>
          <AppButton title="Try again" variant="outline" onPress={startSession} />
        </View>
        <View style={styles.bannerAction}>
          <AppButton title="Back to setup" variant="outline" onPress={changeScope} />
        </View>
      </ScreenContainer>
    );
  }

  if (stage.name === "empty") {
    return (
      <ScreenContainer>
        <Card>
          <Text style={styles.title}>All clear</Text>
          <Text style={styles.body}>
            No flagged mistakes left in {stage.category} · {stage.difficulty} — you've mastered this
            deck.
          </Text>
        </Card>
        <View style={styles.footer}>
          <AppButton title="Study another scope" variant="outline" onPress={changeScope} />
          <View style={styles.footerGap} />
          <AppButton title="Back to home" onPress={() => navigation.popToTop()} />
        </View>
      </ScreenContainer>
    );
  }

  if (stage.name === "loading") {
    return (
      <ScreenContainer>
        <Text style={styles.body}>Loading your review…</Text>
      </ScreenContainer>
    );
  }

  const item = stage.items[stage.index];
  const isCorrect = picked === item.answerIndex;

  return (
    <ScreenContainer>
      <View style={styles.progressRow}>
        <Text style={styles.progressLabel}>
          {stage.category} · {stage.difficulty} · Card {stage.index + 1} of {stage.items.length}
        </Text>
        <Pressable onPress={changeScope} accessibilityRole="button" style={styles.changeLink}>
          <Text style={styles.changeLinkText}>Change scope</Text>
        </Pressable>
      </View>

      <Card>
        <Text style={styles.question}>{item.question}</Text>
        <View style={styles.options}>
          {item.options.map((option, oi) => {
            const isSelected = picked === oi;
            const isAnswer = oi === item.answerIndex;
            const pickedWrong = checked && isSelected && !isCorrect;
            return (
              <Pressable
                key={oi}
                onPress={() => {
                  if (!checked) setPicked(oi);
                }}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                style={[
                  styles.option,
                  isSelected && styles.optionSelected,
                  checked && isAnswer && styles.optionCorrect,
                  pickedWrong && styles.optionWrong,
                ]}
              >
                <View
                  style={[
                    styles.optionDot,
                    isSelected && styles.optionDotSelected,
                    checked && isAnswer && styles.optionDotCorrect,
                    pickedWrong && styles.optionDotWrong,
                  ]}
                />
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                    checked && isAnswer && styles.optionTextCorrect,
                    pickedWrong && styles.optionTextWrong,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {checked ? (
          <View style={styles.answers}>
            {isCorrect ? (
              <Text style={styles.correctText}>That's right — you've got this one.</Text>
            ) : (
              <>
                <Text style={styles.correctText}>
                  Correct answer: {item.options[item.answerIndex]}
                </Text>
                <Text style={styles.answerWrong}>Your answer: {item.options[picked!]}</Text>
              </>
            )}
          </View>
        ) : null}
      </Card>

      {banner ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{banner}</Text>
        </View>
      ) : null}

      <View style={styles.footer}>
        {checked ? (
          isCorrect ? (
            <AppButton title="Got it" onPress={gotIt} />
          ) : (
            <AppButton title="Still learning" variant="outline" onPress={stillLearning} />
          )
        ) : (
          <AppButton title="Check answer" disabled={picked === null} onPress={checkAnswer} />
        )}
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
    borderColor: colors.danger,
    backgroundColor: colors.dangerSoft,
    padding: spacing.md - 4,
    marginBottom: spacing.md,
  },
  bannerText: { ...typography.caption, color: colors.danger },
  bannerAction: { marginTop: spacing.sm, alignItems: "center" },
  body: { ...typography.body, color: colors.textMuted },
  title: { ...typography.title, color: colors.text, marginBottom: spacing.sm },
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
  question: { ...typography.title, color: colors.text, lineHeight: 32 },
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
  optionCorrect: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  optionWrong: { borderColor: colors.danger, backgroundColor: colors.dangerSoft },
  optionDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.borderStrong,
  },
  optionDotSelected: { borderColor: colors.primary, backgroundColor: colors.primary },
  optionDotCorrect: { borderColor: colors.primary, backgroundColor: colors.primary },
  optionDotWrong: { borderColor: colors.danger, backgroundColor: colors.danger },
  optionText: { ...typography.body, color: colors.text, flex: 1 },
  optionTextSelected: { color: colors.primaryDark, fontWeight: "600" },
  optionTextCorrect: { color: colors.primaryDark, fontWeight: "600" },
  optionTextWrong: { color: colors.danger, fontWeight: "600" },
  answers: { marginTop: spacing.md, gap: spacing.xs },
  correctText: { ...typography.body, color: colors.primaryDark },
  answerWrong: { ...typography.body, color: colors.danger },
  footer: {
    width: "100%",
    marginTop: spacing.lg,
    alignItems: "center",
    flexDirection: "row",
  },
  footerGap: { width: spacing.md },
});