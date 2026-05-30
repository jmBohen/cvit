import apiClient from './client';
import type { Cv } from '../types/api';

export const getCvList = () => apiClient.get<Cv[]>('/cv').then((r) => r.data);

export const getCvFull = (id: number) => apiClient.get(`/cv/${id}/full`).then((r) => r.data);

export const createCv = (data: { name: string; targetCompany?: string; jobOfferUrl?: string }) =>
  apiClient.post<Cv>('/cv', data).then((r) => r.data);

export const deleteCv = (id: number) => apiClient.delete(`/cv/${id}`);

export const upsertCvSettings = (id: number, data: { template?: string; language?: string; accentColor?: string; sectionOrder?: string[] }) =>
  apiClient.put(`/cv/${id}/settings`, data).then((r) => r.data);
