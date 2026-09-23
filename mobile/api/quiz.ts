import { api } from './client';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Category = {
  id: number;
  name: string;
};

export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
};

export type Struggle = {
  question_id: number;
  category: string;
  difficulty: string;
  question: string;
  options: string[];
  answerIndex: number;
  selectedIndex: number;
  updated_at: string;
};

export async function getCategories(): Promise<Category[]> {
  const res = await api.get<Category[]>('/quizzes/categories');
  return res.data;
}

export async function getQuiz(
  category: string,
  difficulty: Difficulty,
): Promise<QuizQuestion[]> {
  const res = await api.get<QuizQuestion[]>('/quizzes/' + difficulty.toLowerCase(), {
    params: { category },
  });
  return res.data;
}

export async function submitResult(
  answers: { question_id: number; selected_index: number }[],
): Promise<void> {
  await api.post('/quizzes/result', { answers });
}

export async function getStruggles(): Promise<Struggle[]> {
  const res = await api.get<Struggle[]>('/quizzes/struggles');
  return res.data;
}

export async function masterStruggle(questionId: number): Promise<void> {
  await api.delete(`/quizzes/struggles/${questionId}`);
}