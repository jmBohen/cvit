import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDataItems, getCvItems, addItemToCv, removeItemFromCv, createDataItem, updateDataItem, deleteDataItem } from '../../api/dataItems';
import type { Project } from '../../types/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function ProjectForm({ onSuccess, initialData, onCancelEdit }: { onSuccess: () => void, initialData?: Project | null, onCancelEdit?: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || '');
      setTechStack(initialData.techStack || '');
      setGithubUrl(initialData.githubUrl || '');
      setLiveUrl(initialData.liveUrl || '');
      setStartDate(initialData.startDate ? initialData.startDate.substring(0, 7) : '');
      setEndDate(initialData.endDate ? initialData.endDate.substring(0, 7) : '');
    } else {
      setName('');
      setDescription('');
      setTechStack('');
      setGithubUrl('');
      setLiveUrl('');
      setStartDate('');
      setEndDate('');
    }
  }, [initialData]);

  const mutation = useMutation({
    mutationFn: (data: any) => initialData ? updateDataItem('project', initialData.id, data) : createDataItem('project', data),
    onSuccess: () => {
      setName('');
      setDescription('');
      setTechStack('');
      setGithubUrl('');
      setLiveUrl('');
      setStartDate('');
      setEndDate('');
      onSuccess();
    }
  });

  return (
    <form onSubmit={(e) => { 
      e.preventDefault(); 
      mutation.mutate({ name, description, techStack, githubUrl, liveUrl, startDate, endDate }); 
    }} className="mb-6 p-4 border border-dashed border-slate-300 rounded-lg bg-white space-y-4">
      <h4 className="text-sm font-medium text-slate-900">{initialData ? 'Edytuj projekt' : 'Dodaj projekt'}</h4>
      
      <div>
        <label className="block text-xs text-slate-500 mb-1">Nazwa projektu</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" />
      </div>

      <div>
        <label className="block text-xs text-slate-500 mb-1">Tech stack (użyte technologie)</label>
        <input type="text" placeholder="np. React, Node.js, PostgreSQL" value={techStack} onChange={e => setTechStack(e.target.value)} className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-500 mb-1">URL Repozytorium (GitHub)</label>
          <input type="url" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">URL Live (Demo)</label>
          <input type="url" value={liveUrl} onChange={e => setLiveUrl(e.target.value)} className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Data rozpoczęcia (MM/YYYY)</label>
          <DatePicker
            selected={startDate ? new Date(startDate) : null}
            onChange={(date: Date | null) => setStartDate(date ? date.toISOString().substring(0, 7) : '')}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            placeholderText="Wybierz z kalendarza"
            className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Data zakończenia (MM/YYYY)</label>
          <DatePicker
            selected={endDate ? new Date(endDate) : null}
            onChange={(date: Date | null) => setEndDate(date ? date.toISOString().substring(0, 7) : '')}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            placeholderText="Wybierz z kalendarza"
            className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-slate-500 mb-1">Opis projektu</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"></textarea>
      </div>

      <div className="flex justify-end gap-2">
        {initialData && (
          <button type="button" onClick={onCancelEdit} className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Anuluj
          </button>
        )}
        <button type="submit" disabled={mutation.isPending} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900">
          {initialData ? 'Zapisz zmiany' : 'Dodaj projekt'}
        </button>
      </div>
    </form>
  );
}

export default function ProjectsTab({ cvId }: { cvId: number }) {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: allProjects } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => getDataItems('project'),
  });

  const { data: cvProjects } = useQuery<any[]>({
    queryKey: ['cv-projects', cvId],
    queryFn: () => getCvItems(cvId, 'project'),
  });

  const cvProjIds = new Set(cvProjects?.map((p) => p.project.id));

  const toggleMutation = useMutation({
    mutationFn: ({ projId, inCv }: { projId: number; inCv: boolean }) =>
      inCv
        ? removeItemFromCv(cvId, 'project', projId)
        : addItemToCv(cvId, 'project', projId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cv-projects', cvId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteDataItem('project', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['cv-projects', cvId] });
    },
  });

  const editingItem = allProjects?.find(p => p.id === editingId);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Moje portfolio</h3>
        <ProjectForm 
          initialData={editingItem}
          onCancelEdit={() => setEditingId(null)}
          onSuccess={() => { setEditingId(null); queryClient.invalidateQueries({ queryKey: ['projects'] }); queryClient.invalidateQueries({ queryKey: ['cv-projects', cvId] }); }} 
        />
        
        <div className="space-y-3">
          {allProjects?.length === 0 && <p className="text-sm text-slate-500 italic">Brak dodanych projektów.</p>}
          {allProjects?.map((proj) => {
            const inCv = cvProjIds.has(proj.id);
            return (
              <div key={proj.id} className={`flex items-start p-4 rounded-md border transition-colors ${inCv ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                <label className="flex items-start cursor-pointer flex-1">
                  <div className="flex items-center h-5 mt-1">
                    <input
                      type="checkbox"
                      checked={inCv}
                      onChange={() => toggleMutation.mutate({ projId: proj.id, inCv })}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <span className={`block text-base font-semibold ${inCv ? 'text-blue-900' : 'text-slate-900'}`}>
                      {proj.name}
                    </span>
                    {proj.techStack && (
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${inCv ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'}`}>
                        {proj.techStack}
                      </span>
                    )}
                  </div>
                </label>
                <div className="flex flex-col space-y-2 ml-4">
                  <button onClick={() => setEditingId(proj.id)} className="text-slate-400 hover:text-blue-600 p-1" title="Edytuj">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button onClick={() => window.confirm('Usunąć ten element?') && deleteMutation.mutate(proj.id)} className="text-slate-400 hover:text-red-600 p-1" title="Usuń">
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
          {cvProjects?.length === 0 && <p className="text-sm text-slate-500 italic">Zaznacz projekty w lewej kolumnie.</p>}
          {cvProjects?.map((item) => (
            <li key={item.id} className="bg-white p-4 rounded-md shadow-sm border border-slate-200 flex justify-between items-start group">
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                  {item.project.name}
                </h4>
                {item.project.techStack && <p className="text-xs text-slate-500 mt-1 font-mono">{item.project.techStack}</p>}
              </div>
              <button 
                onClick={() => toggleMutation.mutate({ projId: item.project.id, inCv: true })}
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
