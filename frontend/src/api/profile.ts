import apiClient from './client';
import type { Profile } from '../types/api';

export const getOwnProfile = () => apiClient.get<Profile>('/profile').then((r) => r.data);

export const upsertProfile = (data: Partial<Profile>) =>
  apiClient.put<Profile>('/profile', data).then((r) => r.data);
