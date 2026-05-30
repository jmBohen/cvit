import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useOptimisticToggle } from '../../hooks/useOptimisticToggle';
import { getDataItems, getCvItems, createDataItem, updateDataItem, deleteDataItem } from '../../api/dataItems';
import type { Bio } from '../../types/api';

function BioForm({ onSuccess, initialData, onCancelEdit }: { onSuccess: () => void, initialData?: Bio | null, onCancelEdit?: () => void }) {
  const [summary, setSummary] = useState('');
  
  useEffect(() => {
    if (initialData) {
      setSummary(initialData.summary);
    } else {
      setSummary('');
    }
  }, [initialData]);

  const mutation = useMutation({
    mutationFn: (data: any) => initialData ? updateDataItem('bio', initialData.id, data) : createDataItem('bio', data),
    onSuccess: () => {
      setSummary('');
      onSuccess();
    }
  });

  return (
    <form onSubmit={(e) => { 
      e.preventDefault(); 
      mutation.mutate({ summary }); 
    }} className="mb-6 p-4 border border-dashed border-slate-300 rounded-lg bg-white">
      <h4 className="text-sm font-medium text-slate-900 mb-3">{initialData ? 'Edytuj bio' : 'Dodaj bio'}</h4>
      <div className="grid grid-cols-1 gap-3">
        <textarea 
          placeholder="Napisz coś o sobie..." 
          value={summary} 
          onChange={e => setSummary(e.target.value)} 
          required 
          rows={4}
          className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
        ></textarea>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        {initialData && (
          <button type="button" onClick={onCancelEdit} className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Anuluj
          </button>
        )}
        <button type="submit" disabled={mutation.isPending} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900">
          {initialData ? 'Zapisz zmiany' : 'Dodaj bio'}
        </button>
      </div>
    </form>
  );
}

export default function BioTab({ cvId }: { cvId: number }) {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: allBios } = useQuery<Bio[]>({
    queryKey: ['bios'],
    queryFn: () => getDataItems('bio'),
  });

  const { data: cvBios } = useQuery<any[]>({
    queryKey: ['cv-bios', cvId],
    queryFn: () => getCvItems(cvId, 'bio'),
  });

  const cvBioIds = new Set(cvBios?.map((b) => b.bio.id));

  const toggleMutation = useOptimisticToggle(cvId, 'bio', 'bios', 'cv-bios');

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteDataItem('bio', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bios'] });
      queryClient.invalidateQueries({ queryKey: ['cv-bios', cvId] });
    },
  });

  const editingItem = allBios?.find(b => b.id === editingId);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Moje notatki Bio</h3>
        <BioForm 
          initialData={editingItem}
          onCancelEdit={() => setEditingId(null)}
          onSuccess={() => { setEditingId(null); queryClient.invalidateQueries({ queryKey: ['bios'] }); queryClient.invalidateQueries({ queryKey: ['cv-bios', cvId] }); }} 
        />
        
        <div className="space-y-2">
          {allBios?.length === 0 && <p className="text-sm text-slate-500 italic">Brak dodanych notatek Bio.</p>}
          {allBios?.map((bio) => {
            const inCv = cvBioIds.has(bio.id);
            return (
              <div key={bio.id} className={`flex items-start p-3 rounded-md border transition-colors ${inCv ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                <label className="flex items-start cursor-pointer flex-1">
                  <div className="mt-1">
                    <input
                      type="checkbox"
                      checked={inCv}
                      onChange={() => toggleMutation.mutate({ id: bio.id, inCv })}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded mr-3"
                    />
                  </div>
                  <span className={`flex-1 text-sm font-medium ${inCv ? 'text-blue-900' : 'text-slate-700'}`}>
                    {bio.summary}
                  </span>
                </label>
                <div className="flex items-center space-x-2 ml-4">
                  <button onClick={() => setEditingId(bio.id)} className="text-slate-400 hover:text-blue-600 p-1" title="Edytuj">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button onClick={() => window.confirm('Usunąć ten element?') && deleteMutation.mutate(bio.id)} className="text-slate-400 hover:text-red-600 p-1" title="Usuń">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex-1 bg-slate-50 p-5 rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-2">Bio w CV</h3>
        <ul className="space-y-2">
          {cvBios?.length === 0 && <p className="text-sm text-slate-500 italic">Wybierz bio z lewej kolumny.</p>}
          {cvBios?.map((item) => (
            <li key={item.id} className="flex justify-between items-start bg-white p-3 rounded-md shadow-sm border border-slate-200 group">
              <span className="text-sm font-medium text-slate-900 whitespace-pre-wrap flex-1 mr-2">
                {item.bio.summary}
              </span>
              <button 
                onClick={() => toggleMutation.mutate({ id: item.bio.id, inCv: true })}
                className="text-slate-300 hover:text-red-500 transition-colors p-1"
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
