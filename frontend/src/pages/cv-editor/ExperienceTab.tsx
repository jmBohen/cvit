import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDataItems, getCvItems, addItemToCv, removeItemFromCv, createDataItem } from '../../api/dataItems';
import type { Experience } from '../../types/api';

function AddExperienceForm({ onSuccess }: { onSuccess: () => void }) {
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  
  const mutation = useMutation({
    mutationFn: (data: any) => createDataItem('experience', data),
    onSuccess: () => {
      setCompany('');
      setPosition('');
      setStartDate('');
      setEndDate('');
      setIsCurrent(false);
      setDescription('');
      setCity('');
      onSuccess();
    }
  });

  return (
    <form onSubmit={(e) => { 
      e.preventDefault(); 
      mutation.mutate({ company, position, startDate, endDate: isCurrent ? null : endDate, isCurrent, description, city }); 
    }} className="mb-6 p-4 border border-dashed border-slate-300 rounded-lg bg-white space-y-4">
      <h4 className="text-sm font-medium text-slate-900">Dodaj nowe doświadczenie</h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Firma</label>
          <input type="text" value={company} onChange={e => setCompany(e.target.value)} required className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Stanowisko</label>
          <input type="text" value={position} onChange={e => setPosition(e.target.value)} required className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" />
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
            <input id="isCurrent" type="checkbox" checked={isCurrent} onChange={e => setIsCurrent(e.target.checked)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            <label htmlFor="isCurrent" className="ml-2 block text-sm text-slate-700">Obecnie pracuję</label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs text-slate-500 mb-1">Miasto / Kraj</label>
        <input type="text" value={city} onChange={e => setCity(e.target.value)} className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" />
      </div>

      <div>
        <label className="block text-xs text-slate-500 mb-1">Opis obowiązków (opcjonalnie)</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"></textarea>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={mutation.isPending} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900">
          Dodaj doświadczenie
        </button>
      </div>
    </form>
  );
}

export default function ExperienceTab({ cvId }: { cvId: number }) {
  const queryClient = useQueryClient();

  const { data: allExperiences } = useQuery<Experience[]>({
    queryKey: ['experiences'],
    queryFn: () => getDataItems('experience'),
  });

  const { data: cvExperiences } = useQuery<any[]>({
    queryKey: ['cv-experiences', cvId],
    queryFn: () => getCvItems(cvId, 'experience'),
  });

  const cvExpIds = new Set(cvExperiences?.map((e) => e.experience.id));

  const mutation = useMutation({
    mutationFn: ({ expId, inCv }: { expId: number; inCv: boolean }) =>
      inCv
        ? removeItemFromCv(cvId, 'experience', expId)
        : addItemToCv(cvId, 'experience', expId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cv-experiences', cvId] }),
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Moja historia zatrudnienia</h3>
        <AddExperienceForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ['experiences'] })} />
        
        <div className="space-y-3">
          {allExperiences?.length === 0 && <p className="text-sm text-slate-500 italic">Brak dodanego doświadczenia.</p>}
          {allExperiences?.map((exp) => {
            const inCv = cvExpIds.has(exp.id);
            return (
              <label key={exp.id} className={`flex items-start p-4 rounded-md border cursor-pointer transition-colors ${inCv ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                <div className="flex items-center h-5 mt-1">
                  <input
                    type="checkbox"
                    checked={inCv}
                    onChange={() => mutation.mutate({ expId: exp.id, inCv })}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <span className={`block text-base font-semibold ${inCv ? 'text-blue-900' : 'text-slate-900'}`}>
                    {exp.position}
                  </span>
                  <span className={`block text-sm ${inCv ? 'text-blue-700' : 'text-slate-600'} font-medium`}>
                    {exp.company}
                  </span>
                  <span className="block text-xs text-slate-500 mt-1">
                    {exp.startDate} - {exp.isCurrent ? 'Obecnie' : exp.endDate} {exp.city && ` | ${exp.city}`}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>
      
      <div className="flex-1 bg-slate-50 p-5 rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-2">Doświadczenie w tym CV</h3>
        <ul className="space-y-4">
          {cvExperiences?.length === 0 && <p className="text-sm text-slate-500 italic">Wybierz doświadczenie z lewej kolumny.</p>}
          {cvExperiences?.map((item) => (
            <li key={item.id} className="relative pl-6 border-l-2 border-blue-500">
              <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
              <h4 className="text-base font-bold text-slate-900">{item.experience.position}</h4>
              <p className="text-sm font-medium text-slate-700">{item.experience.company}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.experience.startDate} - {item.experience.isCurrent ? 'Obecnie' : item.experience.endDate}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
