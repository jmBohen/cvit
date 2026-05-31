import apiClient from './client';
import type { Cv } from '../types/api';

export const getCvList = () => apiClient.get<Cv[]>('/cv').then((r) => r.data);

const pendingCvFullRequests: Record<number, Promise<any>> = {};

export const getCvFull = (id: number) => {
  if (!pendingCvFullRequests[id]) {
    pendingCvFullRequests[id] = apiClient.get(`/cv/${id}/full`)
      .then((r) => {
        delete pendingCvFullRequests[id];
        return r.data;
      })
      .catch((e) => {
        delete pendingCvFullRequests[id];
        throw e;
      });
  }
  return pendingCvFullRequests[id];
};

export const createCv = (data: { name: string; targetCompany?: string; jobOfferUrl?: string }) =>
  apiClient.post<Cv>('/cv', data).then((r) => r.data);

export const updateCv = (id: number, data: { name?: string; targetCompany?: string; jobOfferUrl?: string }) =>
  apiClient.patch<Cv>(`/cv/${id}`, data).then((r) => r.data);

export const deleteCv = (id: number) => apiClient.delete(`/cv/${id}`);

export const upsertCvSettings = (id: number, data: { template?: string; language?: string; accentColor?: string; sectionOrder?: string[] }) =>
  apiClient.put(`/cv/${id}/settings`, data).then((r) => r.data);
