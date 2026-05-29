import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDataItems, getCvItems, addItemToCv, removeItemFromCv, createDataItem, updateDataItem, deleteDataItem } from '../../api/dataItems';
import type { Language } from '../../types/api';

function LanguageForm({ onSuccess, initialData, onCancelEdit }: { onSuccess: () => void, initialData?: Language | null, onCancelEdit?: () => void }) {
  const [name, setName] = useState('');
  const [level, setLevel] = useState('B2');
  
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setLevel(initialData.level);
    } else {
      setName('');
      setLevel('B2');
    }
  }, [initialData]);

  const mutation = useMutation({
    mutationFn: (data: any) => initialData ? updateDataItem('language', initialData.id, data) : createDataItem('language', data),
    onSuccess: () => {
      setName('');
      setLevel('B2');
      onSuccess();
    }
  });

  return (
    <form onSubmit={(e) => { 
      e.preventDefault(); 
      mutation.mutate({ name, level }); 
    }} className="mb-6 p-4 border border-dashed border-slate-300 rounded-lg bg-white">
      <h4 className="text-sm font-medium text-slate-900 mb-3">{initialData ? 'Edytuj język' : 'Dodaj język'}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input 
          type="text" 
          placeholder="Język (np. Angielski)" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          required 
          className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
        <select 
          value={level} 
          onChange={e => setLevel(e.target.value)}
          className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
        >
          <option value="A1">A1 - Początkujący</option>
          <option value="A2">A2 - Podstawowy</option>
          <option value="B1">B1 - Średniozaawansowany niższy</option>
          <option value="B2">B2 - Średniozaawansowany</option>
          <option value="C1">C1 - Zaawansowany</option>
          <option value="C2">C2 - Biegły</option>
          <option value="native">Native (Ojczysty)</option>
        </select>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        {initialData && (
          <button type="button" onClick={onCancelEdit} className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Anuluj
          </button>
        )}
        <button type="submit" disabled={mutation.isPending} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900">
          {initialData ? 'Zapisz zmiany' : 'Dodaj język'}
        </button>
      </div>
    </form>
  );
}

export default function LanguagesTab({ cvId }: { cvId: number }) {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: allLanguages } = useQuery<Language[]>({
    queryKey: ['languages'],
    queryFn: () => getDataItems('language'),
  });

  const { data: cvLanguages } = useQuery<any[]>({
    queryKey: ['cv-languages', cvId],
    queryFn: () => getCvItems(cvId, 'language'),
  });

  const cvLangIds = new Set(cvLanguages?.map((l) => l.language.id));

  const toggleMutation = useMutation({
    mutationFn: ({ langId, inCv }: { langId: number; inCv: boolean }) =>
      inCv
        ? removeItemFromCv(cvId, 'language', langId)
        : addItemToCv(cvId, 'language', langId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cv-languages', cvId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteDataItem('language', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
      queryClient.invalidateQueries({ queryKey: ['cv-languages', cvId] });
    },
  });

  const editingItem = allLanguages?.find(l => l.id === editingId);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Moje języki</h3>
        <LanguageForm 
          initialData={editingItem}
          onCancelEdit={() => setEditingId(null)}
          onSuccess={() => { setEditingId(null); queryClient.invalidateQueries({ queryKey: ['languages'] }); queryClient.invalidateQueries({ queryKey: ['cv-languages', cvId] }); }} 
        />
        
        <div className="space-y-2">
          {allLanguages?.length === 0 && <p className="text-sm text-slate-500 italic">Brak dodanych języków.</p>}
          {allLanguages?.map((lang) => {
            const inCv = cvLangIds.has(lang.id);
            return (
              <div key={lang.id} className={`flex items-center p-3 rounded-md border transition-colors ${inCv ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                <label className="flex items-center cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={inCv}
                    onChange={() => toggleMutation.mutate({ langId: lang.id, inCv })}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded mr-3"
                  />
                  <span className={`flex-1 text-sm font-medium ${inCv ? 'text-blue-900' : 'text-slate-700'}`}>
                    {lang.name}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${inCv ? 'bg-blue-200 text-blue-800' : 'bg-slate-100 text-slate-600'}`}>
                    {lang.level}
                  </span>
                </label>
                <div className="flex items-center space-x-2 ml-4">
                  <button onClick={() => setEditingId(lang.id)} className="text-slate-400 hover:text-blue-600 p-1" title="Edytuj">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button onClick={() => window.confirm('Usunąć ten element?') && deleteMutation.mutate(lang.id)} className="text-slate-400 hover:text-red-600 p-1" title="Usuń">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex-1 bg-slate-50 p-5 rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-2">Języki w CV</h3>
        <ul className="space-y-2">
          {cvLanguages?.length === 0 && <p className="text-sm text-slate-500 italic">Wybierz języki z lewej kolumny.</p>}
          {cvLanguages?.map((item) => (
            <li key={item.id} className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm border border-slate-200">
              <span className="text-sm font-medium text-slate-900 flex items-center">
                <svg className="h-4 w-4 text-slate-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                {item.language.name}
              </span>
              <span className="text-sm font-bold text-slate-700">{item.language.level}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
