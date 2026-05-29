import apiClient from './client';

// Generic helper for data-items
export const getDataItems = (resource: string) => apiClient.get(`/${resource}`).then((r) => r.data);

export const createDataItem = (resource: string, data: unknown) =>
  apiClient.post(`/${resource}`, data).then((r) => r.data);

export const updateDataItem = (resource: string, id: number, data: unknown) =>
  apiClient.patch(`/${resource}/${id}`, data).then((r) => r.data);

export const deleteDataItem = (resource: string, id: number) =>
  apiClient.delete(`/${resource}/${id}`);

// Get cv-items for a specific CV
export const getCvItems = (cvId: number, resource: string) =>
  apiClient.get(`/cv/${cvId}`).then(() => {
    return apiClient.get(`/cv/${cvId}/full`).then((res) => res.data[`${resource}Items`]);
  });

// Add/remove item from CV
export const addItemToCv = (cvId: number, resource: string, itemId: number) =>
  apiClient.post(`/cv/${cvId}/${resource}`, { [`${resource}Id`]: itemId }).then((r) => r.data);

export const removeItemFromCv = (cvId: number, resource: string, itemId: number) =>
  apiClient.delete(`/cv/${cvId}/${resource}/${itemId}`);
