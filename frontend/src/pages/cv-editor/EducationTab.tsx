import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDataItems, getCvItems, addItemToCv, removeItemFromCv, createDataItem, updateDataItem, deleteDataItem } from '../../api/dataItems';
import type { Education } from '../../types/api';

function EducationForm({ onSuccess, initialData, onCancelEdit }: { onSuccess: () => void, initialData?: Education | null, onCancelEdit?: () => void }) {
  const [school, setSchool] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [description, setDescription] = useState('');
  
  useEffect(() => {
    if (initialData) {
      setSchool(initialData.school);
      setDegree(initialData.degree || '');
      setFieldOfStudy(initialData.fieldOfStudy || '');
      setStartDate(initialData.startDate);
      setEndDate(initialData.endDate || '');
      setIsCurrent(initialData.isCurrent);
      setDescription(initialData.description || '');
    } else {
      setSchool('');
      setDegree('');
      setFieldOfStudy('');
      setStartDate('');
      setEndDate('');
      setIsCurrent(false);
      setDescription('');
    }
  }, [initialData]);

  const mutation = useMutation({
    mutationFn: (data: any) => initialData ? updateDataItem('education', initialData.id, data) : createDataItem('education', data),
    onSuccess: () => {
      setSchool('');
      setDegree('');
      setFieldOfStudy('');
      setStartDate('');
      setEndDate('');
      setIsCurrent(false);
      setDescription('');
      onSuccess();
    }
  });

  return (
    <form onSubmit={(e) => { 
      e.preventDefault(); 
      mutation.mutate({ school, degree, fieldOfStudy, startDate, endDate: isCurrent ? null : endDate, isCurrent, description }); 
    }} className="mb-6 p-4 border border-dashed border-slate-300 rounded-lg bg-white space-y-4">
      <h4 className="text-sm font-medium text-slate-900">{initialData ? 'Edytuj edukację' : 'Dodaj edukację'}</h4>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Uczelnia / Szkoła</label>
          <input type="text" value={school} onChange={e => setSchool(e.target.value)} required className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Kierunek</label>
          <input type="text" value={fieldOfStudy} onChange={e => setFieldOfStudy(e.target.value)} className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Stopień / Tytuł (np. Inżynier)</label>
          <input type="text" value={degree} onChange={e => setDegree(e.target.value)} className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Data od</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Data do</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} disabled={isCurrent} required={!isCurrent} className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-slate-100" />
          <div className="mt-2 flex items-center">
            <input id="isCurrentEdu" type="checkbox" checked={isCurrent} onChange={e => setIsCurrent(e.target.checked)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            <label htmlFor="isCurrentEdu" className="ml-2 block text-sm text-slate-700">W trakcie studiów</label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs text-slate-500 mb-1">Dodatkowe informacje (opcjonalnie)</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"></textarea>
      </div>

      <div className="flex justify-end gap-2">
        {initialData && (
          <button type="button" onClick={onCancelEdit} className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Anuluj
          </button>
        )}
        <button type="submit" disabled={mutation.isPending} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900">
          {initialData ? 'Zapisz zmiany' : 'Dodaj edukację'}
        </button>
      </div>
    </form>
  );
}

export default function EducationTab({ cvId }: { cvId: number }) {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: allEducations } = useQuery<Education[]>({
    queryKey: ['educations'],
    queryFn: () => getDataItems('education'),
  });

  const { data: cvEducations } = useQuery<any[]>({
    queryKey: ['cv-educations', cvId],
    queryFn: () => getCvItems(cvId, 'education'),
  });

  const cvEduIds = new Set(cvEducations?.map((e) => e.education.id));

  const toggleMutation = useMutation({
    mutationFn: ({ eduId, inCv }: { eduId: number; inCv: boolean }) =>
      inCv
        ? removeItemFromCv(cvId, 'education', eduId)
        : addItemToCv(cvId, 'education', eduId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cv-educations', cvId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteDataItem('education', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educations'] });
      queryClient.invalidateQueries({ queryKey: ['cv-educations', cvId] });
    },
  });

  const editingItem = allEducations?.find(e => e.id === editingId);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Moja edukacja</h3>
        <EducationForm 
          initialData={editingItem}
          onCancelEdit={() => setEditingId(null)}
          onSuccess={() => { setEditingId(null); queryClient.invalidateQueries({ queryKey: ['educations'] }); queryClient.invalidateQueries({ queryKey: ['cv-educations', cvId] }); }} 
        />
        
        <div className="space-y-3">
          {allEducations?.length === 0 && <p className="text-sm text-slate-500 italic">Brak wpisów o edukacji.</p>}
          {allEducations?.map((edu) => {
            const inCv = cvEduIds.has(edu.id);
            return (
              <div key={edu.id} className={`flex items-start p-4 rounded-md border transition-colors ${inCv ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                <label className="flex items-start cursor-pointer flex-1">
                  <div className="flex items-center h-5 mt-1">
                    <input
                      type="checkbox"
                      checked={inCv}
                      onChange={() => toggleMutation.mutate({ eduId: edu.id, inCv })}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <span className={`block text-base font-semibold ${inCv ? 'text-blue-900' : 'text-slate-900'}`}>
                      {edu.school}
                    </span>
                    {(edu.fieldOfStudy || edu.degree) && (
                      <span className={`block text-sm ${inCv ? 'text-blue-700' : 'text-slate-600'} font-medium`}>
                        {edu.fieldOfStudy} {edu.degree && `(${edu.degree})`}
                      </span>
                    )}
                    <span className="block text-xs text-slate-500 mt-1">
                      {edu.startDate} - {edu.isCurrent ? 'Obecnie' : edu.endDate}
                    </span>
                  </div>
                </label>
                <div className="flex flex-col space-y-2 ml-4">
                  <button onClick={() => setEditingId(edu.id)} className="text-slate-400 hover:text-blue-600 p-1" title="Edytuj">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button onClick={() => window.confirm('Usunąć ten element?') && deleteMutation.mutate(edu.id)} className="text-slate-400 hover:text-red-600 p-1" title="Usuń">
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
        <ul className="space-y-4">
          {cvEducations?.length === 0 && <p className="text-sm text-slate-500 italic">Zaznacz szkoły w lewej kolumnie.</p>}
          {cvEducations?.map((item) => (
            <li key={item.id} className="relative pl-6 border-l-2 border-blue-500">
              <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
              <h4 className="text-base font-bold text-slate-900">{item.education.school}</h4>
              <p className="text-sm font-medium text-slate-700">{item.education.fieldOfStudy} {item.education.degree && `(${item.education.degree})`}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.education.startDate} - {item.education.isCurrent ? 'W trakcie' : item.education.endDate}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
