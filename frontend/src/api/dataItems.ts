import apiClient from './client';
import { getCvFull } from './cv';

let pendingAggregatedRequest: Promise<any> | null = null;

export const getAggregatedData = () => {
  if (!pendingAggregatedRequest) {
    pendingAggregatedRequest = apiClient.get('/data/aggregated')
      .then((r) => {
        pendingAggregatedRequest = null;
        return r.data;
      })
      .catch((e) => {
        pendingAggregatedRequest = null;
        throw e;
      });
  }
  return pendingAggregatedRequest;
};

// Generic helper for data-items
export const getDataItems = (resource: string) => 
  getAggregatedData().then((data) => data[resource]);

export const createDataItem = (resource: string, data: unknown) =>
  apiClient.post(`/${resource}`, data).then((r) => r.data);

export const updateDataItem = (resource: string, id: number, data: unknown) =>
  apiClient.patch(`/${resource}/${id}`, data).then((r) => r.data);

export const deleteDataItem = (resource: string, id: number) =>
  apiClient.delete(`/${resource}/${id}`);

// Get cv-items for a specific CV
export const getCvItems = (cvId: number, resource: string) =>
  getCvFull(cvId).then((data) => data[`${resource}Items`]);

// Add/remove item from CV
export const addItemToCv = (cvId: number, resource: string, itemId: number) =>
  apiClient.post(`/cv/${cvId}/${resource}`, { [`${resource}Id`]: itemId }).then((r) => r.data);

export const removeItemFromCv = (cvId: number, resource: string, itemId: number) => {
  // UWAGA: Backend endpoint DELETE /cv/:cvId/:resource/:id oczekuje ID rekordu łączącego (cv-item ID),
  // ale nasz frontend operuje na ID globalnego zasobu (data-item ID). 
  // Aby to obejść bez zmiany backendu, najpierw pobieramy listę cv-items i znajdujemy odpowiednie ID łączące.
  return getCvFull(cvId).then((data) => {
    const items = data[`${resource}Items`];
    const itemToDelete = items.find((item: any) => item[resource].id === itemId);
    if (!itemToDelete) throw new Error('Item not found in CV');
    return apiClient.delete(`/cv/${cvId}/${resource}/${itemToDelete.id}`);
  });
};
