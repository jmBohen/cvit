import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useOptimisticToggle } from '../../hooks/useOptimisticToggle';
import { getDataItems, getCvItems, createDataItem, updateDataItem, deleteDataItem } from '../../api/dataItems';
import type { Technology } from '../../types/api';

function TechnologyForm({ onSuccess, initialData, onCancelEdit }: { onSuccess: () => void, initialData?: Technology | null, onCancelEdit?: () => void }) {
  const [name, setName] = useState('');
  const [level, setLevel] = useState('intermediate');
  const [category, setCategory] = useState('');
  
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setLevel(initialData.level);
      setCategory(initialData.category || '');
    } else {
      setName('');
      setLevel('intermediate');
      setCategory('');
    }
  }, [initialData]);

  const mutation = useMutation({
    mutationFn: (data: any) => initialData ? updateDataItem('technology', initialData.id, data) : createDataItem('technology', data),
    onSuccess: () => {
      setName('');
      setCategory('');
      onSuccess();
    }
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutation.mutate({ name, level, category }); }} className="mb-6 p-4 border border-dashed border-slate-300 rounded-lg bg-white">
      <h4 className="text-sm font-medium text-slate-900 mb-3">{initialData ? 'Edytuj technologię' : 'Dodaj nową technologię'}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input 
          type="text" 
          placeholder="Nazwa (np. React)" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          required 
        />
        <select 
          value={level} 
          onChange={e => setLevel(e.target.value)} 
          className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="expert">Expert</option>
        </select>
        <input 
          type="text" 
          placeholder="Kategoria (opcjonalnie)" 
          value={category} 
          onChange={e => setCategory(e.target.value)} 
          className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>
      <div className="mt-3 flex justify-end gap-2">
        {initialData && (
          <button type="button" onClick={onCancelEdit} className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Anuluj
          </button>
        )}
        <button type="submit" disabled={mutation.isPending} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900">
          {initialData ? 'Zapisz zmiany' : 'Dodaj do moich danych'}
        </button>
      </div>
    </form>
  );
}

export default function TechnologiesTab({ cvId }: { cvId: number }) {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: allTechnologies } = useQuery<Technology[]>({
    queryKey: ['technologies'],
    queryFn: () => getDataItems('technology'),
  });

  const { data: cvTechnologies } = useQuery<any[]>({
    queryKey: ['cv-technologies', cvId],
    queryFn: () => getCvItems(cvId, 'technology'),
  });

  const cvTechIds = new Set(cvTechnologies?.map((t) => t.technology.id));

  const toggleMutation = useOptimisticToggle(cvId, 'technology', 'technologies', 'cv-technologies');

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteDataItem('technology', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technologies'] });
      queryClient.invalidateQueries({ queryKey: ['cv-technologies', cvId] });
    },
  });

  const editingItem = allTechnologies?.find(t => t.id === editingId);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Moje dane (Wybierz do CV)</h3>
        <TechnologyForm 
          initialData={editingItem} 
          onCancelEdit={() => setEditingId(null)} 
          onSuccess={() => { setEditingId(null); queryClient.invalidateQueries({ queryKey: ['technologies'] }); queryClient.invalidateQueries({ queryKey: ['cv-technologies', cvId] }); }} 
        />
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {allTechnologies?.length === 0 && <p className="text-sm text-slate-500 italic">Brak dodanych technologii.</p>}
          {allTechnologies?.map((tech) => {
            const inCv = cvTechIds.has(tech.id);
            return (
              <div key={tech.id} className={`flex items-center p-3 rounded-md border transition-colors ${inCv ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                <label className="flex items-center cursor-pointer flex-1">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      checked={inCv}
                      onChange={() => toggleMutation.mutate({ id: tech.id, inCv })}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <span className={`block text-sm font-medium ${inCv ? 'text-blue-900' : 'text-slate-700'}`}>
                      {tech.name} <span className="text-slate-500 font-normal">({tech.level})</span>
                    </span>
                    {tech.category && <span className="block text-xs text-slate-500 mt-0.5">{tech.category}</span>}
                  </div>
                </label>
                <div className="flex items-center space-x-2 ml-4">
                  <button onClick={() => setEditingId(tech.id)} className="text-slate-400 hover:text-blue-600 p-1" title="Edytuj">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button onClick={() => window.confirm('Usunąć ten element?') && deleteMutation.mutate(tech.id)} className="text-slate-400 hover:text-red-600 p-1" title="Usuń">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex-1 bg-slate-50 p-5 rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-2">Zawartość w tym CV</h3>
        <ul className="space-y-3">
          {cvTechnologies?.length === 0 && <p className="text-sm text-slate-500 italic">Wybierz technologie z lewej kolumny.</p>}
          {cvTechnologies?.map((item) => (
            <li key={item.id} className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm border border-slate-200 group">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-sm font-medium text-slate-900">{item.technology.name}</span>
                  <span className="text-sm text-slate-500 ml-2">({item.technology.level})</span>
                </div>
              </div>
              <button 
                onClick={() => toggleMutation.mutate({ id: item.tech.id, inCv: true })}
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
