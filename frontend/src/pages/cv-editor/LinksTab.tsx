import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useOptimisticToggle } from '../../hooks/useOptimisticToggle';
import { getDataItems, getCvItems, createDataItem, updateDataItem, deleteDataItem } from '../../api/dataItems';
import type { Link } from '../../types/api';

function LinkForm({ onSuccess, initialData, onCancelEdit }: { onSuccess: () => void, initialData?: Link | null, onCancelEdit?: () => void }) {
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('');
  
  useEffect(() => {
    if (initialData) {
      setLabel(initialData.label);
      setUrl(initialData.url);
      setIcon(initialData.icon || '');
    } else {
      setLabel('');
      setUrl('');
      setIcon('');
    }
  }, [initialData]);

  const mutation = useMutation({
    mutationFn: (data: any) => initialData ? updateDataItem('link', initialData.id, data) : createDataItem('link', data),
    onSuccess: () => {
      setLabel('');
      setUrl('');
      setIcon('');
      onSuccess();
    }
  });

  return (
    <form onSubmit={(e) => { 
      e.preventDefault(); 
      mutation.mutate({ label, url, icon: icon || undefined }); 
    }} className="mb-6 p-4 border border-dashed border-slate-300 rounded-lg bg-white space-y-4">
      <h4 className="text-sm font-medium text-slate-900">{initialData ? 'Edytuj link' : 'Dodaj link'}</h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Etykieta (np. LinkedIn, Portfolio)</label>
          <input type="text" value={label} onChange={e => setLabel(e.target.value)} required className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">URL (https://...)</label>
          <input type="url" value={url} onChange={e => setUrl(e.target.value)} required className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-xs text-slate-500 mb-1">Ikona (opcjonalnie)</label>
        <input type="text" value={icon} onChange={e => setIcon(e.target.value)} placeholder="np. fa-linkedin, lub URL ikony" className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" />
      </div>

      <div className="flex justify-end gap-2">
        {initialData && (
          <button type="button" onClick={onCancelEdit} className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Anuluj
          </button>
        )}
        <button type="submit" disabled={mutation.isPending} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900">
          {initialData ? 'Zapisz zmiany' : 'Dodaj link'}
        </button>
      </div>
    </form>
  );
}

export default function LinksTab({ cvId }: { cvId: number }) {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: allLinks } = useQuery<Link[]>({
    queryKey: ['links'],
    queryFn: () => getDataItems('link'),
  });

  const { data: cvLinks } = useQuery<any[]>({
    queryKey: ['cv-links', cvId],
    queryFn: () => getCvItems(cvId, 'link'),
  });

  const cvLinkIds = new Set(cvLinks?.map((l) => l.link.id));

  const toggleMutation = useOptimisticToggle(cvId, 'link', 'links', 'cv-links');

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteDataItem('link', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      queryClient.invalidateQueries({ queryKey: ['cv-links', cvId] });
    },
  });

  const editingItem = allLinks?.find(l => l.id === editingId);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Moje linki</h3>
        <LinkForm 
          initialData={editingItem}
          onCancelEdit={() => setEditingId(null)}
          onSuccess={() => { setEditingId(null); queryClient.invalidateQueries({ queryKey: ['links'] }); queryClient.invalidateQueries({ queryKey: ['cv-links', cvId] }); }} 
        />
        
        <div className="space-y-3">
          {allLinks?.length === 0 && <p className="text-sm text-slate-500 italic">Brak dodanych linków.</p>}
          {allLinks?.map((link) => {
            const inCv = cvLinkIds.has(link.id);
            return (
              <div key={link.id} className={`flex items-start p-4 rounded-md border transition-colors ${inCv ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                <label className="flex items-start cursor-pointer flex-1">
                  <div className="flex items-center h-5 mt-1">
                    <input
                      type="checkbox"
                      checked={inCv}
                      onChange={() => toggleMutation.mutate({ id: link.id, inCv })}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 flex-1 overflow-hidden">
                    <span className={`block text-base font-semibold ${inCv ? 'text-blue-900' : 'text-slate-900'}`}>
                      {link.label}
                    </span>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 hover:underline truncate" onClick={(e) => e.stopPropagation()}>
                      {link.url}
                    </a>
                  </div>
                </label>
                <div className="flex flex-col space-y-2 ml-4">
                  <button onClick={() => setEditingId(link.id)} className="text-slate-400 hover:text-blue-600 p-1" title="Edytuj">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button onClick={() => window.confirm('Usunąć ten element?') && deleteMutation.mutate(link.id)} className="text-slate-400 hover:text-red-600 p-1" title="Usuń">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex-1 bg-slate-50 p-5 rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-2">Linki w CV</h3>
        <ul className="space-y-3">
          {cvLinks?.length === 0 && <p className="text-sm text-slate-500 italic">Zaznacz linki w lewej kolumnie.</p>}
          {cvLinks?.map((item) => (
            <li key={item.id} className="bg-white p-3 rounded-md shadow-sm border border-slate-200 flex justify-between items-center group">
              <div className="overflow-hidden mr-2">
                <h4 className="text-sm font-bold text-slate-900 leading-tight">{item.link.label}</h4>
                <p className="text-xs text-slate-500 truncate">{item.link.url}</p>
              </div>
              <button 
                onClick={() => toggleMutation.mutate({ id: item.link.id, inCv: true })}
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
