import { api } from './client';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Category = {
  id: number;
  name: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  answerIndex: number;
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