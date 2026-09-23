import { api, setToken, clearToken } from './client';

export type User = {
  id: number;
  name: string;
  email: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export async function register(data: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/register', data);
  await setToken(res.data.token);
  return res.data;
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/login', data);
  await setToken(res.data.token);
  return res.data;
}

export async function logout(): Promise<void> {
  await api.post('/logout');
  await clearToken();
}

export async function getUser(): Promise<User> {
  const res = await api.get<User>('/user');
  return res.data;
}
