import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addItemToCv, removeItemFromCv } from '../api/dataItems';

export function useOptimisticToggle(cvId: number, resourceType: string, listQueryKey: string, cvListQueryKey: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, inCv }: { id: number; inCv: boolean }) =>
      inCv
        ? removeItemFromCv(cvId, resourceType, id)
        : addItemToCv(cvId, resourceType, id),
    onMutate: async ({ id, inCv }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: [cvListQueryKey, cvId] });
      
      // Snapshot the previous value
      const previousItems = queryClient.getQueryData([cvListQueryKey, cvId]);
      
      // Optimistically update to the new value
      queryClient.setQueryData([cvListQueryKey, cvId], (old: any[]) => {
        if (inCv) {
          // Removing from CV
          return old?.filter((item) => item[resourceType].id !== id) || [];
        } else {
          // Adding to CV
          const allItems = queryClient.getQueryData<any[]>([listQueryKey]);
          const itemToAdd = allItems?.find((i) => i.id === id);
          
          // Only add if we found it and it's not already in the list
          if (itemToAdd && !old?.some((i) => i[resourceType].id === id)) {
            return [...(old || []), { id: `temp-${Date.now()}-${id}`, [resourceType]: itemToAdd }];
          }
          return old;
        }
      });
      
      // Return a context object with the snapshotted value
      return { previousItems };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_err, _variables, context) => {
      queryClient.setQueryData([cvListQueryKey, cvId], context?.previousItems);
    },
    // Always refetch after error or success to ensure we have the correct server state
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [cvListQueryKey, cvId] });
    },
  });
}
