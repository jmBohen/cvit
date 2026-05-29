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
      mutation.mutate({ 
        company, 
        position, 
        startDate, 
        endDate: isCurrent ? null : endDate, 
        isCurrent, 
        description, 
        city 
      }); 
    }} style={{ marginBottom: '20px', padding: '10px', border: '1px dashed #ccc', display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <h4>Dodaj doświadczenie</h4>
      <input type="text" placeholder="Firma" value={company} onChange={e => setCompany(e.target.value)} required />
      <input type="text" placeholder="Stanowisko" value={position} onChange={e => setPosition(e.target.value)} required />
      <input type="date" placeholder="Data rozpoczęcia" value={startDate} onChange={e => setStartDate(e.target.value)} required />
      <label>
        <input type="checkbox" checked={isCurrent} onChange={e => setIsCurrent(e.target.checked)} />
        Obecnie pracuję
      </label>
      {!isCurrent && <input type="date" placeholder="Data zakończenia" value={endDate} onChange={e => setEndDate(e.target.value)} required />}
      <input type="text" placeholder="Miasto" value={city} onChange={e => setCity(e.target.value)} />
      <textarea placeholder="Opis" value={description} onChange={e => setDescription(e.target.value)} />
      <button type="submit">Dodaj</button>
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
    <div style={{ display: 'flex', width: '100%', gap: '20px' }}>
      <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
        <h3>Moje doświadczenie</h3>
        <AddExperienceForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ['experiences'] })} />
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {allExperiences?.map((exp) => (
            <li key={exp.id} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
              <label style={{ fontWeight: 'bold' }}>
                <input
                  type="checkbox"
                  checked={cvExpIds.has(exp.id)}
                  onChange={() => mutation.mutate({ expId: exp.id, inCv: cvExpIds.has(exp.id) })}
                  style={{ marginRight: '10px' }}
                />
                {exp.position} w {exp.company}
              </label>
              <div style={{ fontSize: '0.9em', marginLeft: '25px', color: '#666' }}>
                {exp.startDate} - {exp.isCurrent ? 'Obecnie' : exp.endDate} | {exp.city}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
        <h3>Zawartość CV</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {cvExperiences?.map((item) => (
            <li key={item.id} style={{ marginBottom: '10px' }}>
              <strong>✓ {item.experience.position}</strong><br/>
              {item.experience.company}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
