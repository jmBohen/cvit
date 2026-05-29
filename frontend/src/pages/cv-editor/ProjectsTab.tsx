import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDataItems, getCvItems, addItemToCv, removeItemFromCv, createDataItem } from '../../api/dataItems';
import type { Project } from '../../types/api';

function AddProjectForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const mutation = useMutation({
    mutationFn: (data: any) => createDataItem('project', data),
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
      mutation.mutate({ 
        name, 
        description, 
        techStack,
        githubUrl,
        liveUrl,
        startDate, 
        endDate
      }); 
    }} style={{ marginBottom: '20px', padding: '10px', border: '1px dashed #ccc', display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <h4>Dodaj projekt</h4>
      <input type="text" placeholder="Nazwa projektu" value={name} onChange={e => setName(e.target.value)} required />
      <input type="text" placeholder="Tech stack (np. React, Node.js)" value={techStack} onChange={e => setTechStack(e.target.value)} />
      <input type="url" placeholder="URL GitHub" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} />
      <input type="url" placeholder="URL Live" value={liveUrl} onChange={e => setLiveUrl(e.target.value)} />
      <input type="date" placeholder="Data rozpoczęcia" value={startDate} onChange={e => setStartDate(e.target.value)} />
      <input type="date" placeholder="Data zakończenia" value={endDate} onChange={e => setEndDate(e.target.value)} />
      <textarea placeholder="Opis" value={description} onChange={e => setDescription(e.target.value)} />
      <button type="submit">Dodaj</button>
    </form>
  );
}

export default function ProjectsTab({ cvId }: { cvId: number }) {
  const queryClient = useQueryClient();

  const { data: allProjects } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => getDataItems('project'),
  });

  const { data: cvProjects } = useQuery<any[]>({
    queryKey: ['cv-projects', cvId],
    queryFn: () => getCvItems(cvId, 'project'),
  });

  const cvProjIds = new Set(cvProjects?.map((p) => p.project.id));

  const mutation = useMutation({
    mutationFn: ({ projId, inCv }: { projId: number; inCv: boolean }) =>
      inCv
        ? removeItemFromCv(cvId, 'project', projId)
        : addItemToCv(cvId, 'project', projId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cv-projects', cvId] }),
  });

  return (
    <div style={{ display: 'flex', width: '100%', gap: '20px' }}>
      <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
        <h3>Moje projekty</h3>
        <AddProjectForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ['projects'] })} />
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {allProjects?.map((proj) => (
            <li key={proj.id} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
              <label style={{ fontWeight: 'bold' }}>
                <input
                  type="checkbox"
                  checked={cvProjIds.has(proj.id)}
                  onChange={() => mutation.mutate({ projId: proj.id, inCv: cvProjIds.has(proj.id) })}
                  style={{ marginRight: '10px' }}
                />
                {proj.name}
              </label>
              <div style={{ fontSize: '0.9em', marginLeft: '25px', color: '#666' }}>
                {proj.techStack && <div>Stack: {proj.techStack}</div>}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
        <h3>Zawartość CV</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {cvProjects?.map((item) => (
            <li key={item.id} style={{ marginBottom: '10px' }}>
              <strong>✓ {item.project.name}</strong><br/>
              {item.project.techStack}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
