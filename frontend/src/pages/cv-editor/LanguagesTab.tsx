import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDataItems, getCvItems, addItemToCv, removeItemFromCv, createDataItem } from '../../api/dataItems';
import type { Language } from '../../types/api';

function AddLanguageForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [level, setLevel] = useState('B2');
  
  const mutation = useMutation({
    mutationFn: (data: any) => createDataItem('language', data),
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
      <h4 className="text-sm font-medium text-slate-900 mb-3">Dodaj język</h4>
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
      <div className="mt-3 flex justify-end">
        <button type="submit" disabled={mutation.isPending} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900">
          Dodaj język
        </button>
      </div>
    </form>
  );
}

export default function LanguagesTab({ cvId }: { cvId: number }) {
  const queryClient = useQueryClient();

  const { data: allLanguages } = useQuery<Language[]>({
    queryKey: ['languages'],
    queryFn: () => getDataItems('language'),
  });

  const { data: cvLanguages } = useQuery<any[]>({
    queryKey: ['cv-languages', cvId],
    queryFn: () => getCvItems(cvId, 'language'),
  });

  const cvLangIds = new Set(cvLanguages?.map((l) => l.language.id));

  const mutation = useMutation({
    mutationFn: ({ langId, inCv }: { langId: number; inCv: boolean }) =>
      inCv
        ? removeItemFromCv(cvId, 'language', langId)
        : addItemToCv(cvId, 'language', langId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cv-languages', cvId] }),
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Moje języki</h3>
        <AddLanguageForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ['languages'] })} />
        <div className="space-y-2">
          {allLanguages?.length === 0 && <p className="text-sm text-slate-500 italic">Brak dodanych języków.</p>}
          {allLanguages?.map((lang) => {
            const inCv = cvLangIds.has(lang.id);
            return (
              <label key={lang.id} className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors ${inCv ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input
                  type="checkbox"
                  checked={inCv}
                  onChange={() => mutation.mutate({ langId: lang.id, inCv })}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded mr-3"
                />
                <span className={`flex-1 text-sm font-medium ${inCv ? 'text-blue-900' : 'text-slate-700'}`}>
                  {lang.name}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${inCv ? 'bg-blue-200 text-blue-800' : 'bg-slate-100 text-slate-600'}`}>
                  {lang.level}
                </span>
              </label>
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
