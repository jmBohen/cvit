import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useOptimisticToggle } from '../../hooks/useOptimisticToggle';
import { getDataItems, getCvItems, createDataItem, updateDataItem, deleteDataItem } from '../../api/dataItems';
import type { Interest } from '../../types/api';

function InterestForm({ onSuccess, initialData, onCancelEdit }: { onSuccess: () => void, initialData?: Interest | null, onCancelEdit?: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [initialData]);

  const mutation = useMutation({
    mutationFn: (data: any) => initialData ? updateDataItem('interest', initialData.id, data) : createDataItem('interest', data),
    onSuccess: () => {
      setName('');
      setDescription('');
      onSuccess();
    }
  });

  return (
    <form onSubmit={(e) => { 
      e.preventDefault(); 
      mutation.mutate({ name, description: description || undefined }); 
    }} className="mb-6 p-4 border border-dashed border-slate-300 rounded-lg bg-white space-y-4">
      <h4 className="text-sm font-medium text-slate-900">{initialData ? 'Edytuj zainteresowanie' : 'Dodaj zainteresowanie'}</h4>
      
      <div>
        <label className="block text-xs text-slate-500 mb-1">Nazwa</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" />
      </div>

      <div>
        <label className="block text-xs text-slate-500 mb-1">Opis (opcjonalnie)</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"></textarea>
      </div>

      <div className="flex justify-end gap-2">
        {initialData && (
          <button type="button" onClick={onCancelEdit} className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Anuluj
          </button>
        )}
        <button type="submit" disabled={mutation.isPending} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900">
          {initialData ? 'Zapisz zmiany' : 'Dodaj zainteresowanie'}
        </button>
      </div>
    </form>
  );
}

export default function InterestsTab({ cvId }: { cvId: number }) {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: allInterests } = useQuery<Interest[]>({
    queryKey: ['interests'],
    queryFn: () => getDataItems('interest'),
  });

  const { data: cvInterests } = useQuery<any[]>({
    queryKey: ['cv-interests', cvId],
    queryFn: () => getCvItems(cvId, 'interest'),
  });

  const cvInterestIds = new Set(cvInterests?.map((i) => i.interest.id));

  const toggleMutation = useOptimisticToggle(cvId, 'interest', 'interests', 'cv-interests');

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteDataItem('interest', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interests'] });
      queryClient.invalidateQueries({ queryKey: ['cv-interests', cvId] });
    },
  });

  const editingItem = allInterests?.find(i => i.id === editingId);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Zainteresowania / Hobby</h3>
        <InterestForm 
          initialData={editingItem}
          onCancelEdit={() => setEditingId(null)}
          onSuccess={() => { setEditingId(null); queryClient.invalidateQueries({ queryKey: ['interests'] }); queryClient.invalidateQueries({ queryKey: ['cv-interests', cvId] }); }} 
        />
        
        <div className="space-y-3">
          {allInterests?.length === 0 && <p className="text-sm text-slate-500 italic">Brak dodanych zainteresowań.</p>}
          {allInterests?.map((interest) => {
            const inCv = cvInterestIds.has(interest.id);
            return (
              <div key={interest.id} className={`flex items-start p-4 rounded-md border transition-colors ${inCv ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                <label className="flex items-start cursor-pointer flex-1">
                  <div className="flex items-center h-5 mt-1">
                    <input
                      type="checkbox"
                      checked={inCv}
                      onChange={() => toggleMutation.mutate({ id: interest.id, inCv })}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <span className={`block text-base font-semibold ${inCv ? 'text-blue-900' : 'text-slate-900'}`}>
                      {interest.name}
                    </span>
                    {interest.description && (
                      <span className="block text-sm text-slate-600 mt-1">
                        {interest.description}
                      </span>
                    )}
                  </div>
                </label>
                <div className="flex flex-col space-y-2 ml-4">
                  <button onClick={() => setEditingId(interest.id)} className="text-slate-400 hover:text-blue-600 p-1" title="Edytuj">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button onClick={() => window.confirm('Usunąć ten element?') && deleteMutation.mutate(interest.id)} className="text-slate-400 hover:text-red-600 p-1" title="Usuń">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex-1 bg-slate-50 p-5 rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-2">Wybrane do CV</h3>
        <ul className="space-y-3">
          {cvInterests?.length === 0 && <p className="text-sm text-slate-500 italic">Zaznacz zainteresowania w lewej kolumnie.</p>}
          {cvInterests?.map((item) => (
            <li key={item.id} className="bg-white p-3 rounded-md shadow-sm border border-slate-200 flex justify-between items-center group">
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">{item.interest.name}</h4>
                {item.interest.description && <p className="text-xs text-slate-500 truncate mt-1">{item.interest.description}</p>}
              </div>
              <button 
                onClick={() => toggleMutation.mutate({ id: item.interest.id, inCv: true })}
                className="text-slate-300 hover:text-red-500 transition-colors p-1 flex-shrink-0"
                title="Usuń z CV"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
