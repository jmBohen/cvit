import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDataItems, getCvItems, addItemToCv, removeItemFromCv, createDataItem } from '../../api/dataItems';
import type { Education } from '../../types/api';

function AddEducationForm({ onSuccess }: { onSuccess: () => void }) {
  const [school, setSchool] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [description, setDescription] = useState('');
  
  const mutation = useMutation({
    mutationFn: (data: any) => createDataItem('education', data),
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
      mutation.mutate({ 
        school, 
        degree, 
        fieldOfStudy,
        startDate, 
        endDate: isCurrent ? null : endDate, 
        isCurrent, 
        description
      }); 
    }} style={{ marginBottom: '20px', padding: '10px', border: '1px dashed #ccc', display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <h4>Dodaj edukację</h4>
      <input type="text" placeholder="Uczelnia / Szkoła" value={school} onChange={e => setSchool(e.target.value)} required />
      <input type="text" placeholder="Stopień (np. Inżynier)" value={degree} onChange={e => setDegree(e.target.value)} />
      <input type="text" placeholder="Kierunek" value={fieldOfStudy} onChange={e => setFieldOfStudy(e.target.value)} />
      <input type="date" placeholder="Data rozpoczęcia" value={startDate} onChange={e => setStartDate(e.target.value)} required />
      <label>
        <input type="checkbox" checked={isCurrent} onChange={e => setIsCurrent(e.target.checked)} />
        W trakcie
      </label>
      {!isCurrent && <input type="date" placeholder="Data zakończenia" value={endDate} onChange={e => setEndDate(e.target.value)} required />}
      <textarea placeholder="Opis" value={description} onChange={e => setDescription(e.target.value)} />
      <button type="submit">Dodaj</button>
    </form>
  );
}

export default function EducationTab({ cvId }: { cvId: number }) {
  const queryClient = useQueryClient();

  const { data: allEducations } = useQuery<Education[]>({
    queryKey: ['educations'],
    queryFn: () => getDataItems('education'),
  });

  const { data: cvEducations } = useQuery<any[]>({
    queryKey: ['cv-educations', cvId],
    queryFn: () => getCvItems(cvId, 'education'),
  });

  const cvEduIds = new Set(cvEducations?.map((e) => e.education.id));

  const mutation = useMutation({
    mutationFn: ({ eduId, inCv }: { eduId: number; inCv: boolean }) =>
      inCv
        ? removeItemFromCv(cvId, 'education', eduId)
        : addItemToCv(cvId, 'education', eduId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cv-educations', cvId] }),
  });

  return (
    <div style={{ display: 'flex', width: '100%', gap: '20px' }}>
      <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
        <h3>Moja edukacja</h3>
        <AddEducationForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ['educations'] })} />
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {allEducations?.map((edu) => (
            <li key={edu.id} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
              <label style={{ fontWeight: 'bold' }}>
                <input
                  type="checkbox"
                  checked={cvEduIds.has(edu.id)}
                  onChange={() => mutation.mutate({ eduId: edu.id, inCv: cvEduIds.has(edu.id) })}
                  style={{ marginRight: '10px' }}
                />
                {edu.school}
              </label>
              <div style={{ fontSize: '0.9em', marginLeft: '25px', color: '#666' }}>
                {edu.fieldOfStudy && `${edu.fieldOfStudy} `}{edu.degree && `(${edu.degree})`}<br/>
                {edu.startDate} - {edu.isCurrent ? 'Obecnie' : edu.endDate}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
        <h3>Zawartość CV</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {cvEducations?.map((item) => (
            <li key={item.id} style={{ marginBottom: '10px' }}>
              <strong>✓ {item.education.school}</strong><br/>
              {item.education.fieldOfStudy} {item.education.degree && `(${item.education.degree})`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
