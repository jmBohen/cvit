import apiClient from './client';
import type { User } from '../types/api';

export const getMe = () => apiClient.get<User>('/users/me').then((r) => r.data);

export const updateMe = (data: Partial<User>) =>
  apiClient.patch<User>('/users/me', data).then((r) => r.data);
